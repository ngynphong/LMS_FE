import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLessonItemById } from "../../services/lessonService";
import type { LessonItem } from "../../types/learningTypes";
import PdfSlideshow from "@/components/common/PdfSlideshow";

const TeacherLessonItemPreviewPage = () => {
  const { courseId, itemId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<LessonItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      if (!itemId) return;
      try {
        setLoading(true);
        const data = await getLessonItemById(itemId);
        if (data) {
          setItem(data);
        } else {
          setError("Không tìm thấy nội dung bài học");
        }
      } catch (err) {
        setError("Có lỗi xảy ra khi tải nội dung");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [itemId]);

  const getItemTypeIcon = (type: string) => {
    switch (type) {
      case "VIDEO":
        return "play_circle";
      case "TEXT":
        return "article";
      case "PDF":
        return "picture_as_pdf";
      case "PPT":
        return "co_present";
      default:
        return "description";
    }
  };

  const getItemTypeColor = (type: string) => {
    switch (type) {
      case "VIDEO":
        return "text-purple-600 bg-purple-100";
      case "TEXT":
        return "text-blue-600 bg-blue-100";
      case "PDF":
        return "text-red-600 bg-red-100";
      case "PPT":
        return "text-orange-600 bg-orange-100";
      default:
        return "text-slate-600 bg-slate-100";
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <span className="material-symbols-outlined animate-spin text-4xl text-blue-600">
            progress_activity
          </span>
          <span className="text-slate-600">Đang tải nội dung...</span>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-gray-50">
        <span className="material-symbols-outlined text-5xl text-red-500">
          error
        </span>
        <p className="text-lg text-slate-700">
          {error || "Không tìm thấy nội dung"}
        </p>
        <button
          onClick={() => navigate(`/teacher/courses/${courseId}`)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Quay lại khóa học
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white px-6 py-4 shadow-sm z-10 sticky top-0">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/teacher/courses/${courseId}`)}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              <span className="font-medium">Quay lại</span>
            </button>
            <div className="h-6 w-px bg-slate-200"></div>
            <div className="flex items-center gap-3">
              <div
                className={`flex size-10 items-center justify-center rounded-lg ${getItemTypeColor(
                  item.type,
                )}`}
              >
                <span className="material-symbols-outlined text-xl">
                  {getItemTypeIcon(item.type)}
                </span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">
                  {item.title}
                </h1>
                <p className="text-xs text-slate-500">{item.type}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="mx-auto max-w-5xl space-y-6">
          {/* Description Card */}
          {item.description && (
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="mb-2 text-sm font-semibold text-slate-900">
                Mô tả
              </h2>
              <p className="text-slate-600">{item.description}</p>
            </div>
          )}

          {/* Main Content Card */}
          <div className="rounded-xl bg-white p-6 shadow-sm min-h-[500px]">
            {item.content ? (
              <div className="space-y-4">
                {item.type === "TEXT" ? (
                  <div className="prose max-w-none text-slate-800">
                    {item.content.textContent || "Không có nội dung văn bản"}
                  </div>
                ) : item.content.resourceUrl ? (
                  <div className="flex flex-col gap-4">
                    {item.type === "VIDEO" && (
                      <video
                        src={item.content.resourceUrl}
                        controls
                        className="aspect-video w-full rounded-lg bg-black shadow-sm"
                      />
                    )}

                    {item.type === "PDF" && (
                      <div className="flex flex-col gap-3">
                        <PdfSlideshow fileUrl={item.content.resourceUrl} />
                      </div>
                    )}

                    {item.type === "PPT" && (
                      <div className="flex flex-col gap-3">
                        <div className="flex h-[80vh] flex-col overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-sm">
                          <PdfSlideshow fileUrl={item.content.resourceUrl} />
                        </div>
                      </div>
                    )}

                    {/* For other file types or fallback */}
                    {item.type !== "VIDEO" &&
                      item.type !== "PDF" &&
                      item.type !== "PPT" && (
                        <div className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 bg-slate-50">
                          <div
                            className={`size-12 rounded-lg flex items-center justify-center shrink-0 ${getItemTypeColor(item.type)}`}
                          >
                            <span className="material-symbols-outlined text-2xl">
                              {getItemTypeIcon(item.type)}
                            </span>
                          </div>
                        </div>
                      )}
                  </div>
                ) : (
                  <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 italic text-slate-500">
                    Chưa có nội dung file
                  </div>
                )}
              </div>
            ) : (
              <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 italic text-slate-500">
                Không có dữ liệu nội dung
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherLessonItemPreviewPage;
