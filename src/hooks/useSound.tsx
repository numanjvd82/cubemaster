"use client";

import { useCallback, useRef } from "react";

export function useSound() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      const AudioContextClass =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
    }
    return audioContextRef.current;
  }, []);

  const playWinningSound = useCallback(() => {
    const audioContext = initAudioContext();

    // Create a celebratory sound sequence
    const notes = [
      { freq: 523.25, duration: 0.2 }, // C5
      { freq: 659.25, duration: 0.2 }, // E5
      { freq: 783.99, duration: 0.2 }, // G5
      { freq: 1046.5, duration: 0.4 }, // C6
    ];

    let startTime = audioContext.currentTime;

    notes.forEach((note) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(note.freq, startTime);
      oscillator.type = "triangle";

      // Envelope
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        startTime + note.duration
      );

      oscillator.start(startTime);
      oscillator.stop(startTime + note.duration);

      startTime += note.duration * 0.8; // Slight overlap
    });
  }, [initAudioContext]);

  const playTickingSound = useCallback(() => {
    const audioContext = initAudioContext();

    // Create a ticking sound
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.type = "square";

    // Short, sharp sound
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.1
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  }, [initAudioContext]);

  const playUrgentSound = useCallback(() => {
    const audioContext = initAudioContext();

    // Create an urgent beeping sound
    const createBeep = (startTime: number, frequency: number) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(frequency, startTime);
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.02);
      gainNode.gain.linearRampToValueAtTime(0, startTime + 0.15);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.15);
    };

    // Create a sequence of urgent beeps
    const currentTime = audioContext.currentTime;
    createBeep(currentTime, 1000);
    createBeep(currentTime + 0.2, 1200);
  }, [initAudioContext]);

  return {
    playWinningSound,
    playTickingSound,
    playUrgentSound,
  };
}
