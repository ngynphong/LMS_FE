export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: Content; // Structured content (blocks)
  thumbnailUrl?: string;
  authorId: string;
  authorName: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

export interface Content {
  blocks: Block[];
  time?: number;
  version?: string;
}

export interface Block {
  type: 'header' | 'paragraph' | 'file';
  data: HeaderBlockData | ParagraphBlockData | FileBlockData;
}

export interface HeaderBlockData {
  text: string;
  level: number;
}

export interface ParagraphBlockData {
  text: string;
}

export interface FileBlockData {
  fileKey: string;
  caption?: string;
  url?: string;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface BlogDetailResponse extends BlogPost {
  needsRedirect?: boolean;
  correctSlug?: string;
}

export interface BlogListResponse {
  items: BlogPost[];
  totalElement: number;
  totalPage: number;
  pageNo: number;
  pageSize: number;
}

export interface CreateBlogPayload {
  title: string;
  content: Content;
  tags?: string[];
}