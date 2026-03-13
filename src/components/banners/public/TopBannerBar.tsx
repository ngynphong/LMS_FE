import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import type { Banner } from "@/types/banner";
import {
  shouldShowBanner,
  saveDismissedTime,
  getResponsiveImageUrl,
  isValidUrl,
} from "@/utils/bannerUtils";
import { useBanners } from "@/hooks/useBanners";

interface TopBannerBarProps {
  banner: Banner;
}

const Marquee = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`overflow-hidden whitespace-nowrap flex flex-1 ${className}`}
    >
      <motion.div
        className="flex shrink-0 items-center gap-4 pr-4"
        initial={{ x: 0 }}
        animate={{ x: "-100%" }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
      >
        {children}
      </motion.div>
      <motion.div
        className="flex shrink-0 items-center gap-4 pr-4"
        initial={{ x: 0 }}
        animate={{ x: "-100%" }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
      >
        {children}
      </motion.div>
    </div>
  );
};

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
      window.location.href = banner.redirectUrl!;
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
          className="fixed top-0 left-0 right-0 w-full z-50 cursor-pointer overflow-hidden group border-b  shadow-[0_4px_30px_rgba(0,0,0,0.1)] h-[60px]"
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

          <div
            className="relative px-6 flex items-center justify-between h-full mx-auto"
            title="Khám phá ngay"
          >
            {/* Marquee Content */}
            <Marquee className="mr-4 text-white">
              <h3 className="font-bold text-sm md:text-lg tracking-tight drop-shadow-sm whitespace-nowrap">
                {banner.title}
              </h3>
              {banner.description && (
                <div className="flex items-center gap-3">
                  <div className="hidden md:block w-1 h-4 bg-white/30 rounded-full" />
                  <p className="text-xs md:text-sm text-white/80 font-medium italic whitespace-nowrap">
                    {banner.description}
                  </p>
                </div>
              )}
            </Marquee>

            <div className="flex items-center gap-2 shrink-0 z-10 bg-transparent">
              <button
                onClick={handleClose}
                className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/20 transition-all focus:outline-none border border-transparent hover:border-white/20 cursor-pointer"
                aria-label="Close banner"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
