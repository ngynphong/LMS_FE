import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Info } from "lucide-react";
import type { Banner } from "../../../types/banner.types";
import { useBanners } from "../../../hooks/useBanners";
import { isValidUrl } from "../../../utils/bannerUtils";

interface HeroBadgeProps {
  banner: Banner;
}

export const HeroBadge: React.FC<HeroBadgeProps> = ({ banner }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hasTracked, setHasTracked] = useState(false);
  const { trackEvent } = useBanners();

  // For HeroBadge, impression can be tracked immediately or on view
  // Let's assume impression is recorded when the component mounts
  React.useEffect(() => {
    if (!hasTracked) {
      trackEvent(banner.id, "IMPRESSION");
      setHasTracked(true);
    }
  }, [banner.id, trackEvent, hasTracked]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    trackEvent(banner.id, "CLICK");
    if (isValidUrl(banner.redirectUrl)) {
      window.open(banner.redirectUrl, "_blank");
    }
  };

  return (
    <div
      className="relative z-40 inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* The Animated Badge Element */}
      <motion.button
        onClick={handleClick}
        className="w-20 h-20 sm:w-24 sm:h-24 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-lg flex flex-col items-center justify-center relative cursor-pointer group focus:outline-none focus:ring-4 focus:ring-white/30"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Soft pulse ring */}
        <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping opacity-40 group-hover:opacity-75 duration-3000" />

        <span className="text-xl sm:text-3xl font-bold text-white mb-0.5">
          {banner.altText || "50%"}
        </span>
        <span className="text-[10px] sm:text-xs text-blue-100 font-medium uppercase tracking-wider">
          OFF
        </span>
      </motion.button>

      {/* Pop-up on Hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="absolute left-1/2 -translate-x-1/2 bottom-[115%] w-64 bg-white rounded-xl shadow-xl p-4 cursor-pointer"
            onClick={handleClick}
          >
            {/* Pop-up Arrow pointer */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 border-10 border-t-white border-x-transparent border-b-transparent" />

            <div className="flex gap-3">
              <div className="shrink-0 pt-1">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
                  <Info size={16} />
                </div>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-1 leading-tight">
                  {banner.title}
                </h4>
                {banner.description && (
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {banner.description}
                  </p>
                )}
                <div className="mt-2 text-xs font-semibold text-blue-600 flex items-center gap-1 group-hover:text-blue-700">
                  Khám phá ngay{" "}
                  <ArrowRight
                    size={12}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
