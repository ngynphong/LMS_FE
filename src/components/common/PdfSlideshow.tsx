import { useState, useRef, useEffect, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Configure worker for Vite
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const MAX_PDF_WIDTH = 700;

interface PdfSlideshowProps {
  fileUrl: string;
}

const PdfSlideshow = ({ fileUrl }: PdfSlideshowProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(MAX_PDF_WIDTH);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);

  // Đo chiều rộng thực tế của container để responsive trên mobile
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateWidth = () => {
      const width = container.clientWidth;
      // Trừ padding (2 * 16px = 32px cho p-4 trên mobile) để tránh tràn
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
    },
    [],
  );

  function changePage(offset: number) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center bg-gray-100 p-4 md:p-8 rounded-lg min-h-[400px] md:min-h-[500px] w-full"
    >
      <div className="relative w-full flex justify-center overflow-auto max-h-[60vh] md:max-h-[70vh] mb-4">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <span className="material-symbols-outlined animate-spin text-3xl text-blue-600">
              progress_activity
            </span>
          </div>
        )}
        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(error) => console.error("Error loading PDF:", error)}
          className="flex justify-center"
          loading={
            <div className="h-[400px] md:h-[500px] w-full flex items-center justify-center">
              Loading PDF...
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
      </div>

      <div className="flex items-center gap-3 md:gap-4 bg-white px-3 md:px-4 py-1 rounded-full shadow-sm">
        <button
          type="button"
          disabled={pageNumber <= 1}
          onClick={previousPage}
          className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-slate-700"
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>

        <p className="text-xs md:text-sm font-medium text-slate-700 whitespace-nowrap">
          Page {pageNumber || "--"} of {numPages || "--"}
        </p>

        <button
          type="button"
          disabled={numPages === null || pageNumber >= numPages}
          onClick={nextPage}
          className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-slate-700"
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </div>
  );
};

export default PdfSlideshow;
