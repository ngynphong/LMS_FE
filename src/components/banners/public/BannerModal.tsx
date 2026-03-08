import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ArrowRight } from "lucide-react";
import type { Banner } from "@/types/banner";
import {
  shouldShowBanner,
  saveDismissedTime,
  getResponsiveImageUrl,
  isValidUrl,
} from "@/utils/bannerUtils";
import { useBanners } from "@/hooks/useBanners";

interface BannerModalProps {
  banner: Banner;
}

export const BannerModal: React.FC<BannerModalProps> = ({ banner }) => {
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

    // Check if we should show the banner based on frequency mapping
    if (shouldShowBanner(banner)) {
      // Time-based trigger (e.g. 3 seconds delay)
      timeout = setTimeout(
        () => {
          setIsVisible(true);
          trackEvent(banner.id, "IMPRESSION");
        },
        (banner.displayDelay || 3) * 1000,
      );
    }

    return () => clearTimeout(timeout);
  }, [banner, trackEvent]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isVisible) {
        handleClose(e as unknown as React.MouseEvent);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible]);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    trackEvent(banner.id, "CLOSE");
    saveDismissedTime(banner.id);

    // Restore body scroll
    document.body.style.overflow = "unset";
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    trackEvent(banner.id, "CLICK");
    if (isValidUrl(banner.redirectUrl)) {
      window.open(banner.redirectUrl, "_blank"); // or use router navigation if internal
      setIsVisible(false); // Optionally close after click
      saveDismissedTime(banner.id);
    }
  };

  // Prevent background scrolling when open
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isVisible]);

  const imageUrl = getResponsiveImageUrl(banner, windowWidth);

  // Animation variants
  const modalVariants: any = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", damping: 25, stiffness: 300 },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 20,
      transition: { duration: 0.2 },
    },
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div
          className="fixed inset-0 z-1000 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
            aria-hidden="true"
          />

          {/* Modal Content */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/10 hover:bg-black/20 text-white hover:text-white transition-colors backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {/* Image Section */}
            {imageUrl && (
              <div
                className="w-full h-48 sm:h-64 bg-gray-100 bg-cover bg-center cursor-pointer"
                style={{ backgroundImage: `url(${imageUrl})` }}
                onClick={handleClick}
                role="img"
                aria-label={banner.altText || banner.title}
              />
            )}

            {/* Content Section */}
            <div className="p-6 sm:p-8 flex flex-col items-center text-center">
              <h2
                id="modal-title"
                className="text-xl sm:text-2xl font-bold text-gray-900 mb-2"
              >
                {banner.title}
              </h2>

              {banner.description && (
                <p className="text-gray-600 text-sm sm:text-base mb-6">
                  {banner.description}
                </p>
              )}

              <button
                onClick={handleClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Khám phá ngay
                <ArrowRight size={18} />
              </button>

              <button
                onClick={handleClose}
                className="mt-4 text-sm text-gray-500 hover:text-gray-700 transition-colors bg-transparent"
              >
                Bỏ qua
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
