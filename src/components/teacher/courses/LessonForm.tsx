import { useState, useEffect } from "react";

interface LessonFormData {
  title: string;
}

interface LessonFormProps {
  initialData?: LessonFormData;
  lessonNumber?: number;
  onSubmit: (data: LessonFormData) => Promise<void>;
  onDelete?: () => Promise<void>;
  loading?: boolean;
  isEdit?: boolean;
}

const LessonForm = ({
  initialData,
  lessonNumber,
  onSubmit,
  onDelete,
  loading = false,
  isEdit = false,
}: LessonFormProps) => {
  const [formData, setFormData] = useState<LessonFormData>({
    title: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="size-10 rounded-lg bg-green-100 flex items-center justify-center">
          <span className="material-symbols-outlined text-green-600">
            description
          </span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            {isEdit
              ? `Chỉnh sửa bài học ${lessonNumber || ""}`
              : "Thêm bài học mới"}
          </h3>
          <p className="text-sm text-slate-500">
            {isEdit
              ? "Cập nhật thông tin bài học"
              : "Tạo bài học mới cho khóa học"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Tiêu đề bài học <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="VD: Giới thiệu về React Components"
            className="w-full rounded-lg border-slate-200 text-sm focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>

        <div className="pt-4 border-t border-slate-200 flex gap-3">
          <button
            type="submit"
            disabled={loading || !formData.title.trim()}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg h-11 px-6 bg-green-600 text-white text-sm font-bold shadow-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
                <span>{isEdit ? "Cập nhật" : "Tạo bài học"}</span>
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

export default LessonForm;
