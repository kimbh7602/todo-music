"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Todo, useTodoStore } from "@/store/useTodoStore";
import { fireConfetti } from "@/utils/confetti";

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function ProgressBar({
  currentTime,
  duration,
  onSeek,
}: {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}) {
  const barRef = useRef<HTMLDivElement>(null);
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!barRef.current || duration <= 0) return;
    const rect = barRef.current.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    onSeek(Math.max(0, Math.min(duration, ratio * duration)));
  };

  return (
    <div className="flex items-center gap-3 w-full relative z-10">
      <span className="text-xs text-gray-700/70 tabular-nums w-10 text-right">
        {formatTime(currentTime)}
      </span>
      <div
        ref={barRef}
        onClick={handleClick}
        className="flex-1 h-1.5 rounded-full bg-black/10 relative cursor-pointer group"
      >
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-gray-800/50 transition-[width] duration-200"
          style={{ width: `${progress}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-gray-800/60 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
          style={{ left: `${progress}%`, transform: `translate(-50%, -50%)` }}
        />
      </div>
      <span className="text-xs text-gray-700/70 tabular-nums w-10">
        {formatTime(duration)}
      </span>
    </div>
  );
}

function PlayPauseIcon({ isPlaying }: { isPlaying: boolean }) {
  if (isPlaying) {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
      </svg>
    );
  }
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

export default function MusicPlayer({ todo }: { todo: Todo }) {
  const toggleComplete = useTodoStore((s) => s.toggleComplete);
  const deactivate = useTodoStore((s) => s.deactivate);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = new Audio(todo.audioTrack);
    audioRef.current = audio;

    const onLoadedMetadata = () => setDuration(audio.duration);
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);

    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
      audio.src = "";
      audioRef.current = null;
    };
  }, [todo.audioTrack]);

  const handlePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  }, [isPlaying]);

  const handleSeek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setCurrentTime(time);
  }, []);

  const handleComplete = () => {
    audioRef.current?.pause();
    fireConfetti();
    toggleComplete(todo.id);
  };

  const handleStop = () => {
    audioRef.current?.pause();
    deactivate();
  };

  return (
    <div className="liquid-glass rounded-3xl p-8 w-full max-w-sm mx-auto shadow-xl flex flex-col items-center justify-center gap-6">
      <div
        className={`relative w-full aspect-square rounded-full overflow-hidden shadow-lg z-10 border-4 border-white/20 ${
          isPlaying ? "animate-spin-slow" : ""
        }`}
      >
        <Image
          src={todo.coverImage}
          alt="cover"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 80vw, 320px"
          priority
          unoptimized={todo.coverImage.startsWith("http")}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-gray-900/60 backdrop-blur-sm border-2 border-white/20" />
        </div>
      </div>

      <div className="text-center w-full relative z-10">
        <h2 className="text-lg font-semibold text-gray-900 truncate">
          {todo.text}
        </h2>
        {todo.trackName ? (
          <p className="text-xs text-gray-500/80 mt-1 truncate">
            {todo.trackName} — {todo.artistName}
          </p>
        ) : (
          <p className="text-sm text-gray-600/80 mt-1">
            {isPlaying ? "Now Playing" : "Paused"}
          </p>
        )}
      </div>

      <ProgressBar
        currentTime={currentTime}
        duration={duration}
        onSeek={handleSeek}
      />

      <div className="flex items-center justify-center gap-6 text-gray-800 relative z-10">
        <button
          onClick={handlePlayPause}
          className="liquid-glass-btn w-14 h-14 rounded-full flex items-center justify-center"
        >
          <span className="relative z-10">
            <PlayPauseIcon isPlaying={isPlaying} />
          </span>
        </button>
      </div>

      <div className="flex items-center gap-3 relative z-10">
        <button
          onClick={handleComplete}
          className="liquid-glass-btn px-4 py-2 rounded-xl text-sm font-medium text-gray-800"
        >
          <span className="relative z-10">Complete</span>
        </button>
        <button
          onClick={handleStop}
          className="px-4 py-2 rounded-xl text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          Stop
        </button>
      </div>
    </div>
  );
}
