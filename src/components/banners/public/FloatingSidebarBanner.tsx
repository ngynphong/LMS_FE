import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { Variants } from "motion/react";
import { X, Gift } from "lucide-react";
import type { Banner } from "@/types/banner";
import {
  shouldShowBanner,
  saveDismissedTime,
  getResponsiveImageUrl,
  isValidUrl,
} from "@/utils/bannerUtils";
import { useBanners } from "@/hooks/useBanners";

interface FloatingSidebarBannerProps {
  banner: Banner;
}

export const FloatingSidebarBanner: React.FC<FloatingSidebarBannerProps> = ({
  banner,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
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
          // Track impression when first shown
          trackEvent(banner.id, "IMPRESSION");
        },
        (banner.displayDelay || 2) * 1000,
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

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    trackEvent(banner.id, "CLICK");
    if (isValidUrl(banner.redirectUrl)) {
      window.open(banner.redirectUrl, "_blank");
      setIsExpanded(false);
      setIsVisible(false);
      saveDismissedTime(banner.id);
    }
  };

  const imageUrl = getResponsiveImageUrl(banner, windowWidth);

  const floatVariants: Variants = {
    hidden: {
      opacity: 0,
      x: 100,
      scale: 0.8,
    },
    collapsed: {
      opacity: 1,
      x: 0,
      scale: 1,
      width: 60,
      height: 60,
      borderRadius: "9999px",
      transition: { type: "spring", damping: 20, stiffness: 300 },
    },
    expanded: {
      opacity: 1,
      x: 0,
      scale: 1,
      width: windowWidth < 640 ? windowWidth - 32 : 320,
      height: 400,
      borderRadius: "16px",
      transition: { type: "spring", damping: 25, stiffness: 300 },
    },
    exit: {
      opacity: 0,
      x: 100,
      scale: 0.8,
      transition: { duration: 0.3 },
    },
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={floatVariants}
          initial="hidden"
          animate={isExpanded ? "expanded" : "collapsed"}
          exit="exit"
          className="fixed bottom-24 sm:bottom-28 right-4 sm:right-6 z-9999 bg-white shadow-2xl overflow-hidden cursor-pointer"
          style={{
            backgroundImage: isExpanded
              ? "none"
              : "linear-gradient(to right, #2563eb, #4f46e5)",
          }}
          onClick={handleToggleExpand}
          role="complementary"
          aria-label={banner.ariaLabel || banner.title}
        >
          {/* Collapsed State */}
          <AnimatePresence>
            {!isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full flex items-center justify-center text-white relative"
              >
                {/* Ping Animation */}
                <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping opacity-75" />
                <Gift size={28} />

                {/* Notification Badge */}
                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Expanded State */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full flex flex-col relative bg-white"
              >
                {/* Close Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(false);
                  }}
                  className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="Collapse banner"
                >
                  <X size={16} />
                </button>

                {/* Banner Image */}
                <div
                  className="h-40 bg-gray-100 bg-cover bg-center shrink-0"
                  style={{ backgroundImage: `url(${imageUrl})` }}
                />

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {banner.title}
                  </h3>

                  {banner.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {banner.description}
                    </p>
                  )}

                  <div className="mt-auto space-y-2">
                    <button
                      onClick={handleClick}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                    >
                      Xem chi tiết
                    </button>

                    <button
                      onClick={handleClose}
                      className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors bg-transparent border-none"
                    >
                      Không hiển thị lại
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
