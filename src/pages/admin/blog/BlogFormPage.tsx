import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAdminBlogDetail, useAdminBlogMutations } from "@/hooks/useBlogs";
import type {
  Content,
  Block,
  HeaderBlockData,
  ParagraphBlockData,
  FileBlockData,
  CreateBlogPayload,
} from "@/types/blog";
import {
  ArrowLeft,
  Save,
  Trash2,
  Image as ImageIcon,
  Type,
  Heading,
  X,
} from "lucide-react";
import { blogService } from "@/services/blogService";
import { toast } from "react-toastify";
import BlockRenderer from "@/components/blog/BlockRenderer";

const BlogFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: response, isLoading } = useAdminBlogDetail(id || "");
  const { createBlog, updateBlog, isCreating, isUpdating } =
    useAdminBlogMutations();

  const [formData, setFormData] = useState<Partial<CreateBlogPayload>>({
    title: "",
    content: { blocks: [] },
    tags: [],
  });

  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (response?.data) {
      const blog = response.data;
      setFormData({
        title: blog.title,
        content: blog.content,
        tags: blog.tags || [],
      });
    }
  }, [response]);

  const handleSave = async () => {
    if (!formData.title) {
      toast.error("Vui lòng điền đầy đủ tiêu đề");
      return;
    }

    // Auto-commit any pending tag input before saving
    let finalTags = formData.tags || [];
    const pendingTag = tagInput.trim().replace(/,$/, "");
    if (pendingTag && !finalTags.includes(pendingTag)) {
      finalTags = [...finalTags, pendingTag];
    }

    const payload = { ...formData, tags: finalTags } as CreateBlogPayload;

    if (id) {
      updateBlog(
        { id, data: payload },
        {
          onSuccess: () => {
            toast.success("Cập nhật bài viết thành công");
            navigate("/admin/blogs");
          },
        },
      );
    } else {
      createBlog(payload, {
        onSuccess: () => {
          toast.success("Tạo bài viết thành công");
          navigate("/admin/blogs");
        },
      });
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !formData.tags?.includes(newTag)) {
        setFormData((prev) => ({
          ...prev,
          tags: [...(prev.tags || []), newTag],
        }));
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((tag) => tag !== tagToRemove) || [],
    }));
  };

  const addBlock = (type: Block["type"]) => {
    let blockData: any = {};
    if (type === "header") blockData = { text: "", level: 2 };
    else if (type === "paragraph") blockData = { text: "" };
    else if (type === "file") blockData = { fileKey: "", caption: "" };

    const newBlock: Block = {
      type,
      data: blockData,
    } as Block;

    setFormData((prev) => ({
      ...prev,
      content: {
        ...prev.content!,
        blocks: [...(prev.content?.blocks || []), newBlock],
      },
    }));
  };

  const updateBlock = (index: number, data: any) => {
    const newBlocks = [...(formData.content?.blocks || [])];
    newBlocks[index] = {
      ...newBlocks[index],
      data: { ...newBlocks[index].data, ...data },
    };
    setFormData((prev) => ({
      ...prev,
      content: { ...prev.content!, blocks: newBlocks },
    }));
  };

  const removeBlock = (index: number) => {
    const newBlocks = (formData.content?.blocks || []).filter(
      (_, i) => i !== index,
    );
    setFormData((prev) => ({
      ...prev,
      content: { ...prev.content!, blocks: newBlocks },
    }));
  };

  // const handleThumbnailUpload = async (file: File) => {
  //   try {
  //     const res = await blogService.uploadFile(file);
  //     // Support both 1000 and 0 as success codes
  //     if ((res.code === 1000 || res.code === 0) && res.data) {
  //       // Handle both object-wrapped and string-direct data
  //       const fileKey =
  //         typeof res.data === "string" ? res.data : res.data.fileKey;
  //       const baseUrl =
  //         import.meta.env.VITE_MINIO_URL ||
  //         "https://minio.iesfocus.edu.vn/blog/";
  //       const separator = baseUrl.endsWith("/") ? "" : "/";
  //       const finalUrl = fileKey.startsWith("http")
  //         ? fileKey
  //         : `${baseUrl}${separator}${fileKey}`;

  //       setFormData((prev) => ({
  //         ...prev,
  //         thumbnailUrl: finalUrl,
  //       }));
  //       toast.success("Tải ảnh bìa thành công");
  //     } else {
  //       toast.error(res.message || "Lỗi khi tải ảnh bìa");
  //     }
  //   } catch (error) {
  //     toast.error("Lỗi khi tải ảnh bìa");
  //   }
  // };

  const handleFileUpload = async (index: number, file: File) => {
    try {
      const res = await blogService.uploadFile(file);
      if ((res.code === 1000 || res.code === 0) && res.data) {
        const fileKey =
          typeof res.data === "string" ? res.data : res.data.fileKey;
        updateBlock(index, { fileKey });
        toast.success("Tải ảnh lên thành công");
      } else {
        toast.error(res.message || "Lỗi khi tải ảnh lên");
      }
    } catch (error) {
      toast.error("Lỗi khi tải ảnh lên");
    }
  };

  if (id && isLoading)
    return <div className="p-10 text-center">Đang tải dữ liệu...</div>;

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate("/admin/blogs")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
        >
          <ArrowLeft size={20} />
          <span>Quay lại</span>
        </button>
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={isCreating || isUpdating}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-bold"
          >
            <Save size={18} />
            {id ? "Cập nhật" : "Lưu bài viết"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Side: Editor Form */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <textarea
              placeholder="Tiêu đề bài viết..."
              className="w-full max-w-4xl text-3xl font-bold border-none rounded-md focus:ring-2 focus:outline-none focus:ring-blue-500 placeholder:text-gray-300"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
            />

            {/* Tags Input */}
            <div className="pt-4 border-t border-gray-50 space-y-3">
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wider block">
                Thẻ (Tags):
              </span>
              {formData.tags && formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-100"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-red-500 hover:bg-red-50 p-0.5 rounded transition-colors focus:outline-none flex items-center justify-center ml-1"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <input
                type="text"
                className="w-full max-w-md bg-gray-50 border-none rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Nhập tag và nhấn Enter hoặc dấu phẩy (,)..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
              />
            </div>
          </div>

          {/* Content Blocks */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-2">
              Nội dung bài viết
            </h3>

            {formData.content?.blocks.map((block, index) => (
              <div
                key={index}
                className="group relative bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:border-blue-200 transition-colors"
              >
                <button
                  onClick={() => removeBlock(index)}
                  className="absolute top-4 right-4 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>

                {block.type === "header" && (
                  <div className="flex gap-4 items-start">
                    <select
                      value={(block.data as HeaderBlockData).level}
                      onChange={(e) =>
                        updateBlock(index, { level: parseInt(e.target.value) })
                      }
                      className="mt-1 bg-gray-50 border-none rounded text-xs font-bold p-1 focus:ring-0"
                    >
                      <option value={2}>H2</option>
                      <option value={3}>H3</option>
                      <option value={4}>H4</option>
                    </select>
                    <textarea
                      placeholder="Tiêu đề đoạn..."
                      className="w-full max-w-xl text-xl font-bold border-none rounded-lg focus:ring-2 focus:outline-none focus:ring-blue-500 placeholder:text-gray-300 p-0"
                      value={(block.data as HeaderBlockData).text}
                      onChange={(e) =>
                        updateBlock(index, { text: e.target.value })
                      }
                    />
                  </div>
                )}

                {block.type === "paragraph" && (
                  <textarea
                    placeholder="Viết nội dung ở đây..."
                    className="w-full max-w-xl text-gray-700 leading-relaxed border-none rounded-lg focus:ring-2 focus:outline-none focus:ring-blue-500 placeholder:text-gray-300 p-0 min-h-[300px]"
                    value={(block.data as ParagraphBlockData).text}
                    onChange={(e) =>
                      updateBlock(index, { text: e.target.value })
                    }
                  />
                )}

                {block.type === "file" && (
                  <div className="space-y-4">
                    <div className="flex gap-4 items-center">
                      <div className="w-24 h-24 bg-gray-50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-200 overflow-hidden relative group">
                        {(block.data as FileBlockData).fileKey ? (
                          <img
                            src={
                              (block.data as FileBlockData).fileKey?.startsWith(
                                "http",
                              )
                                ? (block.data as FileBlockData).fileKey
                                : `${import.meta.env.VITE_MINIO_URL || "https://minio.iesfocus.edu.vn/blog/"}${(import.meta.env.VITE_MINIO_URL || "https://minio.iesfocus.edu.vn/blog/").endsWith("/") ? "" : "/"}${(block.data as FileBlockData).fileKey}`
                            }
                            className="w-full h-full object-cover"
                            alt="preview"
                            onError={(e) => {
                              // Fallback if image fails to load
                              (e.target as HTMLImageElement).src =
                                `https://placehold.co/600x400?text=L%E1%BB%97i+t%E1%BA%A3i+%E1%BA%A3nh`;
                            }}
                          />
                        ) : (
                          <ImageIcon className="text-gray-300" size={32} />
                        )}
                        <input
                          type="file"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={(e) =>
                            e.target.files &&
                            handleFileUpload(index, e.target.files[0])
                          }
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <p className="text-xs font-medium text-gray-500 italic">
                          Tải ảnh lên
                        </p>
                        
                      </div>
                    </div>
                    <input
                      type="text"
                      placeholder="Chú thích cho ảnh..."
                      className="w-full text-sm text-gray-500 italic border-none focus:ring-0 p-0"
                      value={(block.data as FileBlockData).caption}
                      onChange={(e) =>
                        updateBlock(index, { caption: e.target.value })
                      }
                    />
                  </div>
                )}
              </div>
            ))}

            {/* Add Block Tool */}
            <div className="flex justify-center gap-4 py-8">
              <button
                onClick={() => addBlock("header")}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition shadow-sm"
              >
                <Heading size={18} />
                <span className="text-sm font-bold">Thêm Tiêu đề</span>
              </button>
              <button
                onClick={() => addBlock("paragraph")}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition shadow-sm"
              >
                <Type size={18} />
                <span className="text-sm font-bold">Thêm Đoạn văn</span>
              </button>
              <button
                onClick={() => addBlock("file")}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition shadow-sm"
              >
                <ImageIcon size={18} />
                <span className="text-sm font-bold">Thêm Ảnh & Video</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Live Preview */}
        <div className="hidden lg:flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 sticky top-6 max-h-[calc(100vh-48px)] overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center shrink-0">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </span>
              Bản xem trước
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-6 leading-tight wrap-break-word">
              {formData.title || "Tiêu đề bài viết..."}
            </h1>

            {formData.tags && formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="w-16 h-1 bg-blue-500 rounded-full mb-8"></div>

            <BlockRenderer content={formData.content as Content} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogFormPage;
