import { useState } from "react";
import {
  useImportQuestions,
  useQuestionTemplate,
} from "../../hooks/useQuestions";
import { useMyCourses, useCourseDetail } from "../../hooks/useCourses";
import { toast } from "../common/Toast";

interface ImportQuestionsModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const ImportQuestionsModal = ({
  onClose,
  onSuccess,
}: ImportQuestionsModalProps) => {
  const { importFile, loading: importLoading } = useImportQuestions();
  const { getTemplate, loading: templateLoading } = useQuestionTemplate();

  const [file, setFile] = useState<File | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [selectedLessonId, setSelectedLessonId] = useState<string>("");

  // Fetch courses for selection
  const { data: courses } = useMyCourses({ pageSize: 100 });

  // Fetch lessons when course is selected
  const { data: courseDetail } = useCourseDetail(selectedCourseId || undefined);
  const lessons = courseDetail?.lessons || [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const blob = await getTemplate();
      if (blob) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "question_template.xlsx"; // Default filename
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        toast.error("Không lấy được dữ liệu file mẫu");
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi tải mẫu file");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Vui lòng chọn file Excel");
      return;
    }

    try {
      const result = await importFile(selectedLessonId || undefined, file);
      toast.success(
        `Import thành công: ${result.success} câu hỏi, Thất bại: ${result.failed}, Trùng lặp: ${result.duplicate}`,
      );
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Đã xảy ra lỗi khi import câu hỏi");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-[#111518]">
            Import câu hỏi từ Excel
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* File Selection */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#111518]">
              1. Chọn file Excel (.xlsx, .xls)
            </label>
            <div className="flex gap-4">
              <div className="flex-1">
                <label
                  className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                    file
                      ? "border-green-500 bg-green-50 hover:bg-green-100"
                      : "border-slate-300 bg-slate-50 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <span
                      className={`material-symbols-outlined text-3xl mb-2 ${
                        file ? "text-green-600" : "text-slate-400"
                      }`}
                    >
                      {file ? "description" : "upload_file"}
                    </span>
                    <p
                      className={`text-xs text-center px-4 ${
                        file ? "text-green-700 font-medium" : "text-slate-500"
                      }`}
                    >
                      {file
                        ? file.name
                        : "Click để chọn file hoặc kéo thả vào đây"}
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".xlsx, .xls, .csv"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleDownloadTemplate}
                disabled={templateLoading}
                className="text-xs color-primary flex items-center gap-1 font-medium cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">
                  download
                </span>
                Tải file mẫu
              </button>
            </div>
          </div>

          {/* Lesson Selection (Optional) */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h4 className="text-sm font-bold text-[#111518] flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-500 text-lg">
                school
              </span>
              Gán vào bài học (Tùy chọn)
            </h4>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500">
                Khóa học
              </label>
              <div className="relative">
                <select
                  className="w-full appearance-none px-3 py-2 bg-white border border-slate-200 rounded-md text-sm focus:ring-1 focus:ring-[#0074bd]"
                  value={selectedCourseId}
                  onChange={(e) => {
                    setSelectedCourseId(e.target.value);
                    setSelectedLessonId("");
                  }}
                >
                  <option value="">-- Chọn khóa học --</option>
                  {courses?.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-base">
                  expand_more
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500">
                Bài học
              </label>
              <div className="relative">
                <select
                  className="w-full appearance-none px-3 py-2 bg-white border border-slate-200 rounded-md text-sm focus:ring-1 focus:ring-[#0074bd] disabled:bg-slate-100 disabled:text-slate-400"
                  value={selectedLessonId}
                  onChange={(e) => setSelectedLessonId(e.target.value)}
                  disabled={!selectedCourseId}
                >
                  <option value="">-- Chọn bài học --</option>
                  {lessons.map((lesson) => (
                    <option key={lesson.id} value={lesson.id}>
                      {lesson.title}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-base">
                  expand_more
                </span>
              </div>
              <p className="text-[10px] text-slate-400 italic">
                Nếu không chọn, câu hỏi sẽ ở trạng thái tự do.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={importLoading || !file}
              className="px-4 py-2 text-sm font-bold text-white color-primary-bg hover:translate-y-[-2px] rounded-lg shadow-sm transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
            >
              {importLoading && (
                <span className="material-symbols-outlined animate-spin text-sm">
                  progress_activity
                </span>
              )}
              Import
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ImportQuestionsModal;
