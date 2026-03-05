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

  // Adjust body padding and CSS variables so banner doesn't overlap header
  useEffect(() => {
    const bannerHeight = isVisible ? "60px" : "0px";
    document.documentElement.style.setProperty("--banner-height", bannerHeight);
    document.body.style.paddingTop = bannerHeight;

    return () => {
      document.documentElement.style.setProperty("--banner-height", "0px");
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
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 200,
            mass: 0.8,
          }}
          className="fixed top-0 left-0 right-0 w-full z-100 cursor-pointer overflow-hidden group border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
          onClick={handleClick}
          role="banner"
          aria-label={banner.ariaLabel || banner.title}
        >
          {/* Enhanced Background with Mesh Gradient and Glassmorphism */}
          {imageUrl ? (
            <>
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${imageUrl})` }}
              />
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
            </>
          ) : (
            <div className="absolute inset-0 bg-linear-to-r from-[#1e40af] via-[#3b82f6] to-[#1e40af] bg-size-[200%_auto] animate-[gradient_8s_ease_infinite]" />
          )}

          {/* Glass Overlay Effect */}
          <div className="absolute inset-0 bg-white/5 backdrop-blur-md opacity-50" />

          <div className="relative px-6 py-4 md:py-3 flex items-center justify-between min-h-[50px] md:min-h-[56px] max-w-7xl mx-auto">
            <div className="flex items-center gap-4 flex-1">
              <div className="hidden sm:flex items-center justify-center w-9 h-9 rounded-xl bg-white/15 backdrop-blur-sm text-white shrink-0 border border-white/20 shadow-inner group-hover:scale-105 transition-transform">
                <Bell size={18} className="animate-bounce" />
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 text-white">
                <h3 className="font-bold text-sm md:text-lg tracking-tight line-clamp-1 drop-shadow-sm">
                  {banner.title}
                </h3>
                {banner.description && (
                  <div className="flex items-center gap-3">
                    <div className="hidden md:block w-1 h-4 bg-white/30 rounded-full" />
                    <p className="text-xs md:text-sm text-white/80 line-clamp-1 font-medium italic">
                      {banner.description}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="hidden md:flex px-4 py-1.5 bg-white text-[#1e40af] text-sm font-bold rounded-lg hover:bg-blue-50 transition-all shadow-lg active:scale-95">
                Khám phá ngay
              </button>

              <button
                onClick={handleClose}
                className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/20 transition-all focus:outline-none border border-transparent hover:border-white/20"
                aria-label="Close banner"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Simple slide highlight animation */}
          <div className="absolute bottom-0 left-0 h-[2px] bg-white/30 w-full overflow-hidden">
            <motion.div
              className="h-full bg-white/60 w-1/3"
              animate={{ x: ["-100%", "300%"] }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
