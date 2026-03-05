import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Save, Eye } from "lucide-react";

import { BannerImageUpload } from "./BannerImageUpload";
import {
  type BannerCreationRequest,
  BannerType,
  BannerPosition,
  AnimationType,
  BannerVisibility,
} from "../../../types/banner.types";

// Zod Schema for validation
const bannerSchema = z
  .object({
    title: z
      .string()
      .min(1, "Tiêu đề không được để trống")
      .max(255, "Tiêu đề quá dài"),
    description: z.string().max(1000, "Mô tả quá dài").optional(),
    redirectUrl: z.string().url("URL không hợp lệ").min(1, "URL không hợp lệ"),
    targetRoles: z.array(z.string()).min(1, "Chọn ít nhất 1 vai trò"),
    targetVisibility: z.string().min(1, "Chọn quyền hiển thị"),
    bannerType: z.string().min(1, "Chọn loại banner"),
    bannerPosition: z.string().optional(),
    displayDelay: z.number().min(0, "Thời gian trễ phải lớn hơn hoặc bằng 0"),
    displayFrequencyHours: z
      .number()
      .min(0, "Tần suất hiển thị phải lớn hơn hoặc bằng 0"),
    animationType: z.string().min(1, "Chọn kiểu hiệu ứng"),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    active: z.boolean(),
    priority: z.number().min(0, "Độ ưu tiên phải lớn hơn hoặc bằng 0"),
    altText: z.string().optional(),
    ariaLabel: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.startTime && data.endTime) {
        return new Date(data.startTime) < new Date(data.endTime);
      }
      return true;
    },
    {
      message: "Thời gian kết thúc phải sau thời gian bắt đầu",
      path: ["endTime"],
    },
  );

type BannerFormData = z.infer<typeof bannerSchema>;

interface BannerFormProps {
  initialData?: Partial<BannerCreationRequest>;
  initialImages?: {
    desktop?: string;
    mobile?: string;
    tablet?: string;
  };
  onSubmit: (
    data: BannerCreationRequest,
    images: { desktop?: File; mobile?: File; tablet?: File },
  ) => Promise<void>;
  isSubmitting?: boolean;
}

export const BannerForm: React.FC<BannerFormProps> = ({
  initialData,
  initialImages,
  onSubmit,
  isSubmitting = false,
}) => {
  const [images, setImages] = useState<{
    desktop?: File | null;
    mobile?: File | null;
    tablet?: File | null;
  }>({
    desktop: null,
    mobile: null,
    tablet: null,
  });

  const [imageError, setImageError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<BannerFormData>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      redirectUrl: initialData?.redirectUrl || "",
      targetRoles: initialData?.targetRoles || ["STUDENT"],
      targetVisibility:
        initialData?.targetVisibility || BannerVisibility.PUBLIC,
      bannerType: initialData?.bannerType || BannerType.POPUP,
      bannerPosition: initialData?.bannerPosition || BannerPosition.CENTER,
      displayDelay: initialData?.displayDelay || 0,
      displayFrequencyHours: initialData?.displayFrequencyHours || 24,
      animationType: initialData?.animationType || AnimationType.FADE,
      startTime: initialData?.startTime || "",
      endTime: initialData?.endTime || "",
      active: initialData?.active ?? true,
      priority: initialData?.priority || 0,
      altText: initialData?.altText || "",
      ariaLabel: initialData?.ariaLabel || "",
    },
  });

  const watchType = watch("bannerType");

  const onFormSubmit = async (data: BannerFormData) => {
    console.log("=== FORM SUBMIT TRIGGERED ===");
    console.log("Raw Form Data:", data);

    // Validate required images
    if (!initialImages?.desktop && !images.desktop) {
      setImageError("Vui lòng tải lên ảnh Desktop");
      return;
    }
    setImageError(null);

    // Format targetRoles if "All" logic is needed
    // Assuming backend takes exactly what we send

    const cleanData: BannerCreationRequest = {
      ...data,
      // Handle conditional parsing if necessary
    };

    console.log("Clean Data sent to API:", cleanData);

    await onSubmit(cleanData, {
      desktop: images.desktop || undefined,
      mobile: images.mobile || undefined,
      tablet: images.tablet || undefined,
    });
  };

  const onFormError = (errors: any) => {
    console.log("=== FRONTEND VALIDATION ERRORS ===", errors);
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit, onFormError)}
      className="space-y-8 max-w-5xl mx-auto"
    >
      {/* SECTION 1: Basic Information */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">
            1
          </span>
          Thông tin cơ bản
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tiêu đề Banner <span className="text-red-500">*</span>
            </label>
            <input
              {...register("title")}
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="VD: Khuyến mãi Black Friday"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả ngắn
            </label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-y"
              placeholder="VD: Giảm giá 50% tất cả các khóa học"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL Đích (Khi click) <span className="text-red-500">*</span>
            </label>
            <input
              {...register("redirectUrl")}
              type="url"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="https://iesfocus.edu.vn/..."
            />
            {errors.redirectUrl && (
              <p className="mt-1 text-sm text-red-500">
                {errors.redirectUrl.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 2: Images */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">
            2
          </span>
          Hình ảnh
        </h3>

        {imageError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium">
            {imageError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BannerImageUpload
            label="Ảnh Desktop"
            required
            recommendedSize="1920x600px"
            existingImageUrl={initialImages?.desktop}
            onFileSelect={(file) =>
              setImages((prev) => ({ ...prev, desktop: file }))
            }
          />
          <BannerImageUpload
            label="Ảnh Tablet (Tùy chọn)"
            recommendedSize="1024x768px"
            existingImageUrl={initialImages?.tablet}
            onFileSelect={(file) =>
              setImages((prev) => ({ ...prev, tablet: file }))
            }
          />
          <BannerImageUpload
            label="Ảnh Mobile (Tùy chọn)"
            recommendedSize="750x1000px"
            existingImageUrl={initialImages?.mobile}
            onFileSelect={(file) =>
              setImages((prev) => ({ ...prev, mobile: file }))
            }
          />
        </div>
      </div>

      {/* SECTION 3: Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">
                3
              </span>
              Hiển thị
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại Banner <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("bannerType")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value={BannerType.POPUP}>Popup giữa màn hình</option>
                  <option value={BannerType.TOP_BAR}>
                    Thanh thông báo (Top Bar)
                  </option>
                  <option value={BannerType.SIDEBAR}>
                    Banner nổi (Sidebar)
                  </option>
                  <option value={BannerType.FLOATING}>
                    Badge lề (Floating/Hero)
                  </option>
                  <option value={BannerType.INLINE}>
                    Banner giữa nội dung
                  </option>
                </select>
              </div>

              {(watchType === "TOP_BAR" || watchType === "SIDEBAR") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vị trí hiển thị
                  </label>
                  <select
                    {...register("bannerPosition")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value={BannerPosition.TOP}>Trên cùng</option>
                    <option value={BannerPosition.BOTTOM}>Dưới cùng</option>
                    <option value={BannerPosition.LEFT}>Bên trái</option>
                    <option value={BannerPosition.RIGHT}>Bên phải</option>
                    <option value={BannerPosition.CENTER}>Chính giữa</option>
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Độ trễ (giây)
                  </label>
                  <input
                    {...register("displayDelay", { valueAsNumber: true })}
                    type="number"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    title="0 nghĩa là luôn hiển thị"
                  >
                    Tần suất (giờ)
                  </label>
                  <input
                    {...register("displayFrequencyHours", {
                      valueAsNumber: true,
                    })}
                    type="number"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kiểu hiệu ứng
                </label>
                <select
                  {...register("animationType")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value={AnimationType.FADE}>Mờ dần (Fade)</option>
                  <option value={AnimationType.SLIDE_UP}>Trượt lên</option>
                  <option value={AnimationType.SLIDE_DOWN}>Trượt xuống</option>
                  <option value={AnimationType.SLIDE_LEFT}>Trượt trái</option>
                  <option value={AnimationType.SLIDE_RIGHT}>Trượt phải</option>
                  <option value={AnimationType.SCALE}>Thu phóng (Scale)</option>
                  <option value={AnimationType.BOUNCE}>Nảy (Bounce)</option>
                  <option value={AnimationType.NONE}>Không có</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">
                4
              </span>
              Đối tượng ưu tiên
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quyền truy cập <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value={BannerVisibility.PUBLIC}
                      {...register("targetVisibility")}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      Công khai (Tất cả mọi người)
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value={BannerVisibility.AUTHENTICATED}
                      {...register("targetVisibility")}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      Chỉ người dùng đã đăng nhập
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vai trò <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      value="STUDENT"
                      {...register("targetRoles")}
                      className="text-blue-600 focus:ring-blue-500 rounded"
                    />
                    <span className="text-sm text-gray-700">Học sinh</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      value="TEACHER"
                      {...register("targetRoles")}
                      className="text-blue-600 focus:ring-blue-500 rounded"
                    />
                    <span className="text-sm text-gray-700">Giáo viên</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      value="ADMIN"
                      {...register("targetRoles")}
                      className="text-blue-600 focus:ring-blue-500 rounded"
                    />
                    <span className="text-sm text-gray-700">Admin</span>
                  </label>
                </div>
                {errors.targetRoles && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.targetRoles.message}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thời gian bắt đầu
                  </label>
                  <input
                    {...register("startTime")}
                    type="datetime-local"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thời gian kết thúc
                  </label>
                  <input
                    {...register("endTime")}
                    type="datetime-local"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                  {errors.endTime && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.endTime.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">
                5
              </span>
              Cài đặt nâng cao
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Độ ưu tiên
                </label>
                <input
                  {...register("priority", { valueAsNumber: true })}
                  type="number"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Số lớn hơn sẽ được ưu tiên hiển thị trước
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alt Text (Cho SEO)
                  </label>
                  <input
                    {...register("altText")}
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ARIA Label (Hỗ trợ đọc)
                  </label>
                  <input
                    {...register("ariaLabel")}
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <label className="flex items-center gap-3 cursor-pointer">
                  <Controller
                    name="active"
                    control={control}
                    render={({ field }) => (
                      <div
                        className={`relative inline-block w-12 h-6 rounded-full transition-colors ${field.value ? "bg-blue-600" : "bg-gray-300"}`}
                      >
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                        <span
                          className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform ${field.value ? "translate-x-6" : "translate-x-0"}`}
                        />
                      </div>
                    )}
                  />
                  <span className="text-sm font-medium text-gray-900">
                    Kích hoạt banner này
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4 shrink-0 pb-10">
        <button
          type="button"
          className="px-6 py-2.5 rounded-xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors hidden md:flex items-center gap-2"
        >
          <Eye size={18} /> Xem trước
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full md:w-auto px-8 py-2.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save size={18} />
          )}
          {isSubmitting ? "Đang lưu..." : "Lưu Banner"}
        </button>
      </div>
    </form>
  );
};
