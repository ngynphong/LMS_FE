export const BannerType = {
  POPUP: 'POPUP',
  TOP_BAR: 'TOP_BAR',
  SIDEBAR: 'SIDEBAR',
  FLOATING: 'FLOATING',
  INLINE: 'INLINE'
} as const;
export type BannerType = (typeof BannerType)[keyof typeof BannerType];

export const BannerPosition = {
  TOP: 'TOP',
  BOTTOM: 'BOTTOM',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  CENTER: 'CENTER'
} as const;
export type BannerPosition = (typeof BannerPosition)[keyof typeof BannerPosition];

export const AnimationType = {
  FADE: 'FADE',
  SLIDE_UP: 'SLIDE_UP',
  SLIDE_DOWN: 'SLIDE_DOWN',
  SLIDE_LEFT: 'SLIDE_LEFT',
  SLIDE_RIGHT: 'SLIDE_RIGHT',
  SCALE: 'SCALE',
  BOUNCE: 'BOUNCE',
  NONE: 'NONE'
} as const;
export type AnimationType = (typeof AnimationType)[keyof typeof AnimationType];

export const BannerVisibility = {
  PUBLIC: 'PUBLIC',
  AUTHENTICATED: 'AUTHENTICATED',
  STUDENT_ONLY: 'STUDENT_ONLY',
  TEACHER_ONLY: 'TEACHER_ONLY',
  ADMIN_ONLY: 'ADMIN_ONLY'
} as const;
export type BannerVisibility = (typeof BannerVisibility)[keyof typeof BannerVisibility];

export interface Banner {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  imageUrlMobile?: string;
  imageUrlTablet?: string;
  redirectUrl: string;
  targetRoles: string[];
  targetVisibility: string;
  bannerType: BannerType | string;
  bannerPosition: BannerPosition | string;
  displayDelay: number;
  displayFrequencyHours: number;
  animationType: AnimationType | string;
  startTime?: string;
  endTime?: string;
  active: boolean;
  priority: number;
  impressions: number;
  clicks: number;
  closes: number;
  altText?: string;
  ariaLabel?: string;
}

export interface BannerCreationRequest {
  title: string;
  description?: string;
  redirectUrl: string;
  targetRoles: string[];
  targetVisibility: string;
  bannerType: string;
  bannerPosition?: string;
  displayDelay: number;
  displayFrequencyHours: number;
  animationType: string;
  startTime?: string;
  endTime?: string;
  isActive: boolean;
  priority: number;
  altText?: string;
  ariaLabel?: string;
}

export interface BannerTrackingRequest {
  eventType: 'IMPRESSION' | 'CLICK' | 'CLOSE';
  userId?: string;
  userAgent?: string;
  ipAddress?: string;
}

export interface PagedResponse<T> {
  items: T[];
  pageNo: number;
  pageSize: number;
  totalElement: number;
  totalPage: number;
  sortBy: string | null;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
