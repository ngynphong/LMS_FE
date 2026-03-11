import React, { useState, useEffect } from "react";
import { useAdminUserManual } from "@/hooks/useAdmin";
import { Save, FileText, Eye, Edit3 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Breadcrumb from "@/components/common/Breadcrumb";

const AdminUserManualPage: React.FC = () => {
  const { data: response, isLoading, updateManual, isUpdating } = useAdminUserManual();
  const [content, setContent] = useState("");
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  useEffect(() => {
    if (response?.data) {
      setContent(response.data.content || "");
    }
  }, [response]);

  const handleSave = () => {
    updateManual({ content });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="pb-6">
        <Breadcrumb
          items={[
            { label: "Hệ thống", url: "/admin/dashboard" },
            { label: "Hướng dẫn sử dụng" },
          ]}
          className="flex items-center gap-2 mb-2"
          itemClassName="text-sm text-[#607b8a] font-medium hover:text-[#0078bd] transition-colors"
          activeItemClassName="text-sm text-[#111518] font-medium"
          separator={<span className="text-[#607b8a] text-sm">/</span>}
        />
        <div className="flex flex-wrap justify-between items-end gap-4">
          <div className="max-w-2xl">
            <h2 className="text-[#111518] text-4xl font-black tracking-tight mb-2">
              Hướng dẫn sử dụng
            </h2>
            <p className="text-[#607b8a] text-base leading-relaxed">
              Quản lý nội dung hướng dẫn sử dụng cho người dùng trên hệ thống.
              Hỗ trợ định dạng Markdown.
            </p>
          </div>
          <div className="flex gap-3 pb-2">
            <button
              onClick={handleSave}
              disabled={isUpdating}
              className="px-5 py-2.5 color-primary-bg text-white font-semibold text-sm rounded-lg flex items-center gap-2 hover:bg-[#0078bd]/90 shadow-lg shadow-[#0078bd]/20 transition-all disabled:opacity-50"
            >
              <Save size={18} />
              {isUpdating ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col flex-1 min-h-[600px]">
        {/* Tabs */}
        <div className="flex items-center border-b border-slate-100 bg-slate-50/50 px-4">
          <button
            onClick={() => setActiveTab("edit")}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all border-b-2 ${
              activeTab === "edit"
                ? "border-[#1E90FF] color-primary"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <Edit3 size={16} />
            Chỉnh sửa
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all border-b-2 ${
              activeTab === "preview"
                ? "border-[#1E90FF] color-primary"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <Eye size={16} />
            Xem trước
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-hidden flex flex-col">
          {activeTab === "edit" ? (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full flex-1 p-6 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0078bd] focus:border-transparent outline-none transition-all font-mono text-sm leading-relaxed resize-none"
              placeholder="Nhập nội dung hướng dẫn bằng định dạng Markdown..."
            />
          ) : (
            <div className="w-full flex-1 p-8 bg-white overflow-y-auto prose prose-slate max-w-none markdown-content">
              {content ? (
                <ReactMarkdown>{content}</ReactMarkdown>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
                  <FileText size={48} strokeWidth={1} />
                  <p>Chưa có nội dung để xem trước</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Markdown Help */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
        <h4 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-base">info</span>
          Gợi ý định dạng Markdown
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-blue-700">
          <div>
            <p>
              <strong># Tiêu đề 1</strong>
            </p>
            <p>
              <strong>## Tiêu đề 2</strong>
            </p>
          </div>
          <div>
            <p>
              <strong>**In đậm**</strong>
            </p>
            <p>
              <em>*In nghiêng*</em>
            </p>
          </div>
          <div>
            <p>- Danh sách</p>
            <p>1. Danh sách số</p>
          </div>
          <div>
            <p>[Liên kết](url)</p>
            <p>![Ảnh](url)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserManualPage;
