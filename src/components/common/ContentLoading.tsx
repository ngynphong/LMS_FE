import { useState, useEffect } from "react";
import { FaCircleNotch } from "react-icons/fa";

interface ContentLoadingProps {
  /** Thời gian delay trước khi hiển thị loading (ms) — tránh chớp loading */
  delayMs?: number;
  message?: string;
}

/**
 * Loading indicator nhẹ, chỉ hiển thị trong vùng content (không overlay toàn trang).
 * Mặc định delay 200ms trước khi hiện để tránh chớp khi chunk tải nhanh.
 */
const ContentLoading = ({
  delayMs = 200,
  message = "Đang tải...",
}: ContentLoadingProps) => {
  const [isVisible, setIsVisible] = useState(delayMs === 0);

  useEffect(() => {
    if (delayMs === 0) return;

    const timer = setTimeout(() => setIsVisible(true), delayMs);
    return () => clearTimeout(timer);
  }, [delayMs]);

  if (!isVisible) return null;

  return (
    <div className="flex flex-1 items-center justify-center py-20 animate-in fade-in duration-300">
      <div className="flex flex-col items-center gap-3">
        <span className="animate-spin text-xl text-primary">
          <FaCircleNotch />
        </span>
        <span className="text-sm font-medium text-slate-500">{message}</span>
      </div>
    </div>
  );
};

export default ContentLoading;
