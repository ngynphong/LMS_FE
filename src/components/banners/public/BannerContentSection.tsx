import React from "react";
import { useBanners } from "../../../hooks/useBanners";
import { InContentBanner } from "./InContentBanner";
import { BannerType } from "../../../types/banner.types";

export const BannerContentSection: React.FC = () => {
  const { banners, loading } = useBanners();

  if (loading || !banners) return null;

  // Filter for INLINE (In-Content) banners
  const inlineBanners = banners.filter(
    (banner) => banner.bannerType === BannerType.INLINE,
  );

  if (inlineBanners.length === 0) return null;

  return (
    <div className="w-full space-y-6">
      {inlineBanners.map((banner) => (
        <InContentBanner key={banner.id} banner={banner} />
      ))}
    </div>
  );
};
