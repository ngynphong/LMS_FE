import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BannerForm } from "../../../components/banners/admin/BannerForm";
import { bannerService } from "../../../services/bannerService";
import type { BannerCreationRequest } from "../../../types/banner.types";
import { toast } from "@/components/common/Toast";

export const BannerEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: bannerResponse, isLoading } = useQuery({
    queryKey: ["bannerDetail", id],
    queryFn: () => bannerService.getBannerById(id as string),
    enabled: !!id,
  });

  const banner = bannerResponse?.data;

  const handleSubmit = async (
    data: BannerCreationRequest,
    images: { desktop?: File; mobile?: File; tablet?: File },
  ) => {
    if (!id) return;

    setIsSubmitting(true);
    try {
      await bannerService.updateBanner(
        id,
        data,
        images.desktop,
        images.mobile,
        images.tablet,
      );

      queryClient.invalidateQueries({ queryKey: ["adminBanners"] });
      queryClient.invalidateQueries({ queryKey: ["bannerDetail", id] });

      toast.success("Cập nhật thành công!");
      navigate("/admin/banners");
    } catch (error) {
      console.error("Error updating banner", error);
      toast.error("Đã xảy ra lỗi khi cập nhật banner");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!banner) {
    return (
      <div className="p-6 max-w-7xl mx-auto text-center">
        <h2 className="text-xl font-bold text-gray-900">
          Không tìm thấy banner
        </h2>
        <Link
          to="/admin/banners"
          className="text-blue-600 hover:underline mt-4 inline-block"
        >
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  // Map Banner to BannerCreationRequest
  const initialData: Partial<BannerCreationRequest> = {
    title: banner.title,
    description: banner.description,
    redirectUrl: banner.redirectUrl,
    targetRoles: banner.targetRoles,
    targetVisibility: banner.targetVisibility,
    bannerType: banner.bannerType,
    bannerPosition: banner.bannerPosition,
    displayDelay: banner.displayDelay,
    displayFrequencyHours: banner.displayFrequencyHours,
    animationType: banner.animationType,
    startTime: banner.startTime,
    endTime: banner.endTime,
    active: banner.active,
    priority: banner.priority,
    altText: banner.altText,
    ariaLabel: banner.ariaLabel,
  };

  const initialImages = {
    desktop: banner.imageUrl,
    mobile: banner.imageUrlMobile,
    tablet: banner.imageUrlTablet,
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to="/admin/banners"
          className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa Banner</h1>
          <p className="text-sm text-gray-500 mt-1">
            Cập nhật nội dung hiển thị cho banner đã chọn
          </p>
        </div>
      </div>

      <BannerForm
        initialData={initialData}
        initialImages={initialImages}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
