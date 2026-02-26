export interface NotificationItem {
  id: string;
  title: string;
  content: string;
  type: "SYSTEM" | "COURSE" | "ASSIGNMENT" | "INTERACTION" | "SCHEDULE" | "DEADLINE" | string;
  read: boolean;
  link?: string;
  createdAt: string;
  userId?: string;
  receiverEmail?: string | null;
}

export type NotificationResponse = NotificationItem[] | {
  content?: NotificationItem[];
  data?: NotificationItem[];
  items?: NotificationItem[];
  pageable?: any;
  last?: boolean;
  totalElements?: number;
  totalPages?: number;
  size?: number;
  number?: number;
  sort?: any;
  first?: boolean;
  numberOfElements?: number;
  empty?: boolean;
  [key: string]: any;
};

export interface GetNotificationsParams {
  page?: number;
  size?: number;
  sort?: string;
}
