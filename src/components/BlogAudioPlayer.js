"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SPEEDS = [1, 1.25, 1.5, 0.85];
const MAX_CHUNK = 220;

// Microsoft's Indian-English female voices first (Edge / Windows), then any
// other en-IN voice that is not obviously male.
const PREFERRED_VOICES = ["neerja", "heera", "veena", "priya", "kalpana"];
const MALE_HINTS = ["prabhat", "ravi", "hemant", "male"];

// Ordered list of voices to try. Some listed voices (e.g. the legacy "Heera")
// fail to synthesise on certain machines, so playback walks down this list.
const FEMALE_FALLBACKS = ["zira", "aria", "jenny", "samantha", "female"];

function buildVoiceCandidates(voices) {
  const indian = voices.filter((v) => /^en[-_]IN$/i.test(v.lang));
  const isMale = (v) => MALE_HINTS.some((hint) => v.name.toLowerCase().includes(hint));
  const ordered = [];
  for (const name of PREFERRED_VOICES) {
    ordered.push(...indian.filter((v) => v.name.toLowerCase().includes(name)));
  }
  ordered.push(...indian.filter((v) => !isMale(v)));
  for (const name of FEMALE_FALLBACKS) {
    ordered.push(
      ...voices.filter(
        (v) => /^en/i.test(v.lang) && v.name.toLowerCase().includes(name)
      )
    );
  }
  const unique = [...new Set(ordered)];
  return [...unique, null]; // null = the browser's default voice
}

// Long utterances get cut off by some engines, so speak sentence by sentence.
function splitIntoChunks(text) {
  const sentences =
    text.replace(/\s+/g, " ").match(/[^.!?\n]+[.!?]*\s*/g) ?? [text];
  const chunks = [];
  let current = "";
  for (const sentence of sentences) {
    if ((current + sentence).length > MAX_CHUNK && current) {
      chunks.push(current.trim());
      current = "";
    }
    current += sentence;
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

function getArticleText() {
  const title = document.querySelector(".blog_detail h1")?.innerText ?? "";
  const body =
    document.querySelector(".blog_page .blog_content")?.innerText ?? "";
  return `${title}. ${body}`;
}

export default function BlogAudioPlayer() {
  const [supported, setSupported] = useState(true);
  const [voice, setVoice] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | playing | paused
  const [progress, setProgress] = useState(0);
  const [speedIndex, setSpeedIndex] = useState(0);

  const chunksRef = useRef([]);
  const indexRef = useRef(0);
  const sessionRef = useRef(0);
  const speedRef = useRef(SPEEDS[0]);
  const voiceRef = useRef(null);
  const candidatesRef = useRef([null]);
  const candidateIndexRef = useRef(0);
  // Browsers can garbage-collect an utterance before it finishes, which
  // silently drops the onend event and stops playback after one sentence.
  const utteranceRef = useRef(null);
  const startTimerRef = useRef(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
      return undefined;
    }
    const synth = window.speechSynthesis;
    const loadVoices = () => {
      const list = buildVoiceCandidates(synth.getVoices());
      candidatesRef.current = list;
      candidateIndexRef.current = 0;
      voiceRef.current = list[0];
      setVoice(list[0]);
    };
    loadVoices();
    synth.addEventListener("voiceschanged", loadVoices);
    return () => {
      synth.removeEventListener("voiceschanged", loadVoices);
      sessionRef.current += 1;
      clearTimeout(startTimerRef.current);
      synth.cancel();
    };
  }, []);

  const speakFrom = useCallback((startIndex) => {
    const synth = window.speechSynthesis;
    const session = ++sessionRef.current;
    synth.cancel();
    clearTimeout(startTimerRef.current);
    indexRef.current = startIndex;

    // current voice failed: reset the engine and move to the next candidate
    const tryNextVoice = () => {
      if (session !== sessionRef.current) return;
      clearTimeout(startTimerRef.current);
      synth.cancel();
      const nextIndex = candidateIndexRef.current + 1;
      if (nextIndex >= candidatesRef.current.length) {
        setStatus("idle");
        setError(true);
        return;
      }
      candidateIndexRef.current = nextIndex;
      voiceRef.current = candidatesRef.current[nextIndex];
      setVoice(voiceRef.current);
      setTimeout(speakNext, 150);
    };

    const speakNext = () => {
      if (session !== sessionRef.current) return;
      const i = indexRef.current;
      const chunks = chunksRef.current;
      if (i >= chunks.length) {
        setStatus("idle");
        setProgress(0);
        indexRef.current = 0;
        return;
      }
      const utterance = new SpeechSynthesisUtterance(chunks[i]);
      utterance.lang = "en-IN";
      if (voiceRef.current) utterance.voice = voiceRef.current;
      utterance.rate = speedRef.current;
      utterance.onstart = () => {
        clearTimeout(startTimerRef.current);
      };
      utterance.onend = () => {
        clearTimeout(startTimerRef.current);
        if (session !== sessionRef.current) return;
        indexRef.current += 1;
        setProgress(Math.round((indexRef.current / chunks.length) * 100));
        speakNext();
      };
      utterance.onerror = (event) => {
        clearTimeout(startTimerRef.current);
        if (event.error === "interrupted" || event.error === "canceled") return;
        if (session !== sessionRef.current) return;
        tryNextVoice();
      };
      utteranceRef.current = utterance;

      // if the chosen voice never starts (e.g. an online voice that is
      // unreachable), fall back to the default voice
      clearTimeout(startTimerRef.current);
      startTimerRef.current = setTimeout(() => {
        if (session !== sessionRef.current) return;
        tryNextVoice();
      }, 4000);

      synth.speak(utterance);
    };

    setError(false);
    setStatus("playing");
    // Chrome can stay paused after a cancel, which makes speak() a no-op
    synth.resume();
    setTimeout(speakNext, 80);
  }, []);

  const handleToggle = () => {
    const synth = window.speechSynthesis;
    if (status === "playing") {
      synth.pause();
      setStatus("paused");
      return;
    }
    if (status === "paused") {
      synth.resume();
      setStatus("playing");
      return;
    }
    const chunks = splitIntoChunks(getArticleText());
    if (!chunks.length) {
      setError(true);
      return;
    }
    chunksRef.current = chunks;
    speakFrom(0);
  };

  const handleStop = () => {
    sessionRef.current += 1;
    clearTimeout(startTimerRef.current);
    window.speechSynthesis.cancel();
    indexRef.current = 0;
    setStatus("idle");
    setProgress(0);
  };

  const handleSpeed = () => {
    const next = (speedIndex + 1) % SPEEDS.length;
    setSpeedIndex(next);
    speedRef.current = SPEEDS[next];
    // restart the current sentence at the new rate
    if (status === "playing") speakFrom(indexRef.current);
  };

  if (!supported) return null;

  const playing = status === "playing";
  const voiceLabel = voice
    ? voice.name.replace(/^Microsoft\s+/i, "").replace(/\s*-\s*English.*$/i, "")
    : "Default voice";

  return (
    <div className={`blog_audio${status !== "idle" ? " is_active" : ""}`}>
      <button
        type="button"
        className="blog_audio_play"
        onClick={handleToggle}
        aria-label={playing ? "Pause audio" : "Listen to this article"}
      >
        {playing ? (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
          </svg>
        )}
      </button>

      <div className="blog_audio_body">
        <div className="blog_audio_title">
          {status === "idle"
            ? "Listen to this article"
            : playing
              ? "Now playing"
              : "Paused"}
        </div>
        <div className="blog_audio_meta">{error ? "Audio is not available in this browser" : `${voiceLabel}${voice?.lang ? ` · ${voice.lang}` : ""}`}</div>
        <div className="blog_audio_track" aria-hidden="true">
          <span style={{ transform: `scaleX(${progress / 100})` }} />
        </div>
      </div>

      <div className="blog_audio_actions">
        <button
          type="button"
          className="blog_audio_speed"
          onClick={handleSpeed}
          aria-label="Change playback speed"
        >
          {SPEEDS[speedIndex]}x
        </button>
        {status !== "idle" ? (
          <button
            type="button"
            className="blog_audio_stop"
            onClick={handleStop}
            aria-label="Stop audio"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="6" y="6" width="12" height="12" rx="1.5" fill="currentColor" />
            </svg>
          </button>
        ) : null}
      </div>
    </div>
  );
}
