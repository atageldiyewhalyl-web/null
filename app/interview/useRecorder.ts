import { useCallback, useEffect, useRef, useState } from "react";

const MAX_SECONDS = 120;
const MIME_TYPES = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/aac"];

export type RecorderState = "idle" | "recording" | "denied" | "unsupported";

/** Records a voice message with MediaRecorder; resolves the blob on stop (null when cancelled). */
export function useRecorder() {
  const [state, setState] = useState<RecorderState>("idle");
  const [seconds, setSeconds] = useState(0);
  const recorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const resolver = useRef<((result: { blob: Blob; filename: string } | null) => void) | null>(null);
  const cancelled = useRef(false);
  const timer = useRef<number | null>(null);

  const cleanup = useCallback(() => {
    if (timer.current) window.clearInterval(timer.current);
    timer.current = null;
    recorder.current?.stream.getTracks().forEach((t) => t.stop());
    recorder.current = null;
  }, []);

  useEffect(() => cleanup, [cleanup]);

  const start = useCallback(async () => {
    if (typeof MediaRecorder === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setState("unsupported");
      return null;
    }
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setState("denied");
      return null;
    }
    const mimeType = MIME_TYPES.find((t) => MediaRecorder.isTypeSupported?.(t)) ?? "";
    const rec = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    chunks.current = [];
    cancelled.current = false;
    rec.ondataavailable = (e) => e.data.size && chunks.current.push(e.data);
    const done = new Promise<{ blob: Blob; filename: string } | null>((resolve) => (resolver.current = resolve));
    rec.onstop = () => {
      const type = rec.mimeType || mimeType || "audio/webm";
      const ext = type.includes("mp4") || type.includes("aac") ? "m4a" : "webm";
      const blob = new Blob(chunks.current, { type });
      cleanup();
      setState("idle");
      setSeconds(0);
      resolver.current?.(cancelled.current || blob.size === 0 ? null : { blob, filename: `recording.${ext}` });
    };
    recorder.current = rec;
    rec.start();
    setState("recording");
    setSeconds(0);
    timer.current = window.setInterval(() => {
      setSeconds((s) => {
        if (s + 1 >= MAX_SECONDS) recorder.current?.stop();
        return s + 1;
      });
    }, 1000);
    return done;
  }, [cleanup]);

  const stop = useCallback(() => recorder.current?.stop(), []);
  const cancel = useCallback(() => {
    cancelled.current = true;
    recorder.current?.stop();
  }, []);
  const reset = useCallback(() => setState("idle"), []);

  return { state, seconds, start, stop, cancel, reset };
}
