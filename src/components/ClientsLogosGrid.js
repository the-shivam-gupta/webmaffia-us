"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const BATCH_SIZE = 24;
const SKELETON_COUNT = 4;

export default function ClientsLogosGrid({ logos }) {
  const [visibleCount, setVisibleCount] = useState(
    Math.min(BATCH_SIZE, logos.length)
  );
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef(null);
  const loadTimeoutRef = useRef(null);

  const hasMore = visibleCount < logos.length;
  const visibleLogos = logos.slice(0, visibleCount);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;

    setLoading(true);
    loadTimeoutRef.current = setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, logos.length));
      setLoading(false);
    }, 350);
  }, [hasMore, loading, logos.length]);

  useEffect(() => {
    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "240px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadMore, loading, visibleCount]);

  return (
    <section className="clients_logos">
      <div className="work_box">
        {visibleLogos.map((client) => (
          <div key={client.id} className="clients_logo">
            <Image
              src={client.src}
              alt={client.alt}
              width={client.width}
              height={client.height}
              loading="lazy"
            />
          </div>
        ))}

        {loading &&
          Array.from({ length: SKELETON_COUNT }, (_, index) => (
            <div
              key={`skeleton-${index}`}
              className="clients_logo clients_logo--skeleton"
              aria-hidden="true"
            />
          ))}
      </div>

      {hasMore && !loading && (
        <div ref={sentinelRef} className="clients_logos_sentinel" aria-hidden="true" />
      )}
    </section>
  );
}
