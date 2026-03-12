import { useState, useEffect } from "react";

interface CourseFormData {
  name: string;
  description: string;
  thumbnailUrl: string;
  visibility: "PUBLIC" | "PRIVATE";
}

interface CourseFormProps {
  initialData?: Partial<CourseFormData>;
  onSubmit: (data: CourseFormData) => Promise<void>;
  loading?: boolean;
  isEdit?: boolean;
}

import LoadingOverlay from "../../common/LoadingOverlay";
import { FaCircleNotch, FaSave, FaUpload, FaTimes } from "react-icons/fa";
import { MdBook } from "react-icons/md";
import { useUploadCourseThumbnail } from "@/hooks/useCourses";
import { toast } from "react-toastify";

const CourseForm = ({
  initialData,
  onSubmit,
  loading = false,
  isEdit = false,
}: CourseFormProps) => {
  const { mutateAsync: uploadThumbnail, isPending: uploadingThumbnail } = useUploadCourseThumbnail();
  const [formData, setFormData] = useState<CourseFormData>({
    name: "",
    description: "",
    thumbnailUrl: "",
    visibility: "PUBLIC",
  });

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
      }));
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 relative overflow-hidden">
      <LoadingOverlay
        isLoading={loading}
        message="Đang xử lý..."
        iconColor="text-blue-600"
      />

      <div className="flex items-center gap-3 mb-6">
        <div className="size-10 rounded-lg bg-blue-100 flex items-center justify-center">
          <span className="text-2xl text-blue-600">
            <MdBook />
          </span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            {isEdit ? "Chỉnh sửa khóa học" : "Thông tin khóa học"}
          </h3>
          <p className="text-sm text-slate-500">
            Nhập thông tin cơ bản cho khóa học
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Tên khóa học <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="VD: Lập trình Web Fullstack với React & Node.js"
            className={`w-full rounded-sm p-1 text-sm border border-gray-200 focus:ring-1 focus:outline-none focus:ring-[#1E90FF] focus:border-[#1E90FF] ${
              (formData.name?.length || 0) > 0 &&
              ((formData.name?.length || 0) < 5 ||
                (formData.name?.length || 0) > 255)
                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                : "border-gray-200"
            }`}
            minLength={5}
            maxLength={255}
            required
          />
          {(formData.name?.length || 0) > 0 &&
            (formData.name?.length || 0) < 5 && (
              <p className="text-xs text-red-500 mt-1">
                Tên khóa học phải có ít nhất 5 ký tự
              </p>
            )}
          {(formData.name?.length || 0) > 255 && (
            <p className="text-xs text-red-500 mt-1">
              Tên khóa học không được vượt quá 255 ký tự
            </p>
          )}
          <p className="text-xs text-slate-400 mt-1">
            {formData.name?.length || 0}/255 ký tự
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Mô tả khóa học
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="Mô tả ngắn gọn về nội dung và mục tiêu của khóa học..."
            className="w-full rounded-sm p-1 border border-gray-200 focus:ring-1 focus:outline-none focus:ring-[#1E90FF] focus:border-[#1E90FF] resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Ảnh thumbnail khóa học
          </label>
          
          {formData.thumbnailUrl ? (
            <div className="relative group rounded-xl overflow-hidden aspect-video border border-slate-200 mb-2">
              <img 
                src={formData.thumbnailUrl} 
                alt="Course Thumbnail" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, thumbnailUrl: "" }))}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg cursor-pointer"
                  title="Xóa ảnh"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          ) : (
            <div className="relative">
              <input
                type="file"
                id="thumbnail-upload"
                className="hidden"
                accept="image/*"
                disabled={uploadingThumbnail}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    try {
                      const url = await uploadThumbnail(file);
                      setFormData(prev => ({ ...prev, thumbnailUrl: url }));
                      toast.success("Tải ảnh lên thành công!");
                    } catch (err) {
                      toast.error("Tải ảnh lên thất bại. Vui lòng thử lại.");
                    }
                  }
                }}
              />
              <label
                htmlFor="thumbnail-upload"
                className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 hover:bg-blue-50/50 hover:border-blue-300 transition-all cursor-pointer group px-4 text-center ${uploadingThumbnail ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {uploadingThumbnail ? (
                  <>
                    <FaCircleNotch className="w-8 h-8 text-blue-500 animate-spin mb-3" />
                    <p className="text-sm font-medium text-slate-600">Đang tải ảnh lên...</p>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                      <FaUpload className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700">Nhấn để tải ảnh</p>
                      <p className="text-xs text-slate-400 mt-1">Hỗ trợ JPG, PNG, WEBP (Tối đa 5MB)</p>
                    </div>
                  </>
                )}
              </label>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Chế độ hiển thị
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="visibility"
                value="PUBLIC"
                checked={formData.visibility === "PUBLIC"}
                onChange={() =>
                  setFormData((prev) => ({ ...prev, visibility: "PUBLIC" }))
                }
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">Công khai</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="visibility"
                value="PRIVATE"
                checked={formData.visibility === "PRIVATE"}
                onChange={() =>
                  setFormData((prev) => ({ ...prev, visibility: "PRIVATE" }))
                }
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">Riêng tư</span>
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200">
          <button
            type="submit"
            disabled={
              loading ||
              (formData.name?.trim().length || 0) < 5 ||
              (formData.name?.length || 0) > 255
            }
            className="w-full flex items-center justify-center gap-2 rounded-lg h-11 px-6 bg-blue-600 text-white text-sm font-bold shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <span className="animate-spin text-lg">
                  <FaCircleNotch />
                </span>
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <span className="text-lg">
                  <FaSave />
                </span>
                <span>{isEdit ? "Cập nhật khóa học" : "Tạo khóa học"}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseForm;
