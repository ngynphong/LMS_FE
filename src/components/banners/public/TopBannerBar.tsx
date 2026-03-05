import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Bell } from "lucide-react";
import type { Banner } from "../../../types/banner.types";
import {
  shouldShowBanner,
  saveDismissedTime,
  getResponsiveImageUrl,
  isValidUrl,
} from "../../../utils/bannerUtils";
import { useBanners } from "../../../hooks/useBanners";

interface TopBannerBarProps {
  banner: Banner;
}

export const TopBannerBar: React.FC<TopBannerBarProps> = ({ banner }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );
  const { trackEvent } = useBanners();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (shouldShowBanner(banner)) {
      timeout = setTimeout(
        () => {
          setIsVisible(true);
          trackEvent(banner.id, "IMPRESSION");
        },
        (banner.displayDelay || 0) * 1000,
      );
    }
    return () => clearTimeout(timeout);
  }, [banner, trackEvent]);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    trackEvent(banner.id, "CLOSE");
    saveDismissedTime(banner.id);
  };

  const handleClick = () => {
    trackEvent(banner.id, "CLICK");
    if (isValidUrl(banner.redirectUrl)) {
      window.location.href = banner.redirectUrl;
    }
  };

  // Adjust body padding so banner doesn't overlap absolute/fixed top headers
  useEffect(() => {
    if (isVisible) {
      document.body.style.paddingTop = "60px"; // Adjust based on your banner height
    } else {
      document.body.style.paddingTop = "0px";
    }

    return () => {
      document.body.style.paddingTop = "0px";
    };
  }, [isVisible]);

  const imageUrl = getResponsiveImageUrl(banner, windowWidth);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed top-0 left-0 right-0 w-full z-100 cursor-pointer overflow-hidden group shadow-md"
          onClick={handleClick}
          role="banner"
          aria-label={banner.ariaLabel || banner.title}
        >
          {/* Background Image or Gradient */}
          {imageUrl ? (
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundImage: `url(${imageUrl})` }}
            />
          ) : (
            <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-indigo-700" />
          )}

          {/* Overlay to ensure text readability if there's an image */}
          {imageUrl && <div className="absolute inset-0 bg-black/40" />}

          <div className="relative px-4 py-3 md:py-2 flex items-center justify-between min-h-[50px] md:min-h-[60px] max-w-7xl mx-auto">
            <div className="flex items-center gap-3 flex-1">
              <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm text-white shrink-0 animate-pulse">
                <Bell size={16} />
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 text-white">
                <span className="font-semibold text-sm md:text-base line-clamp-1">
                  {banner.title}
                </span>
                {banner.description && (
                  <span className="text-xs md:text-sm text-white/90 line-clamp-1 border-l-0 md:border-l border-white/30 md:pl-3">
                    {banner.description}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleClose}
              className="ml-4 p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Close banner"
            >
              <X size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
