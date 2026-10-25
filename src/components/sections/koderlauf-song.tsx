"use client";

import { motion } from "framer-motion";
import { Music, Play, Pause } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { fadeReveal, useStaticReveal } from "@/hooks/use-static-reveal";

type KoderlaufSongProps = {
  /** Variante: "hero" für Startseite (direkt nach Hero), "compact" für Galerieseite */
  variant?: "hero" | "compact";
};

export function KoderlaufSong({ variant = "hero" }: KoderlaufSongProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const staticReveal = useStaticReveal();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const time = parseFloat(e.target.value);
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isHero = variant === "hero";

  return (
    <section
      className={
        isHero
          ? "relative bg-gradient-to-b from-forest-deep/90 to-transparent py-12 sm:py-16"
          : ""
      }
    >
      <div
        className={
          isHero
            ? "mx-auto max-w-4xl px-4 sm:px-6 lg:px-8"
            : "mx-auto max-w-2xl"
        }
      >
        <motion.div
          {...fadeReveal(staticReveal, { duration: 0.6 })}
          className={[
            "overflow-hidden rounded-3xl border backdrop-blur-sm",
            isHero
              ? "border-koder-orange/30 bg-gradient-to-br from-koder-orange/10 to-transparent p-6 sm:p-8"
              : "border-border/80 bg-card/80 p-5 sm:p-6",
          ].join(" ")}
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
            {/* Icon */}
            <div
              className={[
                "flex shrink-0 items-center justify-center rounded-2xl",
                isHero
                  ? "h-16 w-16 bg-koder-orange/20 text-koder-orange ring-2 ring-koder-orange/30"
                  : "h-14 w-14 bg-forest-light/15 text-forest-light",
              ].join(" ")}
            >
              <Music size={isHero ? 28 : 24} />
            </div>

            {/* Titel und Player */}
            <div className="flex-1 min-w-0">
              <h3
                className={[
                  "font-extrabold tracking-tight",
                  isHero ? "text-2xl text-white sm:text-3xl" : "text-xl sm:text-2xl",
                ].join(" ")}
              >
                Unser Koderlauf-Song
              </h3>
              <p
                className={[
                  "mt-1 text-sm",
                  isHero ? "text-white/80" : "text-muted-foreground",
                ].join(" ")}
              >
                Koderlauf Obermögersheim &middot; 5:13
              </p>

              {/* Audio Element */}
              <audio
                ref={audioRef}
                src="/audio/koderlauf-song.mp3"
                preload="metadata"
                aria-label="Koderlauf Obermögersheim Song"
              />

              {/* Player Controls */}
              <div className="mt-4 flex items-center gap-3">
                {/* Play/Pause Button */}
                <button
                  onClick={togglePlay}
                  aria-label={isPlaying ? "Pause" : "Abspielen"}
                  className={[
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all",
                    isHero
                      ? "bg-koder-orange text-white hover:bg-koder-orange-bright glow-orange-sm"
                      : "bg-koder-orange text-white hover:bg-koder-orange-bright",
                  ].join(" ")}
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                </button>

                {/* Progress Bar */}
                <div className="flex flex-1 items-center gap-2 min-w-0">
                  <span
                    className={[
                      "text-xs font-medium tabular-nums",
                      isHero ? "text-white/90" : "text-muted-foreground",
                    ].join(" ")}
                  >
                    {formatTime(currentTime)}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    aria-label="Song-Position"
                    className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer bg-white/20 accent-koder-orange [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-koder-orange [&::-webkit-slider-thumb]:appearance-none [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-koder-orange"
                  />
                  <span
                    className={[
                      "text-xs font-medium tabular-nums",
                      isHero ? "text-white/90" : "text-muted-foreground",
                    ].join(" ")}
                  >
                    {formatTime(duration)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Platzhalter für zukünftigen Songtext-Link */}
          {/* 
          <div className="mt-4 pt-4 border-t border-white/10">
            <button className="text-sm font-semibold text-koder-orange hover:underline">
              Songtext anzeigen
            </button>
          </div>
          */}
        </motion.div>
      </div>
    </section>
  );
}
