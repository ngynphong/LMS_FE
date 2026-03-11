import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";

interface SoundToggleButtonProps {
  isMuted: boolean;
  onToggle: () => void;
  /** Variant giao diện: 'light' cho nền sáng, 'dark' cho nền tối */
  variant?: "light" | "dark";
}

/**
 * Nút bật/tắt âm thanh cho Live Quiz.
 */
const SoundToggleButton = ({
  isMuted,
  onToggle,
  variant = "light",
}: SoundToggleButtonProps) => {
  const baseClasses =
    "flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-sm transition-all cursor-pointer";

  const variantClasses =
    variant === "dark"
      ? "bg-white/10 hover:bg-white/20 text-white border border-white/20"
      : "bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200";

  return (
    <button onClick={onToggle} className={`${baseClasses} ${variantClasses}`}>
      {isMuted ? (
        <>
          <FaVolumeMute className="text-base" />
          <span className="hidden sm:inline">Bật âm thanh</span>
        </>
      ) : (
        <>
          <FaVolumeUp className="text-base" />
          <span className="hidden sm:inline">Tắt âm</span>
        </>
      )}
    </button>
  );
};

export default SoundToggleButton;
