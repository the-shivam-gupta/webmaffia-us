import { NextResponse } from "next/server";

// In-memory cache for the redirect map. Persists for the lifetime of the
// proxy runtime instance (reset on cold start / redeploy), so most
// requests never hit Strapi at all.
const REDIRECTS_CACHE_TTL_MS = 60_000;
let redirectsCache = null; // { map: Map<string,{destination,permanent}>, fetchedAt: number }
let inFlightFetch = null;

function getStrapiApiBaseUrl() {
    const raw = process.env.STRAPI_API_URL?.trim();
    if (!raw) return "";

    try {
        const url = new URL(raw);
        return url.origin;
    } catch {
        return raw.replace(/\/admin(?:\/.*)?$/i, "").replace(/\/$/, "");
    }
}

function normalizePath(pathname) {
    if (pathname.length > 1 && pathname.endsWith("/")) {
        return pathname.slice(0, -1);
    }
    return pathname;
}

async function fetchRedirectsFromStrapi() {
    const strapiBaseUrl = getStrapiApiBaseUrl();
    const token = process.env.STRAPI_API_TOKEN;
    if (!strapiBaseUrl) return new Map();

    const map = new Map();
    let page = 1;
    let pageCount = 1;

    try {
        do {
            const response = await fetch(
                `${strapiBaseUrl}/api/redirects?filters[isActive][$eq]=true&pagination[page]=${page}&pagination[pageSize]=100`,
                {
                    headers: {
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                        "Content-Type": "application/json",
                    },
                    signal: AbortSignal.timeout(5000),
                }
            );

            if (!response.ok) break;

            const data = await response.json();
            for (const entry of data.data ?? []) {
                const fields = entry.attributes ?? entry;
                const source = fields.source?.trim();
                const destination = fields.destination?.trim();
                if (!source || !destination) continue;

                map.set(normalizePath(source), {
                    destination,
                    permanent: fields.redirectType !== "temporary-302",
                });
            }

            pageCount = data.meta?.pagination?.pageCount ?? 1;
            page += 1;
        } while (page <= pageCount);
    } catch (error) {
        console.error("Failed to fetch redirects from Strapi:", error);
    }

    return map;
}

async function getRedirectsMap() {
    const now = Date.now();
    if (redirectsCache && now - redirectsCache.fetchedAt < REDIRECTS_CACHE_TTL_MS) {
        return redirectsCache.map;
    }

    // Serve stale cache while a single background refresh is in flight,
    // so concurrent requests don't all trigger their own Strapi fetch.
    if (!inFlightFetch) {
        inFlightFetch = fetchRedirectsFromStrapi()
            .then((map) => {
                redirectsCache = { map, fetchedAt: Date.now() };
                return map;
            })
            .finally(() => {
                inFlightFetch = null;
            });
    }

    if (redirectsCache) return redirectsCache.map;
    return inFlightFetch;
}

// Blog + author are the only localized sections. English keeps the unprefixed
// URL (served internally from /en/...); other locales use /<lang>/....
const LOCALIZED_SECTION = /^\/(blog|author)(\/.*)?$/;
const EN_PREFIXED_SECTION = /^\/en\/(blog|author)(\/.*)?$/;

export async function proxy(request) {
    const { pathname } = request.nextUrl;

    // 1. Strapi-managed redirects win, so a request is never redirected twice.
    const redirects = await getRedirectsMap();
    const match = redirects.get(normalizePath(pathname));

    if (match) {
        const destination = match.destination.startsWith("http")
            ? match.destination
            : new URL(match.destination, request.url);

        return NextResponse.redirect(destination, match.permanent ? 308 : 307);
    }

    // 2. /en/blog... is not a public URL: send it to the single canonical,
    //    unprefixed English URL.
    if (EN_PREFIXED_SECTION.test(pathname)) {
        const url = request.nextUrl.clone();
        url.pathname = normalizePath(pathname.slice("/en".length));
        return NextResponse.redirect(url, 308);
    }

    // 3. Unprefixed blog/author paths are English: rewrite internally (no redirect).
    if (LOCALIZED_SECTION.test(pathname)) {
        const url = request.nextUrl.clone();
        url.pathname = `/en${normalizePath(pathname)}`;
        return NextResponse.rewrite(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|assets/).*)"],
};
