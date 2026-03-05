export const STORAGE_KEYS = {
  // Format: banner_last_shown_{bannerId}
  LAST_SHOWN: (bannerId: string) => `banner_last_shown_${bannerId}`,
  
  // Format: banner_dismissed_{bannerId}
  DISMISSED: (bannerId: string) => `banner_dismissed_${bannerId}`,
  
  // Format: banner_preferences
  PREFERENCES: 'banner_preferences',
};
