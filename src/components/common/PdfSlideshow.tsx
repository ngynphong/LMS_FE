import { useState, useRef, useEffect, useCallback } from "react";
import { FaCircleNotch } from "react-icons/fa";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Worker setup - dùng import.meta.url để Vite bundle đúng worker file
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const MAX_PDF_WIDTH = 700;

// Options: suppress "TT: undefined function" warnings + load standard fonts
const PDF_OPTIONS = {
  standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
  verbosity: 0,
};

// Detect mobile/tablet device
const isMobileDevice = () => {
  if (typeof window === "undefined") return false;
  return (
    /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    ) || window.innerWidth < 768
  );
};

interface PdfSlideshowProps {
  fileUrl: string;
}

const PdfSlideshow = ({ fileUrl }: PdfSlideshowProps) => {
  const [isMobile, setIsMobile] = useState(isMobileDevice);
  const [isFullscreen, setIsFullscreen] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(isMobileDevice());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isFullscreen]);

  const toggleFullscreen = () => setIsFullscreen((prev) => !prev);

  const containerClasses = isFullscreen
    ? "fixed inset-0 z-[9999] bg-gray-100 flex flex-col"
    : "relative w-full flex flex-col";

  return (
    <div className={containerClasses}>
      <button
        onClick={toggleFullscreen}
        className={`z-10000 flex items-center justify-center w-10 h-10 bg-white/80 hover:bg-white rounded-full shadow backdrop-blur-sm transition-all text-slate-700 ${
          isFullscreen ? "fixed right-4 top-4" : "absolute right-2 top-2"
        }`}
        title={isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}
      >
        <span className="material-symbols-outlined">
          {isFullscreen ? "fullscreen_exit" : "fullscreen"}
        </span>
      </button>

      {isMobile ? (
        <MobilePdfViewer fileUrl={fileUrl} isFullscreen={isFullscreen} />
      ) : (
        <DesktopPdfViewer fileUrl={fileUrl} isFullscreen={isFullscreen} />
      )}
    </div>
  );
};

// ─── Mobile: dùng Google Docs Viewer vì iOS Safari không hỗ trợ PDF viewer trong iframe/object
const MobilePdfViewer = ({
  fileUrl,
  isFullscreen,
}: {
  fileUrl: string;
  isFullscreen: boolean;
}) => {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // Google Docs Viewer render PDF server-side → trả HTML chuẩn → cuộn + chuyển trang mượt trên mọi mobile browser
  const viewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`;

  return (
    <div
      className={`flex flex-col items-center bg-gray-100 rounded-lg w-full ${isFullscreen ? "flex-1 h-full pt-16 px-2 pb-2" : "p-2"}`}
    >
      {!iframeLoaded && (
        <div
          className={`flex items-center justify-center w-full ${isFullscreen ? "flex-1" : "h-[300px]"}`}
        >
          <span className="animate-spin text-3xl text-blue-600">
            <FaCircleNotch />
          </span>
        </div>
      )}
      <iframe
        src={viewerUrl}
        className="w-full rounded-lg border-0 flex-1"
        style={{
          height: isFullscreen ? "calc(100vh - 80px)" : "80vh",
          display: iframeLoaded ? "block" : "none",
        }}
        title="PDF Viewer"
        onLoad={() => setIframeLoaded(true)}
        sandbox="allow-scripts allow-same-origin allow-popups"
      />
      <a
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 flex items-center gap-1.5 text-xs text-blue-600 font-medium hover:underline pb-2"
      >
        <span className="material-symbols-outlined text-sm">open_in_new</span>
        Tải xuống PDF
      </a>
    </div>
  );
};

// ─── Desktop: dùng react-pdf canvas render cho slideshow experience
const DesktopPdfViewer = ({
  fileUrl,
  isFullscreen,
}: {
  fileUrl: string;
  isFullscreen: boolean;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(MAX_PDF_WIDTH);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateWidth = () => {
      const width = container.clientWidth;
      if (isFullscreen) {
        // Trừ đi khoảng trống 120px của Header và Navigation Controls để vừa khít màn hình
        const availableHeight = window.innerHeight - 120;
        const estimatedRatio = 16 / 9; // Tỉ lệ phổ biến PPT/Slide PDF
        const calculatedWidth = availableHeight * estimatedRatio;
        setContainerWidth(Math.min(calculatedWidth, width - 32));
      } else {
        setContainerWidth(Math.min(width - 16, MAX_PDF_WIDTH));
      }
    };

    updateWidth();
    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [isFullscreen]);

  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => {
      setNumPages(numPages);
      setLoading(false);
      setError(null);
    },
    [],
  );

  const onDocumentLoadError = useCallback((err: Error) => {
    console.error("Error loading PDF:", err);
    setLoading(false);
    setError("Không thể tải file PDF. Vui lòng thử lại sau.");
  }, []);

  return (
    <div
      ref={containerRef}
      className={`flex flex-col items-center bg-gray-100 rounded-lg w-full ${isFullscreen ? "flex-1 h-full pt-14 pb-4 px-4" : "p-8 min-h-[500px]"}`}
    >
      <div
        className={`relative w-full flex justify-center overflow-auto mb-4 ${isFullscreen ? "flex-1 max-h-[calc(100vh-120px)]" : "max-h-[70vh]"}`}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <span className="animate-spin text-3xl text-blue-600">
              <FaCircleNotch />
            </span>
          </div>
        )}
        {error ? (
          <div
            className={`flex flex-col items-center justify-center w-full text-slate-500 gap-3 ${isFullscreen ? "flex-1" : "h-[500px]"}`}
          >
            <span className="material-symbols-outlined text-4xl text-red-400">
              error
            </span>
            <p className="text-sm text-center">{error}</p>
          </div>
        ) : (
          <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            options={PDF_OPTIONS}
            className="flex justify-center"
            loading={
              <div
                className={`w-full flex items-center justify-center ${isFullscreen ? "flex-1" : "h-[500px]"}`}
              >
                Đang tải PDF...
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              className={`shadow-lg transition-all duration-300 ${isFullscreen ? "[&>canvas]:h-[calc(100vh-140px)]! [&>canvas]:w-auto! [&>canvas]:object-contain flex justify-center" : ""}`}
              width={isFullscreen ? undefined : containerWidth}
            />
          </Document>
        )}
      </div>

      <div className="flex items-center gap-4 bg-white px-4 py-1.5 rounded-full shadow-sm shrink-0">
        <button
          type="button"
          disabled={pageNumber <= 1}
          onClick={() => setPageNumber((p) => p - 1)}
          className="p-1.5 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-slate-700"
        >
          <span className="material-symbols-outlined text-xl">
            chevron_left
          </span>
        </button>

        <p className="text-sm font-medium text-slate-700 whitespace-nowrap">
          Trang {pageNumber || "--"} / {numPages || "--"}
        </p>

        <button
          type="button"
          disabled={numPages === null || pageNumber >= numPages}
          onClick={() => setPageNumber((p) => p + 1)}
          className="p-1.5 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-slate-700"
        >
          <span className="material-symbols-outlined text-xl">
            chevron_right
          </span>
        </button>
      </div>
    </div>
  );
};

export default PdfSlideshow;
