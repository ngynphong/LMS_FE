import type { Banner } from '../types/banner.types';
import { STORAGE_KEYS } from '../constants/bannerConstants';

export const shouldShowBanner = (banner: Banner): boolean => {
  const lastShownTime = getLastShownTime(banner.id);
  const dismissedTime = getDismissedTime(banner.id);

  if (!lastShownTime && !dismissedTime) {
    return true; // Never shown and never dismissed
  }

  const now = new Date().getTime();
  const frequencyMs = (banner.displayFrequencyHours || 0) * 60 * 60 * 1000;
  
  // If frequency is 0, it means it should not reappear if dismissed
  if (frequencyMs === 0) {
    return !dismissedTime;
  }

  // If frequency > 0, wait for frequencyMs since the LAST interaction (show or dismiss)
  const lastInteractionTime = Math.max(lastShownTime || 0, dismissedTime || 0);
  return (now - lastInteractionTime) >= frequencyMs;
};

export const getResponsiveImageUrl = (banner: Banner, windowWidth: number): string => {
  if (windowWidth < 768 && banner.imageUrlMobile) {
    return banner.imageUrlMobile;
  }
  if (windowWidth >= 768 && windowWidth < 1024 && banner.imageUrlTablet) {
    return banner.imageUrlTablet;
  }
  return banner.imageUrl;
};

export const saveLastShownTime = (bannerId: string, time: number = new Date().getTime()): void => {
  localStorage.setItem(STORAGE_KEYS.LAST_SHOWN(bannerId), time.toString());
};

export const getLastShownTime = (bannerId: string): number | null => {
  const time = localStorage.getItem(STORAGE_KEYS.LAST_SHOWN(bannerId));
  return time ? parseInt(time, 10) : null;
};

export const saveDismissedTime = (bannerId: string, time: number = new Date().getTime()): void => {
  localStorage.setItem(STORAGE_KEYS.DISMISSED(bannerId), time.toString());
};

export const getDismissedTime = (bannerId: string): number | null => {
  const time = localStorage.getItem(STORAGE_KEYS.DISMISSED(bannerId));
  return time ? parseInt(time, 10) : null;
};

export const isValidUrl = (url: string): boolean => {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return false;
  }
};

export const formatAnalytics = (impressions: number, clicks: number, closes: number): string => {
  const clickRate = impressions > 0 ? ((clicks / impressions) * 100).toFixed(1) : '0.0';
  return `${impressions} views | ${clicks} clicks (${clickRate}%) | ${closes} closes`;
};
