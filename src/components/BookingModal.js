"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

// "Book a 20-min call" pop-up: a custom calendar that reads live availability
// from Cal.com's public API v2 and books through it (Cal.com sends the
// confirmation + Cal Video link). No third-party script is loaded.

const API = "https://api.cal.com/v2";
const CAL_USERNAME = "veera-ghyara-z4cnxq";
const CAL_EVENT_SLUG = "schedule-a-20-minute-call";
const BOOK_URL = `https://cal.com/${CAL_USERNAME}/${CAL_EVENT_SLUG}`;
const MONTHS_AHEAD = 3;
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const pad = (n) => String(n).padStart(2, "0");
const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
const addMonths = (d, n) => new Date(d.getFullYear(), d.getMonth() + n, 1);

function Icon({ children, size = 16 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function BookingFlow({ open }) {
  const timeZone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, []);
  const today = useMemo(() => new Date(), []);
  const firstMonth = useMemo(() => startOfMonth(today), [today]);

  const [month, setMonth] = useState(firstMonth);
  const [slots, setSlots] = useState({}); // monthKey -> day -> ISO[]
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [day, setDay] = useState(null);
  const [slot, setSlot] = useState(null);
  const [use24h, setUse24h] = useState(false);
  const [step, setStep] = useState("pick"); // pick | form | done

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [confirmed, setConfirmed] = useState(null);

  const monthKey = ymd(month).slice(0, 7);
  const monthSlots = slots[monthKey];

  const loadMonth = useCallback(
    async (m, force = false) => {
      const key = ymd(m).slice(0, 7);
      if (!force && slots[key]) return;
      setLoading(true);
      setLoadError(false);
      const from = m < today ? today : m;
      const to = new Date(m.getFullYear(), m.getMonth() + 1, 0);
      try {
        const qs = new URLSearchParams({
          username: CAL_USERNAME,
          eventTypeSlug: CAL_EVENT_SLUG,
          start: ymd(from),
          end: ymd(to),
          timeZone,
        });
        const res = await fetch(`${API}/slots?${qs}`, {
          headers: { "cal-api-version": "2024-09-04" },
        });
        if (!res.ok) throw new Error(String(res.status));
        const json = await res.json();
        const byDay = {};
        Object.entries(json.data ?? {}).forEach(([d, list]) => {
          byDay[d] = list.map((s) => s.start);
        });
        setSlots((prev) => ({ ...prev, [key]: byDay }));
      } catch {
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    },
    [slots, today, timeZone],
  );

  useEffect(() => {
    if (!open) return undefined;
    const t = window.setTimeout(() => loadMonth(month), 0);
    return () => window.clearTimeout(t);
  }, [open, month, loadMonth]);

  // Re-opening after a finished booking starts fresh.
  useEffect(() => {
    if (!open || step !== "done") return undefined;
    const t = window.setTimeout(() => {
      setStep("pick");
      setSlot(null);
      setConfirmed(null);
      setNotes("");
      setSlots({});
    }, 0);
    return () => window.clearTimeout(t);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const availableDays = useMemo(
    () =>
      Object.keys(monthSlots ?? {})
        .filter((d) => (monthSlots?.[d]?.length ?? 0) > 0)
        .sort(),
    [monthSlots],
  );
  const activeDay = day && monthSlots?.[day]?.length ? day : (availableDays[0] ?? null);

  const fmtTime = (iso) =>
    new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: !use24h });
  const fmtDayLong = (iso) =>
    new Date(iso).toLocaleDateString([], { weekday: "long", day: "numeric", month: "long" });
  const fmtDayShort = (d) =>
    new Date(`${d}T00:00:00`).toLocaleDateString([], { weekday: "short", day: "numeric", month: "short" });

  const cells = useMemo(() => {
    const first = month.getDay();
    const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    return [
      ...Array.from({ length: first }, () => null),
      ...Array.from({ length: count }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1)),
    ];
  }, [month]);

  const canPrev = month > firstMonth;
  const canNext = month < addMonths(firstMonth, MONTHS_AHEAD);

  const pickSlot = (iso) => {
    setSlot(iso);
    setSubmitError(null);
    setStep("form");
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!slot) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch(`${API}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "cal-api-version": "2024-08-13" },
        body: JSON.stringify({
          start: new Date(slot).toISOString(),
          username: CAL_USERNAME,
          eventTypeSlug: CAL_EVENT_SLUG,
          attendee: { name: name.trim(), email: email.trim(), timeZone, language: "en" },
          ...(notes.trim() ? { bookingFieldsResponses: { notes: notes.trim() } } : {}),
        }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || json?.status !== "success") {
        throw new Error(json?.error?.message || "The booking couldn't be completed.");
      }
      setConfirmed({ start: json.data?.start ?? slot, email: email.trim() });
      setStep("done");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      setSubmitError(
        /no longer available|already|taken|conflict/i.test(msg)
          ? "That time was just taken - please pick another slot."
          : "Something went wrong while booking. Please try again, or book on Cal.com.",
      );
      loadMonth(month, true);
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------- Done ----------------
  if (step === "done" && confirmed) {
    return (
      <div className="bk_done">
        <span className="bk_done_icon">
          <Icon size={22}>
            <path d="M20 6 9 17l-5-5" />
          </Icon>
        </span>
        <h3 className="bk_done_title">You&apos;re booked.</h3>
        <p className="bk_done_when">
          {fmtDayLong(confirmed.start)} · {fmtTime(confirmed.start)}
        </p>
        <p className="bk_done_text">
          A confirmation with the Cal Video link is on its way to <strong>{confirmed.email}</strong>.
          Talk soon!
        </p>
      </div>
    );
  }

  // ---------------- Form ----------------
  if (step === "form" && slot) {
    return (
      <form className="bk_form" onSubmit={submit}>
        <button type="button" className="bk_back" onClick={() => setStep("pick")}>
          <Icon size={14}>
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </Icon>
          Change time
        </button>

        <div className="bk_summary">
          <span className="bk_summary_label">Selected</span>
          <span className="bk_summary_when">
            {fmtDayLong(slot)} · {fmtTime(slot)}
          </span>
          <span className="bk_summary_meta">20 min · {timeZone.replace(/_/g, " ")}</span>
        </div>

        <label className="bk_field">
          <span>Your name</span>
          <input required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="bk_field">
          <span>Email</span>
          <input
            required
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="bk_field">
          <span>
            What would you like to discuss? <em>Optional</em>
          </span>
          <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </label>

        {submitError && (
          <p className="bk_error" role="alert">
            {submitError}{" "}
            <a href={BOOK_URL} target="_blank" rel="noopener noreferrer">
              Open Cal.com
            </a>
          </p>
        )}

        <button type="submit" className="bk_confirm" disabled={submitting}>
          {submitting ? "Booking…" : "Confirm booking"}
        </button>
      </form>
    );
  }

  // ---------------- Pick date + time ----------------
  const daySlots = activeDay ? (monthSlots?.[activeDay] ?? []) : [];

  return (
    <div className="bk_pick">
      <div className="bk_calendar">
        <div className="bk_monthbar">
          <span className="bk_monthname">
            {month.toLocaleDateString([], { month: "long" })} <span>{month.getFullYear()}</span>
          </span>
          <div className="bk_monthnav">
            <button
              type="button"
              onClick={() => {
                setDay(null);
                setMonth(addMonths(month, -1));
              }}
              disabled={!canPrev}
              aria-label="Previous month"
            >
              <Icon>
                <path d="m15 18-6-6 6-6" />
              </Icon>
            </button>
            <button
              type="button"
              onClick={() => {
                setDay(null);
                setMonth(addMonths(month, 1));
              }}
              disabled={!canNext}
              aria-label="Next month"
            >
              <Icon>
                <path d="m9 18 6-6-6-6" />
              </Icon>
            </button>
          </div>
        </div>

        <div className="bk_grid" role="grid" aria-busy={loading}>
          {WEEKDAYS.map((w) => (
            <span key={w} className="bk_weekday" aria-hidden="true">
              {w}
            </span>
          ))}
          {cells.map((d, i) => {
            if (!d) return <span key={`b${i}`} />;
            const key = ymd(d);
            const available = (monthSlots?.[key]?.length ?? 0) > 0;
            const selected = key === activeDay;
            const cls = [
              "bk_day",
              available && "is-available",
              selected && "is-selected",
              key === ymd(today) && "is-today",
            ]
              .filter(Boolean)
              .join(" ");
            return (
              <button
                key={key}
                type="button"
                className={cls}
                disabled={!available}
                aria-pressed={selected}
                aria-label={d.toLocaleDateString([], { weekday: "long", day: "numeric", month: "long" })}
                onClick={() => setDay(key)}
              >
                {d.getDate()}
              </button>
            );
          })}
        </div>

        <p className="bk_tz">Times shown in {timeZone.replace(/_/g, " ")}</p>
      </div>

      <div className="bk_slots">
        <div className="bk_slots_head">
          <span className="bk_slots_day">{activeDay ? fmtDayShort(activeDay) : "Pick a date"}</span>
          <div className="bk_clock" role="group" aria-label="Time format">
            <button type="button" aria-pressed={!use24h} onClick={() => setUse24h(false)}>
              12h
            </button>
            <button type="button" aria-pressed={use24h} onClick={() => setUse24h(true)}>
              24h
            </button>
          </div>
        </div>

        {loading && !monthSlots ? (
          <p className="bk_state">Loading availability…</p>
        ) : loadError ? (
          <p className="bk_state">
            Couldn&apos;t load availability.{" "}
            <button type="button" className="bk_link" onClick={() => loadMonth(month, true)}>
              Try again
            </button>{" "}
            or{" "}
            <a href={BOOK_URL} target="_blank" rel="noopener noreferrer" className="bk_link">
              book on Cal.com
            </a>
          </p>
        ) : daySlots.length === 0 ? (
          <p className="bk_state">No open times this month - try the next one.</p>
        ) : (
          <ul className="bk_slot_list">
            {daySlots.map((iso) => (
              <li key={iso}>
                <button type="button" className="bk_slot" onClick={() => pickSlot(iso)}>
                  {fmtTime(iso)}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function BookingModal({ open, onClose }) {
  const [mounted, setMounted] = useState(open);
  if (open && !mounted) setMounted(true); // stay mounted after first open so it can fade out
  const dialogRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    html.classList.add("booking-open");
    closeRef.current?.focus({ preventScroll: true });

    const onKey = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const items = Array.from(
        dialogRef.current.querySelectorAll(
          'a[href], button:not([disabled]), input, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      html.style.overflow = prevOverflow;
      html.classList.remove("booking-open");
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <div className={`booking_modal${open ? " is-open" : ""}`} aria-hidden={!open}>
      <div className="booking_modal__backdrop" onClick={onClose} />
      <div
        ref={dialogRef}
        className="booking_modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        data-lenis-prevent
      >
        <button
          ref={closeRef}
          type="button"
          className="booking_modal__close"
          onClick={onClose}
          aria-label="Close booking"
          tabIndex={open ? 0 : -1}
        >
          <Icon size={18}>
            <path d="M18 6 6 18M6 6l12 12" />
          </Icon>
        </button>

        <aside className="booking_modal__intro">
          <span className="bk_label">Book a call</span>
          <h2 id="booking-title" className="bk_title">
            Have something
            <br />
            in mind?
          </h2>
          <p className="bk_desc">
            A quick conversation about your project. Pick a time that suits you - the calendar shows
            our live availability.
          </p>

          <dl className="bk_meta">
            <div className="bk_meta_row">
              <dt>
                <Icon size={15}>
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </Icon>
                Duration
              </dt>
              <dd>20 min</dd>
            </div>
            <div className="bk_meta_row">
              <dt>
                <Icon size={15}>
                  <rect x="2" y="6" width="14" height="12" rx="2" />
                  <path d="m22 8-6 4 6 4V8Z" />
                </Icon>
                Meeting
              </dt>
              <dd>Video call - Cal Video</dd>
            </div>
          </dl>
        </aside>

        <div className="booking_modal__booker">
          <BookingFlow open={open} />
        </div>
      </div>
    </div>,
    document.body,
  );
}
