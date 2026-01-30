interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  iconColor?: string;
}

const LoadingOverlay = ({
  isLoading,
  message = "Đang xử lý...",
  iconColor = "text-blue-600",
}: LoadingOverlayProps) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-9999 flex items-center justify-center">
      <div className="bg-white p-6 rounded-2xl shadow-2xl border border-white/20 flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-200">
        <span
          className={`material-symbols-outlined animate-spin text-4xl ${iconColor}`}
        >
          progress_activity
        </span>
        <span className="text-base font-semibold text-slate-800">
          {message}
        </span>
      </div>
    </div>
  );
};

export default LoadingOverlay;
