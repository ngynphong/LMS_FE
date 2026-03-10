export type NotificationCategory = "QUIZ" | "COURSE" | "IMPORT" | "AUTH" | "SYSTEM";

export interface NotificationItem {
  id: string;
  title: string;
  content: string;
  type: string;
  category: NotificationCategory;
  referenceId: string | null;
  jobId?: string | null;
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
  totalElement?: number;
  totalPage?: number;
  size?: number;
  number?: number;
  pageNo?: number;
  sort?: any;
  sortBy?: string[];
  first?: boolean;
  numberOfElements?: number;
  empty?: boolean;
  [key: string]: any;
};

export interface GetNotificationsParams {
  pageNo?: number;
  pageSize?: number;
  sort?: string;
}
