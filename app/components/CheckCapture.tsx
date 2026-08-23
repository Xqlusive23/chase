"use client";

import { useEffect, useRef, useState } from "react";

type Side = "front" | "back";

export function CheckCapture({
  onCaptured,
}: {
  onCaptured: (shots: { front: string; back: string }) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [side, setSide] = useState<Side>("front");
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function start() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError("This device cannot open a camera. Use Open camera to snap the check.");
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setReady(true);
        setError("");
      } catch {
        setError("Allow camera access, then snap the front and back of the check.");
      }
    }

    start();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  function takeFrame() {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return "";
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    return canvas.toDataURL("image/jpeg", 0.82);
  }

  function keepShot(data: string) {
    if (!data) return;
    if (side === "front") {
      setFront(data);
      setSide("back");
      return;
    }
    setBack(data);
    streamRef.current?.getTracks().forEach((track) => track.stop());
    setReady(false);
    onCaptured({ front, back: data });
  }

  function handleFile(file?: File) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => keepShot(String(reader.result ?? ""));
    reader.readAsDataURL(file);
  }

  function retake() {
    setFront("");
    setBack("");
    setSide("front");
  }

  return (
    <div data-no-swipe className="space-y-3">
      <div className="relative overflow-hidden rounded-2xl bg-black">
        <div className="aspect-[16/10]">
          {ready ? (
            <video ref={videoRef} playsInline muted className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center text-sm text-white/80">
              {error || "Opening camera…"}
            </div>
          )}
        </div>
        <div className="pointer-events-none absolute inset-4 rounded-xl border-2 border-dashed border-white/70" />
        <p className="absolute bottom-3 left-0 right-0 text-center text-sm font-semibold text-white">
          Snap the {side} of the check
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {front && <img src={front} alt="Check front" className="h-20 w-full rounded-lg object-cover" />}
        {back && <img src={back} alt="Check back" className="h-20 w-full rounded-lg object-cover" />}
      </div>

      <div className="flex flex-wrap gap-2">
        {ready ? (
          <button type="button" onClick={() => keepShot(takeFrame())} className="btn-primary flex-1">
            Snap {side}
          </button>
        ) : (
          <button type="button" onClick={() => fileRef.current?.click()} className="btn-primary flex-1">
            Open camera
          </button>
        )}
        {(front || back) && (
          <button type="button" onClick={retake} className="btn-secondary w-full">
            Retake both sides
          </button>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(event) => {
          handleFile(event.target.files?.[0]);
          event.target.value = "";
        }}
      />
      {error && <p className="text-sm text-[var(--muted)]">{error}</p>}
    </div>
  );
}
