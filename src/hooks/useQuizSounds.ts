import { useCallback, useRef, useState, useEffect } from "react";

/**
 * Hook quản lý toàn bộ âm thanh cho Live Quiz.
 * Sử dụng Web Audio API để synthesize sounds trực tiếp — không cần file mp3.
 */

// Singleton AudioContext để tránh tạo nhiều instance
let sharedCtx: AudioContext | null = null;

const getAudioContext = (): AudioContext => {
  if (!sharedCtx || sharedCtx.state === "closed") {
    sharedCtx = new AudioContext();
  }
  return sharedCtx;
};

/** Resume AudioContext (cần gọi sau user gesture — Chrome policy) */
const ensureResumed = async () => {
  const ctx = getAudioContext();
  if (ctx.state === "suspended") {
    await ctx.resume();
  }
  return ctx;
};

// ─── Primitive Sound Generators ───────────────────────────────────────────────

/** Phát một note đơn giản */
const playTone = (
  ctx: AudioContext,
  freq: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.3,
  startTime?: number,
) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(volume, ctx.currentTime);

  const start = startTime ?? ctx.currentTime;
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(start);
  osc.stop(start + duration);
};

/** Tạo noise burst (dùng cho drum/hit sounds) */
const playNoiseBurst = (
  ctx: AudioContext,
  duration: number,
  volume = 0.1,
  startTime?: number,
) => {
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const gain = ctx.createGain();
  gain.gain.value = volume;

  source.connect(gain);
  gain.connect(ctx.destination);

  source.start(startTime ?? ctx.currentTime);
};

// ─── Sound Effect Functions ──────────────────────────────────────────────────

/** Pop nhẹ khi player join */
const playerJoinSound = async () => {
  const ctx = await ensureResumed();
  playTone(ctx, 880, 0.08, "sine", 0.2);
  playTone(ctx, 1320, 0.12, "sine", 0.15, ctx.currentTime + 0.06);
};

/** Tick countdown mỗi giây (bình thường) */
const countdownTickSound = async () => {
  const ctx = await ensureResumed();
  playTone(ctx, 800, 0.05, "square", 0.08);
};

/** Tick warning khi còn ≤5s — cao và gấp hơn */
const countdownWarningSound = async () => {
  const ctx = await ensureResumed();
  playTone(ctx, 1200, 0.06, "square", 0.15);
  playTone(ctx, 1400, 0.06, "square", 0.12, ctx.currentTime + 0.08);
};

/** Buzzer khi hết giờ */
const timeUpSound = async () => {
  const ctx = await ensureResumed();
  playTone(ctx, 200, 0.3, "sawtooth", 0.25);
  playTone(ctx, 150, 0.4, "sawtooth", 0.2, ctx.currentTime + 0.15);
  playNoiseBurst(ctx, 0.2, 0.08);
};

/** Drum roll / reveal khi hiện đáp án */
const revealAnswerSound = async () => {
  const ctx = await ensureResumed();
  // Ascending arpeggio
  const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
  notes.forEach((freq, i) => {
    playTone(ctx, freq, 0.2, "triangle", 0.2, ctx.currentTime + i * 0.1);
  });
  playNoiseBurst(ctx, 0.15, 0.06, ctx.currentTime + 0.35);
};

/** Whoosh khi chuyển câu tiếp theo */
const nextQuestionSound = async () => {
  const ctx = await ensureResumed();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(400, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.15);
  osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.25);

  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.3);
};

/** Sound khi bấm Start Game */
const startGameSound = async () => {
  const ctx = await ensureResumed();
  const notes = [523, 659, 784, 1047, 1319]; // C5 → E6
  notes.forEach((freq, i) => {
    playTone(ctx, freq, 0.15, "square", 0.12, ctx.currentTime + i * 0.08);
  });
  playNoiseBurst(ctx, 0.2, 0.05, ctx.currentTime + 0.4);
};

/** Victory fanfare cho trang kết quả */
const victoryFanfareSound = async () => {
  const ctx = await ensureResumed();
  // Fanfare melody: Đa-da-da-DAAA!
  const melody = [
    { freq: 523, dur: 0.15, delay: 0 }, // C5
    { freq: 659, dur: 0.15, delay: 0.18 }, // E5
    { freq: 784, dur: 0.15, delay: 0.36 }, // G5
    { freq: 1047, dur: 0.5, delay: 0.54 }, // C6 (hold)
  ];

  melody.forEach(({ freq, dur, delay }) => {
    playTone(ctx, freq, dur, "square", 0.15, ctx.currentTime + delay);
    // Harmony layer
    playTone(
      ctx,
      freq * 1.5,
      dur * 0.8,
      "triangle",
      0.08,
      ctx.currentTime + delay,
    );
  });

  // Cymbal crash
  playNoiseBurst(ctx, 0.6, 0.08, ctx.currentTime + 0.54);
};

// ─── Lobby Background Music (Looping Pattern) ────────────────────────────────

interface LobbyMusicState {
  intervalId: ReturnType<typeof setInterval> | null;
  isPlaying: boolean;
  melodyFlip: boolean;
}

const lobbyState: LobbyMusicState = {
  intervalId: null,
  isPlaying: false,
  melodyFlip: false,
};

/** Nhạc nền lobby — upbeat, sôi động kiểu game show */
const startLobbyMusic = async () => {
  if (lobbyState.isPlaying) return;
  const ctx = await ensureResumed();
  lobbyState.isPlaying = true;

  const BPM = 130;
  const beat = 60 / BPM; // ~0.46s per beat
  const barDuration = beat * 8; // 8 beats per bar

  const playBar = () => {
    if (!lobbyState.isPlaying) return;
    const now = ctx.currentTime;

    // ── Bass kick (4 on the floor) ──
    for (let i = 0; i < 8; i += 2) {
      const t = now + i * beat;
      const kickOsc = ctx.createOscillator();
      const kickGain = ctx.createGain();
      kickOsc.type = "sine";
      kickOsc.frequency.setValueAtTime(150, t);
      kickOsc.frequency.exponentialRampToValueAtTime(40, t + 0.12);
      kickGain.gain.setValueAtTime(0.18, t);
      kickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      kickOsc.connect(kickGain);
      kickGain.connect(ctx.destination);
      kickOsc.start(t);
      kickOsc.stop(t + 0.2);
    }

    // ── Hi-hat (offbeat 8ths) ──
    for (let i = 0; i < 8; i++) {
      const t = now + i * beat;
      playNoiseBurst(ctx, 0.03, i % 2 === 0 ? 0.03 : 0.05, t);
    }

    // ── Synth melody arpeggio ──
    const melodyA = [523, 659, 784, 1047, 784, 659, 523, 784]; // C5-E5-G5-C6-G5-E5-C5-G5
    const melodyB = [587, 740, 880, 1175, 880, 740, 587, 880]; // D5-F#5-A5-D6-A5-F#5-D5-A5
    const melody = lobbyState.melodyFlip ? melodyB : melodyA;
    lobbyState.melodyFlip = !lobbyState.melodyFlip;

    melody.forEach((freq, i) => {
      const t = now + i * beat;
      playTone(ctx, freq, beat * 0.7, "square", 0.06, t);
      // Sub harmony
      playTone(ctx, freq * 0.5, beat * 0.5, "triangle", 0.03, t);
    });

    // ── Chord stabs (beats 1 & 5) ──
    [0, 4].forEach((beatIdx) => {
      const t = now + beatIdx * beat;
      const chordFreqs = lobbyState.melodyFlip
        ? [523, 659, 784] // C major
        : [587, 740, 880]; // D major
      chordFreqs.forEach((f) => {
        playTone(ctx, f, beat * 0.3, "sawtooth", 0.03, t);
      });
    });
  };

  playBar();
  lobbyState.intervalId = setInterval(playBar, barDuration * 1000);
};

const stopLobbyMusic = () => {
  lobbyState.isPlaying = false;
  if (lobbyState.intervalId) {
    clearInterval(lobbyState.intervalId);
    lobbyState.intervalId = null;
  }
};

// ─── Hook chính ──────────────────────────────────────────────────────────────

export const useQuizSounds = () => {
  const [isMuted, setIsMuted] = useState(() => {
    try {
      return localStorage.getItem("quiz-sound-muted") === "true";
    } catch {
      return false;
    }
  });

  const isMutedRef = useRef(isMuted);

  useEffect(() => {
    isMutedRef.current = isMuted;
    try {
      localStorage.setItem("quiz-sound-muted", String(isMuted));
    } catch {
      // Ignore localStorage errors
    }
  }, [isMuted]);

  /** Wrapper: chỉ phát nếu không muted */
  const play = useCallback(
    (soundFn: () => Promise<void>) => {
      if (!isMutedRef.current) {
        soundFn().catch(() => {
          // Ignore audio errors (user hasn't interacted yet, etc.)
        });
      }
    },
    [],
  );

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  // Cleanup lobby music on unmount
  useEffect(() => {
    return () => {
      stopLobbyMusic();
    };
  }, []);

  return {
    isMuted,
    toggleMute,

    // Lobby
    playLobbyMusic: useCallback(() => play(startLobbyMusic), [play]),
    stopLobbyMusic: useCallback(() => stopLobbyMusic(), []),
    playPlayerJoin: useCallback(() => play(playerJoinSound), [play]),
    playStartGame: useCallback(() => play(startGameSound), [play]),

    // Play page
    playCountdownTick: useCallback(() => play(countdownTickSound), [play]),
    playCountdownWarning: useCallback(
      () => play(countdownWarningSound),
      [play],
    ),
    playTimeUp: useCallback(() => play(timeUpSound), [play]),
    playRevealAnswer: useCallback(() => play(revealAnswerSound), [play]),
    playNextQuestion: useCallback(() => play(nextQuestionSound), [play]),

    // Result page
    playVictoryFanfare: useCallback(() => play(victoryFanfareSound), [play]),
  };
};
