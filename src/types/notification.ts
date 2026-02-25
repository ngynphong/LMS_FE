export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "SYSTEM" | "COURSE" | "ASSIGNMENT" | "INTERACTION" | "SCHEDULE" | "DEADLINE" | string;
  isRead: boolean;
  link?: string;
  createdAt: string;
  userId?: string;
}

export interface NotificationResponse {
  content: NotificationItem[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface GetNotificationsParams {
  page?: number;
  size?: number;
  sort?: string;
}
