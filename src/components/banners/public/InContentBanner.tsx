import React, { useEffect, useState, useRef } from "react";
import { ArrowRight } from "lucide-react";
import type { Banner } from "../../../types/banner.types";
import { useBanners } from "../../../hooks/useBanners";
import { getResponsiveImageUrl, isValidUrl } from "../../../utils/bannerUtils";

interface InContentBannerProps {
  banner: Banner;
}

export const InContentBanner: React.FC<InContentBannerProps> = ({ banner }) => {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );
  const [hasTracked, setHasTracked] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);
  const { trackEvent } = useBanners();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Track impression when the banner scrolls into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasTracked) {
          trackEvent(banner.id, "IMPRESSION");
          setHasTracked(true);
        }
      },
      { threshold: 0.5 },
    );

    if (bannerRef.current) {
      observer.observe(bannerRef.current);
    }

    return () => {
      if (bannerRef.current) {
        observer.unobserve(bannerRef.current);
      }
    };
  }, [banner.id, hasTracked, trackEvent]);

  const handleClick = () => {
    trackEvent(banner.id, "CLICK");
    if (isValidUrl(banner.redirectUrl)) {
      window.open(banner.redirectUrl, "_blank");
    }
  };

  const imageUrl = getResponsiveImageUrl(banner, windowWidth);

  return (
    <div
      ref={bannerRef}
      className="w-full my-8 group cursor-pointer"
      onClick={handleClick}
      role="banner"
      aria-label={banner.ariaLabel || banner.title}
    >
      <div className="max-w-7xl mx-auto rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-white border border-gray-100 flex flex-col md:flex-row transform hover:-translate-y-1">
        {/* Image Side (40%) */}
        <div className="md:w-2/5 shrink-0 h-48 md:h-64 relative overflow-hidden bg-gray-100">
          {imageUrl && (
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
              style={{ backgroundImage: `url(${imageUrl})` }}
              role="img"
              aria-label={banner.altText || banner.title}
            />
          )}

          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-t md:bg-linear-to-r from-black/60 to-transparent opacity-80" />

          {/* Discount Tag (Optional, visually appealing) */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 px-3 py-1.5 bg-orange-500 rounded-lg shadow-md font-bold text-white text-sm transform -rotate-2 backdrop-blur-md">
            Khuyến mãi đặc biệt
          </div>
        </div>

        {/* Content Side (60%) */}
        <div className="md:w-3/5 p-6 sm:p-8 flex flex-col justify-center bg-linear-to-br from-white to-gray-50/50">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 tracking-tight group-hover:text-blue-600 transition-colors">
            {banner.title}
          </h3>

          {banner.description && (
            <p className="text-gray-600 text-sm sm:text-base mb-6 leading-relaxed line-clamp-3 md:max-w-xl">
              {banner.description}
            </p>
          )}

          <div className="mt-auto pt-2 flex items-center justify-between">
            <button className="px-6 py-2.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold rounded-xl shadow-sm transition-all flex items-center gap-2 group/btn border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Tìm hiểu thêm
              <ArrowRight
                size={18}
                className="transform transition-transform group-hover/btn:translate-x-1"
              />
            </button>

            <div className="text-sm font-medium text-gray-400">
              Chỉ trong thời gian ngắn
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
