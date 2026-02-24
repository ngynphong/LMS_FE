import { useState, useRef, useEffect, useCallback } from "react";
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

/**
 * PdfSlideshow: Hiển thị PDF dạng slideshow
 * - Desktop: dùng react-pdf (canvas) cho trải nghiệm tốt nhất
 * - Mobile: dùng <object> / Google Docs Viewer fallback vì canvas rendering
 *   trên mobile browsers thường gây blank screen
 */
const PdfSlideshow = ({ fileUrl }: PdfSlideshowProps) => {
  const [isMobile, setIsMobile] = useState(isMobileDevice);

  // Re-check on resize (edge case: responsive/DevTools)
  useEffect(() => {
    const handleResize = () => setIsMobile(isMobileDevice());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) {
    return <MobilePdfViewer fileUrl={fileUrl} />;
  }
  return <DesktopPdfViewer fileUrl={fileUrl} />;
};

// ─── Mobile: dùng <object> embed PDF natively (hầu hết mobile browser hỗ trợ)
const MobilePdfViewer = ({ fileUrl }: { fileUrl: string }) => {
  const [useFallback, setUseFallback] = useState(false);

  // Google Docs Viewer – fallback nếu <object> không load được
  const googleViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`;

  if (useFallback) {
    return (
      <div className="flex flex-col items-center bg-gray-100 p-2 rounded-lg w-full">
        <iframe
          src={googleViewerUrl}
          className="w-full rounded-lg border-0"
          style={{ height: "75vh" }}
          title="PDF Viewer"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center bg-gray-100 p-2 rounded-lg w-full">
      <object
        data={fileUrl}
        type="application/pdf"
        className="w-full rounded-lg"
        style={{ height: "75vh" }}
      >
        {/* Fallback nếu browser không hỗ trợ <object> cho PDF */}
        <div className="flex flex-col items-center justify-center h-[60vh] w-full text-slate-500 gap-4 p-4">
          <span className="material-symbols-outlined text-4xl text-slate-400">
            picture_as_pdf
          </span>
          <p className="text-sm text-center">
            Trình duyệt không hỗ trợ xem PDF trực tiếp.
          </p>
          <div className="flex flex-col gap-2 w-full max-w-xs">
            <button
              onClick={() => setUseFallback(true)}
              className="w-full py-2.5 px-4 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Xem qua Google Docs
            </button>
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 bg-white text-slate-700 border border-slate-300 rounded-lg text-sm font-medium text-center hover:bg-slate-50 transition-colors"
            >
              Tải xuống PDF
            </a>
          </div>
        </div>
      </object>
    </div>
  );
};

// ─── Desktop: dùng react-pdf canvas render cho slideshow experience
const DesktopPdfViewer = ({ fileUrl }: { fileUrl: string }) => {
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
      setContainerWidth(Math.min(width - 16, MAX_PDF_WIDTH));
    };

    updateWidth();
    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

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
      className="flex flex-col items-center bg-gray-100 p-8 rounded-lg min-h-[500px] w-full"
    >
      <div className="relative w-full flex justify-center overflow-auto max-h-[70vh] mb-4">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <span className="material-symbols-outlined animate-spin text-3xl text-blue-600">
              progress_activity
            </span>
          </div>
        )}
        {error ? (
          <div className="flex flex-col items-center justify-center h-[500px] w-full text-slate-500 gap-3">
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
              <div className="h-[500px] w-full flex items-center justify-center">
                Đang tải PDF...
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              className="shadow-lg"
              width={containerWidth}
            />
          </Document>
        )}
      </div>

      <div className="flex items-center gap-4 bg-white px-4 py-1 rounded-full shadow-sm">
        <button
          type="button"
          disabled={pageNumber <= 1}
          onClick={() => setPageNumber((p) => p - 1)}
          className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-slate-700"
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>

        <p className="text-sm font-medium text-slate-700 whitespace-nowrap">
          Trang {pageNumber || "--"} / {numPages || "--"}
        </p>

        <button
          type="button"
          disabled={numPages === null || pageNumber >= numPages}
          onClick={() => setPageNumber((p) => p + 1)}
          className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-slate-700"
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </div>
  );
};

export default PdfSlideshow;
