import React from "react";
import { usePublicBlogs } from "@/hooks/useBlogs";
import { Link } from "react-router-dom";
import {
  Calendar,
  User,
  ArrowRight,
  ImageIcon,
  Search,
  Filter,
  SortDesc,
} from "lucide-react";
import PaginationControl from "@/components/common/PaginationControl";
import { useDebounce } from "@/hooks/useDebounce";
import type { BlogPost, FileBlockData, ParagraphBlockData } from "@/types/blog";

const getThumbnailUrl = (post: BlogPost): string | null => {
  if (post.thumbnailUrl) return post.thumbnailUrl;

  // Try to find first image in content blocks
  const firstImageBlock = post.content?.blocks?.find((b) => b.type === "file");
  if (firstImageBlock) {
    const fileKey = (firstImageBlock.data as FileBlockData).fileKey;
    if (fileKey) {
      if (fileKey.startsWith("http")) return fileKey;
      const baseUrl =
        import.meta.env.VITE_MINIO_URL || "https://minio.iesfocus.edu.vn/blog/";
      const separator = baseUrl.endsWith("/") ? "" : "/";
      return `${baseUrl}${separator}${fileKey}`;
    }
  }
  return null;
};

const FallbackThumbnail = ({ title }: { title: string }) => {
  const hash = title
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colors = [
    "from-blue-500 to-indigo-600",
    "from-emerald-400 to-teal-600",
    "from-orange-400 to-rose-500",
    "from-purple-500 to-fuchsia-600",
    "from-cyan-400 to-blue-500",
  ];
  const colorClass = colors[hash % colors.length];

  return (
    <div
      className={`w-full h-full bg-linear-to-br ${colorClass} flex items-center justify-center p-8 group-hover:scale-105 transition-transform duration-700 ease-out`}
    >
      <div className="text-white text-center opacity-90 drop-shadow-md">
        <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
        <span className="font-extrabold text-2xl lg:text-3xl line-clamp-2 leading-tight mix-blend-overlay">
          {title}
        </span>
      </div>
    </div>
  );
};

const getSummaryText = (post: BlogPost): string => {
  if (post.summary) return post.summary;

  // Try to extract text from first paragraph block
  const firstParagraph = post.content?.blocks?.find(
    (b) => b.type === "paragraph",
  );
  if (firstParagraph) {
    const text = (firstParagraph.data as ParagraphBlockData).text || "";
    // Strip rough HTML tags
    return text.replace(/<[^>]*>?/gm, "").slice(0, 150) + "...";
  }

  return "Nhấn để đọc chi tiết bài viết này...";
};

const BlogPage: React.FC = () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [searchKeyword, setSearchKeyword] = React.useState("");
  const debouncedSearch = useDebounce(searchKeyword, 500);
  const [selectedTag, setSelectedTag] = React.useState<string | undefined>();
  const [sortOrder, setSortOrder] = React.useState<string>("createdAt:desc");

  const { data, isLoading, error } = usePublicBlogs(
    currentPage,
    pageSize,
    selectedTag,
    debouncedSearch,
    [sortOrder],
  );

  React.useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedTag, sortOrder]);

  if (isLoading)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E90FF]"></div>
        <p className="text-gray-500 font-medium animate-pulse">
          Đang tải bài viết...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="bg-red-50 text-red-500 p-6 rounded-2xl max-w-md text-center border border-red-100 shadow-sm">
          <p className="font-bold text-lg mb-2">Oops! Đã có lỗi xảy ra</p>
          <p className="text-sm">Không thể tải danh sách tin tức lúc này.</p>
        </div>
      </div>
    );

  const posts = data?.data.items || [];
  const featuredPost = posts[0];
  const regularPosts = posts.slice(1);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24 text-center">
          <h1 className="text-5xl lg:text-6xl font-extrabold text-[#0B1525] tracking-tight mb-6 leading-tight">
            Tin tức & Sự kiện
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Cập nhật những thông tin mới nhất về khóa học, công nghệ và các sự
            kiện nổi bật từ nền tảng học tập của chúng tôi.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-10 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 p-6 md:p-8 border border-gray-100 flex flex-col md:flex-row gap-6 items-center">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Tìm kiếm bài viết theo tiêu đề, nội dung..."
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-base focus:ring-2 focus:ring-[#1E90FF]/20 transition-all outline-none"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            {/* Tag Filter - For now just a simple input or placeholder if tags list not available */}
            <div className="relative flex-1 md:w-48">
              <Filter
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <select
                className="w-full pl-11 pr-8 py-4 bg-gray-50 border-none rounded-2xl text-sm appearance-none focus:ring-2 focus:ring-[#1E90FF]/20 transition-all outline-none font-medium text-gray-700"
                value={selectedTag || ""}
                onChange={(e) => setSelectedTag(e.target.value || undefined)}
              >
                <option value="">Tất cả danh mục</option>
                <option value="Công nghệ">Công nghệ</option>
                <option value="Khóa học">Khóa học</option>
                <option value="Sự kiện">Sự kiện</option>
                <option value="Thông báo">Thông báo</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="relative flex-1 md:w-48">
              <SortDesc
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <select
                className="w-full pl-11 pr-8 py-4 bg-gray-50 border-none rounded-2xl text-sm appearance-none focus:ring-2 focus:ring-[#1E90FF]/20 transition-all outline-none font-medium text-gray-700"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="createdAt:desc">Mới nhất</option>
                <option value="createdAt:asc">Cũ nhất</option>
                <option value="title:asc">A - Z</option>
                <option value="title:desc">Z - A</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {posts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-lg">
              Chưa có bài viết nào được xuất bản.
            </p>
          </div>
        ) : (
          <>
            {/* Featured Post (Latest) */}
            {featuredPost && (
              <Link
                to={`/blog/${featuredPost.slug}`}
                className="group block bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 transition-all duration-300 mb-16 transform hover:-translate-y-1"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  <div className="aspect-video lg:aspect-auto h-full overflow-hidden relative bg-gray-100">
                    {getThumbnailUrl(featuredPost) ? (
                      <img
                        src={getThumbnailUrl(featuredPost)!}
                        alt={featuredPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <FallbackThumbnail title={featuredPost.title} />
                    )}
                    <div className="absolute top-6 left-6 flex gap-2">
                      {featuredPost.tags?.slice(0, 1).map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-[#1E90FF] uppercase tracking-wider shadow-sm"
                        >
                          {tag}
                        </span>
                      ))}
                      <span className="bg-[#FF6B6B] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                        Mới nhất
                      </span>
                    </div>
                  </div>
                  <div className="p-8 lg:p-14 flex flex-col justify-center">
                    <div className="flex items-center gap-4 text-sm font-medium text-gray-500 mb-6">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={16} className="text-gray-400" />
                        <time dateTime={featuredPost.publishedAt}>
                          {new Date(
                            featuredPost.publishedAt || featuredPost.createdAt,
                          ).toLocaleDateString("vi-VN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </time>
                      </div>
                      <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                      <div className="flex items-center gap-1.5">
                        <User size={16} className="text-gray-400" />
                        <span>{featuredPost.authorName}</span>
                      </div>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-extrabold text-[#0B1525] group-hover:text-[#1E90FF] transition-colors mb-6 leading-tight line-clamp-3">
                      {featuredPost.title}
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed mb-8 line-clamp-3">
                      {getSummaryText(featuredPost)}
                    </p>
                    <div className="mt-auto inline-flex items-center gap-2 text-[#1E90FF] font-bold text-lg group-hover:gap-3 transition-all">
                      Đọc chi tiết <ArrowRight size={20} />
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Grid Posts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="aspect-16/10 overflow-hidden relative bg-gray-50">
                    {getThumbnailUrl(post) ? (
                      <img
                        src={getThumbnailUrl(post)!}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full group-hover:scale-110 transition-transform duration-700 ease-out">
                        <FallbackThumbnail title={post.title} />
                      </div>
                    )}
                    {post.tags && post.tags.length > 0 && (
                      <div className="absolute top-4 left-4 flex gap-2">
                        {post.tags.slice(0, 2).map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-bold text-[#1E90FF] uppercase tracking-wider"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 text-xs font-medium text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} className="text-gray-400" />
                        <time dateTime={post.publishedAt}>
                          {new Date(
                            post.publishedAt || post.createdAt,
                          ).toLocaleDateString("vi-VN")}
                        </time>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-[#0B1525] group-hover:text-[#1E90FF] transition-colors mb-3 line-clamp-2 leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-1 wrap-break-word">
                      {getSummaryText(post)}
                    </p>
                    <div className="mt-auto border-t border-gray-50 pt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-[10px] uppercase">
                          {(post.authorName || "U").charAt(0)}
                        </div>
                        <span className="text-xs font-medium text-gray-600">
                          {post.authorName || "Nhà sáng tạo"}
                        </span>
                      </div>
                      <div className="text-[#1E90FF] font-semibold text-sm flex items-center gap-1 group-hover:bg-blue-50 px-2 py-1 rounded transition-colors">
                        Đọc <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {/* Pagination */}
            {data && data.data.totalPage > 1 && (
              <div className="mt-16 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <PaginationControl
                  currentPage={currentPage}
                  totalPages={data.data.totalPage}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  pageSize={pageSize}
                  onPageSizeChange={(size) => {
                    setPageSize(size);
                    setCurrentPage(1);
                  }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
