import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

/*
 * Explainer videos start with sound (Halyl, 11 Nov 2026), so people notice there is a voice.
 * Browsers only allow sound after the visitor has tapped, clicked or pressed a key on the site
 * (a click on a menu link before this page counts too). So: on screen we try to play with sound;
 * if the browser refuses, the video plays muted and gets its sound on the visitor's first tap anywhere.
 * The "Ton aus" button always wins: once the visitor mutes a video, it stays muted.
 * Off screen the video pauses.
 */

const listeners = new Set<() => void>();
let armed = false;
function onFirstGesture(fn: () => void) {
  listeners.add(fn);
  if (!armed && typeof window !== "undefined") {
    armed = true;
    // a tap on the sound button is handled by the button itself (else it would unmute here and mute again there)
    const fire = (e: Event) => {
      if ((e.target as Element | null)?.closest?.("[data-sound-toggle]")) return;
      listeners.forEach((f) => f());
    };
    for (const ev of ["pointerdown", "pointerup", "touchend", "keydown", "click"]) window.addEventListener(ev, fire, { capture: true, passive: true });
  }
  return () => listeners.delete(fn);
}

export function useSoundVideo(video: RefObject<HTMLVideoElement | null>, key: unknown) {
  const [muted, setMuted] = useState(true);
  const userMuted = useRef(false); // the visitor pressed "Ton aus"
  const inView = useRef(false);

  // play with sound; fall back to muted when the browser blocks it
  const playLoud = useCallback(() => {
    const el = video.current;
    if (!el) return;
    if (userMuted.current) {
      el.muted = true;
      setMuted(true);
      el.play().catch(() => {});
      return;
    }
    el.muted = false;
    el.play()
      .then(() => setMuted(el.muted))
      .catch(() => {
        el.muted = true;
        setMuted(true);
        el.play().catch(() => {});
      });
  }, [video]);

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        inView.current = e.isIntersecting && e.intersectionRatio > 0.5;
        if (inView.current) playLoud();
        else el.pause();
      },
      { threshold: [0, 0.5, 1] },
    );
    io.observe(el);
    // first tap anywhere: a muted (blocked) video on screen gets its sound
    const off = onFirstGesture(() => {
      if (inView.current && el.muted && !userMuted.current) playLoud();
    });
    return () => {
      io.disconnect();
      off();
    };
  }, [video, key, playLoud]);

  const toggle = useCallback(() => {
    const el = video.current;
    if (!el) return;
    el.muted = !el.muted;
    userMuted.current = el.muted;
    if (!el.muted && el.paused) el.play().catch(() => {});
    setMuted(el.muted);
  }, [video]);

  return { muted, toggle };
}
