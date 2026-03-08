import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { BannerForm } from "../../../components/banners/admin/BannerForm";
import { bannerService } from "../../../services/bannerService";
import type { BannerCreationRequest } from "../../../types/banner";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/common/Toast";

export const BannerCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (
    data: BannerCreationRequest,
    images: { desktop?: File; mobile?: File; tablet?: File },
  ) => {
    if (!images.desktop) return;

    setIsSubmitting(true);
    try {
      await bannerService.createBanner(
        data,
        images.desktop,
        images.mobile,
        images.tablet,
      );

      // Invalidate queries to refresh list
      queryClient.invalidateQueries({ queryKey: ["adminBanners"] });

      toast.success("Thêm mới thành công!");
      navigate("/admin/banners");
    } catch (error) {
      console.error("Error creating banner", error);
      toast.error("Đã xảy ra lỗi khi tạo banner");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/admin/banners"
          className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Thêm Banner thiết kế mới
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Khởi tạo một chiến dịch quảng cáo, sự kiện hoặc thông báo mới
          </p>
        </div>
      </div>

      <BannerForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
};
