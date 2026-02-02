import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Configure worker for Vite
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

interface PdfSlideshowProps {
  fileUrl: string;
}

const PdfSlideshow = ({ fileUrl }: PdfSlideshowProps) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
  }

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
    <div className="flex flex-col items-center bg-gray-100 p-8 rounded-lg min-h-[500px] w-full">
      <div className="relative w-full flex justify-center overflow-auto max-h-[70vh] mb-4">
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
            <div className="h-[500px] w-full flex items-center justify-center">
              Loading PDF...
            </div>
          }
        >
          <Page
            pageNumber={pageNumber}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            className="shadow-lg"
            width={700} // Set a reasonable base width, letting CSS handle responsiveness if needed, but react-pdf is canvas based
          />
        </Document>
      </div>

      <div className="flex items-center gap-4 bg-white px-4 rounded-full shadow-sm">
        <button
          type="button"
          disabled={pageNumber <= 1}
          onClick={previousPage}
          className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-slate-700"
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>

        <p className="text-sm font-medium text-slate-700">
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
