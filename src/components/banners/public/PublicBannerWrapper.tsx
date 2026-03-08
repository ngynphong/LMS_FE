import React from "react";
import { useBanners } from "@/hooks/useBanners";
import { TopBannerBar } from "./TopBannerBar";
import { BannerModal } from "./BannerModal";
import { FloatingSidebarBanner } from "./FloatingSidebarBanner";
import type { Banner } from "@/types/banner";
import { BannerType } from "@/types/banner";

export const PublicBannerWrapper: React.FC = () => {
  const { banners, loading } = useBanners();

  if (loading || !banners || banners.length === 0) return null;

  return (
    <>
      {banners.map((banner: Banner) => {
        switch (banner.bannerType) {
          case BannerType.TOP_BAR:
            return <TopBannerBar key={banner.id} banner={banner} />;
          case BannerType.POPUP:
            return <BannerModal key={banner.id} banner={banner} />;
          case BannerType.SIDEBAR:
          case BannerType.FLOATING:
            return <FloatingSidebarBanner key={banner.id} banner={banner} />;
          default:
            return null; // INLINE and HERO are usually placed specifically within content
        }
      })}
    </>
  );
};
