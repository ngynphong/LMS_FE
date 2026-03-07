import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBlogDetail, usePublicBlogs } from "../../hooks/useBlogs";
import BlockRenderer from "../../components/blog/BlockRenderer";
import { Calendar, Share2 } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import LoadingOverlay from "@/components/common/LoadingOverlay";

const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: response, isLoading, error } = useBlogDetail(slug || "");
  const { data: latestBlogsResponse } = usePublicBlogs(1, 4); // Lấy 4 bài để phòng trường hợp bài hiện tại nằm trong top 3

  useEffect(() => {
    if (response) {
      const result = response.data;

      if (result.needsRedirect && result.correctSlug) {
        navigate(`/blog/${result.correctSlug}`, { replace: true });
      }
    }
  }, [response, navigate]);

  if (isLoading) {
    return (
      <LoadingOverlay isLoading={isLoading} message="Đang tải bài viết..." />
    );
  }

  const blog = response?.data;
  const latestBlogs =
    latestBlogsResponse?.data?.items
      ?.filter((b: any) => b.slug !== slug)
      ?.slice(0, 3) || [];

  if (error || !blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <h1 className="text-6xl font-black text-gray-200 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">
          Rất tiếc, bài viết này không tồn tại hoặc đã bị gỡ bỏ.
        </p>
        <button
          onClick={() => navigate("/blog")}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
        >
          Quay lại danh sách blog
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-10 mt-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Section */}
        <div className="mb-8">
          {/* Breadcrumb */}
          <nav className="flex text-sm text-gray-500 mb-6 font-medium">
            <button
              onClick={() => navigate("/blog")}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Tin tức
            </button>
            <span className="mx-2">›</span>
            <span className="text-gray-900 line-clamp-1">{blog.title}</span>
          </nav>

          <h1 className="text-4xl md:text-5xl lg:text-[54px] font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-6">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm font-medium border-y border-gray-100 py-4 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs uppercase">
                {(blog.authorName || "U").charAt(0)}
              </div>
              <span className="text-gray-800 font-semibold">
                {blog.authorName || "Nhà sáng tạo"}
              </span>
            </div>
            <span className="text-gray-300">•</span>
            <time
              dateTime={blog.publishedAt}
              className="flex items-center gap-1.5"
            >
              <Calendar size={16} />
              {format(new Date(blog.createdAt), "dd/MM/yyyy", { locale: vi })}
            </time>
            <span className="text-gray-300">•</span>
            <div className="flex gap-2">
              <button className="text-gray-400 hover:text-blue-600 transition-colors">
                <Share2 size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Sticky Sidebar (Share/Socials) */}
          <div className="hidden lg:block w-12 shrink-0">
            <div className="sticky top-32 flex flex-col gap-4">
              <button
                title="Sao chép link"
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-black hover:border-black transition-colors bg-white shadow-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              </button>
              <button
                title="Chia sẻ Facebook"
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#1877F2] hover:border-[#1877F2] transition-colors bg-white shadow-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>
              <button
                title="Chia sẻ X (Twitter)"
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-black hover:border-black transition-colors bg-white shadow-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                </svg>
              </button>
              <button
                title="Lưu bài viết"
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-red-500 hover:border-red-500 transition-colors bg-white shadow-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Main Article Body */}
          <div className="flex-1 lg:max-w-[700px] xl:max-w-[800px]">
            {/* Summary / Lead Paragraph */}
            {blog.summary && (
              <p className="text-xl md:text-2xl text-gray-800 font-semibold leading-relaxed mb-10 pb-8 border-b border-gray-100">
                {blog.summary}
              </p>
            )}

            {/* Hero Image */}
            {blog.thumbnailUrl && (
              <figure className="mb-10 w-full">
                <img
                  src={blog.thumbnailUrl}
                  alt={blog.title}
                  className="w-full h-auto object-cover max-h-[500px]"
                />
                <figcaption className="text-sm text-gray-500 mt-3 text-center italic">
                  {blog.title} - Ảnh minh họa
                </figcaption>
              </figure>
            )}

            {/* Content Renderer */}
            <article className="prose prose-lg prose-blue max-w-none text-gray-800 leading-relaxed font-sans">
              <BlockRenderer content={blog.content} />
            </article>

            {/* Article Footer Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-12 pt-6 border-t border-gray-100 flex gap-2 flex-wrap">
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-1.5 bg-gray-100 text-gray-600 text-sm font-bold uppercase tracking-wider hover:bg-gray-200 cursor-pointer transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Right Sidebar (Ads / Related) */}
          <aside className="w-full lg:w-[320px] shrink-0 space-y-8">
            {/* Placeholder Ad Banner */}
            <div className="w-full aspect-3/4 bg-gray-100 flex flex-col items-center justify-center text-gray-400 p-6 text-center shadow-inner relative overflow-hidden group cursor-pointer">
              <span className="text-xs absolute top-2 right-2 border border-gray-300 px-1 text-gray-400">
                Quảng cáo
              </span>
              <img
                src="https://placehold.co/320x420/f8fafc/94a3b8?text=Banner+Qu%E1%BA%A3ng+C%C3%A1o"
                alt="Ad Placeholder"
                className="w-full h-full object-cover absolute inset-0 mix-blend-multiply opacity-50 group-hover:opacity-100 transition-opacity"
              />
              <div className="relative z-10 p-6 bg-white/90 backdrop-blur w-[90%] border-2 border-dashed border-[#1E90FF] transform group-hover:scale-105 transition-transform">
                <p className="font-extrabold text-2xl text-[#1E90FF] mb-2 uppercase tracking-widest">
                  SALE
                </p>
                <p className="font-bold text-gray-900 mb-4">
                  Khóa học ưu đãi 20%
                </p>
                <div className="bg-[#1E90FF] text-white px-4 py-2 font-bold text-sm">
                  Đăng ký ngay
                </div>
              </div>
            </div>

            {/* Outstanding News Placeholder */}
            <div className="border border-gray-200 p-6">
              <h3 className="font-bold text-gray-400 uppercase tracking-widest text-sm mb-6 pb-2 border-b border-gray-100">
                Tin nổi bật
              </h3>
              <div className="space-y-6">
                {latestBlogs.length > 0 ? (
                  latestBlogs.map((item: any) => (
                    <div
                      key={item.id}
                      onClick={() => navigate(`/blog/${item.slug}`)}
                      className="flex gap-4 group cursor-pointer"
                    >
                      <h4 className="flex-1 font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-sm leading-snug line-clamp-3">
                        {item.title}
                      </h4>
                      <div className="w-24 h-[68px] shrink-0 bg-gray-50 overflow-hidden border border-gray-100">
                        {item.thumbnailUrl ? (
                          <img
                            src={item.thumbnailUrl}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">
                            No Img
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm italic">
                    Chưa có bài viết liên quan
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;
