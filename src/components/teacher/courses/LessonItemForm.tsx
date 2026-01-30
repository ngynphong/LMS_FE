import { useState, useEffect, useRef } from "react";

interface LessonItemFormData {
  title: string;
  description: string;
  type: "VIDEO" | "TEXT" | "PDF" | "PPT";
  textContent: string;
  file: File | null;
  currentFileUrl?: string;
  currentFileName?: string;
}

interface LessonItemFormProps {
  initialData?: Partial<LessonItemFormData>;
  lessonTitle?: string;
  onSubmit: (data: Omit<LessonItemFormData, "type">) => Promise<void>;
  onDelete?: () => Promise<void>;
  loading?: boolean;
  isEdit?: boolean;
}

import LoadingOverlay from "../../common/LoadingOverlay";

// Max file size in bytes (1MB for now - server limit)
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const LessonItemForm = ({
  initialData,
  lessonTitle,
  onSubmit,
  onDelete,
  loading = false,
  isEdit = false,
}: LessonItemFormProps) => {
  const [formData, setFormData] = useState<LessonItemFormData>({
    title: "",
    description: "",
    type: "VIDEO",
    textContent: "",
    file: null,
    currentFileUrl: "",
    currentFileName: "",
  });
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        title: initialData.title || "",
        description: initialData.description || "",
        type: initialData.type || "VIDEO",
        textContent: initialData.textContent || "",
        file: initialData.file || null,
        currentFileUrl: initialData.currentFileUrl || "",
        currentFileName: initialData.currentFileName || "",
      }));
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fileError) return;
    if (
      (formData.type === "VIDEO" ||
        formData.type === "PDF" ||
        formData.type === "PPT") &&
      !formData.file &&
      !formData.currentFileUrl &&
      !isEdit
    ) {
      setFileError("Vui lòng chọn file");
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { type, ...dataWithoutType } = formData;
    await onSubmit(dataWithoutType);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError(null);

    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setFileError("File quá lớn. Vui lòng chọn file dưới 50MB");
        return;
      }
      setFormData((prev) => ({ ...prev, file }));
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "VIDEO":
        return "purple";
      case "TEXT":
        return "blue";
      case "PDF":
        return "red";
      case "PPT":
        return "orange";
      default:
        return "slate";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "VIDEO":
        return "play_circle";
      case "TEXT":
        return "article";
      case "PDF":
        return "picture_as_pdf";
      case "PPT":
        return "description";
      default:
        return "description";
    }
  };

  const color = getTypeColor(formData.type);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 relative overflow-hidden">
      <LoadingOverlay
        isLoading={loading}
        message="Đang xử lý nội dung..."
        iconColor="text-purple-600"
      />

      <div className="flex items-center gap-3 mb-6">
        <div
          className={`size-10 rounded-lg bg-${color}-100 flex items-center justify-center`}
          style={{
            backgroundColor:
              formData.type === "VIDEO"
                ? "#f3e8ff"
                : formData.type === "TEXT"
                  ? "#dbeafe"
                  : formData.type === "PPT"
                    ? "#fff7ed"
                    : "#fee2e2",
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{
              color:
                formData.type === "VIDEO"
                  ? "#9333ea"
                  : formData.type === "TEXT"
                    ? "#2563eb"
                    : formData.type === "PPT"
                      ? "#ea580c"
                      : "#dc2626",
            }}
          >
            {getTypeIcon(formData.type)}
          </span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            {isEdit ? "Chỉnh sửa nội dung" : "Thêm nội dung mới"}
          </h3>
          <p className="text-sm text-slate-500">
            {lessonTitle
              ? `Cho bài học: ${lessonTitle}`
              : "Tạo nội dung cho bài học"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Content Type Selection */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Loại nội dung
          </label>
          <div className="grid grid-cols-4 gap-3">
            {(["VIDEO", "TEXT", "PDF", "PPT"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, type, file: null }))
                }
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                  formData.type === type
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <span
                  className="material-symbols-outlined text-2xl"
                  style={{
                    color: formData.type === type ? "#2563eb" : "#64748b",
                  }}
                >
                  {getTypeIcon(type)}
                </span>
                <span
                  className={`text-sm font-medium ${formData.type === type ? "text-blue-700" : "text-slate-600"}`}
                >
                  {type === "VIDEO"
                    ? "Video"
                    : type === "TEXT"
                      ? "Văn bản"
                      : type === "PDF"
                        ? "PDF"
                        : "PPT"}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Tiêu đề <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="VD: Giới thiệu về React Hooks"
            className="w-full rounded-sm p-1 border border-gray-200 focus:ring-1 focus:outline-none focus:ring-[#1E90FF] focus:border-[#1E90FF]"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Mô tả
          </label>
          <textarea
            rows={2}
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="Mô tả ngắn về nội dung này..."
            className="w-full rounded-sm p-1 border border-gray-200 focus:ring-1 focus:outline-none focus:ring-[#1E90FF] focus:border-[#1E90FF] resize-none"
          />
        </div>

        {/* Text Content (for TEXT type) */}
        {formData.type === "TEXT" && (
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Nội dung văn bản
            </label>
            <textarea
              rows={8}
              value={formData.textContent}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  textContent: e.target.value,
                }))
              }
              placeholder="Nhập nội dung văn bản cho bài học..."
              className="w-full rounded-sm p-1 border border-gray-200 focus:ring-1 focus:outline-none focus:ring-[#1E90FF] focus:border-[#1E90FF] resize-none font-mono"
            />
          </div>
        )}

        {/* File Upload (for VIDEO and PDF) */}
        {(formData.type === "VIDEO" ||
          formData.type === "PDF" ||
          formData.type === "PPT") && (
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              {formData.type === "VIDEO"
                ? "File Video"
                : formData.type === "PDF"
                  ? "File PDF"
                  : "File PPT"}
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all"
            >
              {formData.file || formData.currentFileUrl ? (
                <div className="flex items-center justify-center gap-3">
                  <span className="material-symbols-outlined text-2xl text-green-600">
                    check_circle
                  </span>
                  <div className="text-left">
                    <p className="text-sm font-medium text-slate-900">
                      {formData.file
                        ? formData.file.name
                        : formData.currentFileName || "File hiện tại"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formData.file
                        ? (formData.file.size / 1024 / 1024).toFixed(2) + " MB"
                        : "Đã tải lên"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFormData((prev) => ({
                        ...prev,
                        file: null,
                        currentFileUrl: "",
                      }));
                    }}
                    className="ml-auto p-1 hover:bg-slate-200 rounded"
                  >
                    <span className="material-symbols-outlined text-slate-500">
                      close
                    </span>
                  </button>
                </div>
              ) : (
                <>
                  <span className="material-symbols-outlined text-3xl text-slate-400 mb-2">
                    cloud_upload
                  </span>
                  <p className="text-sm text-slate-600">
                    Kéo thả hoặc{" "}
                    <span className="text-blue-600 font-medium">chọn file</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {formData.type === "VIDEO"
                      ? "MP4, WebM, MOV (tối đa 50MB)"
                      : formData.type === "PPT"
                        ? "PPT (tối đa 50MB)"
                        : "PDF (tối đa 50MB)"}
                  </p>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept={
                formData.type === "VIDEO"
                  ? "video/*"
                  : formData.type === "PDF"
                    ? "application/pdf"
                    : "application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation"
              }
              onChange={handleFileChange}
              className="hidden"
            />
            {fileError && (
              <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">error</span>
                {fileError}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="pt-4 border-t border-slate-200 flex gap-3">
          <button
            type="submit"
            disabled={loading || !formData.title.trim() || !!fileError}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg h-11 px-6 bg-blue-600 text-white text-sm font-bold shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-lg">
                  progress_activity
                </span>
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-lg">save</span>
                <span>{isEdit ? "Cập nhật" : "Thêm nội dung"}</span>
              </>
            )}
          </button>

          {isEdit && onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="flex items-center justify-center gap-2 rounded-lg h-11 px-4 bg-red-50 text-red-600 text-sm font-bold hover:bg-red-100 transition-all"
            >
              <span className="material-symbols-outlined text-lg">delete</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default LessonItemForm;
