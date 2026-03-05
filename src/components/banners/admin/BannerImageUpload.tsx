import React, { useState, useRef } from "react";
import { UploadCloud, X, Image as ImageIcon } from "lucide-react";

interface BannerImageUploadProps {
  label: string;
  description?: string;
  onFileSelect: (file: File | null) => void;
  existingImageUrl?: string;
  recommendedSize?: string;
  required?: boolean;
}

export const BannerImageUpload: React.FC<BannerImageUploadProps> = ({
  label,
  description,
  onFileSelect,
  existingImageUrl,
  recommendedSize,
  required = false,
}) => {
  const [preview, setPreview] = useState<string | null>(
    existingImageUrl || null,
  );
  const [isHovering, setIsHovering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    validateAndSelectFile(file);
  };

  const validateAndSelectFile = (file?: File) => {
    if (!file) {
      if (existingImageUrl) {
        setPreview(existingImageUrl);
      } else {
        setPreview(null);
      }
      onFileSelect(null);
      setError(null);
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Chỉ chấp nhận JPG, PNG, WEBP, GIF");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Kích thước file tối đa 5MB");
      return;
    }

    setError(null);
    onFileSelect(file);

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsHovering(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsHovering(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsHovering(false);
    const file = e.dataTransfer.files?.[0];
    validateAndSelectFile(file);
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onFileSelect(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {description && (
        <p className="text-xs text-gray-500 mb-2">{description}</p>
      )}

      {recommendedSize && (
        <p className="text-xs text-gray-400 mb-3 flex items-center gap-1">
          <ImageIcon size={12} />
          Kích thước khuyên dùng: {recommendedSize}
        </p>
      )}

      <div
        className={`relative w-full h-48 border-2 border-dashed rounded-xl overflow-hidden transition-all flex flex-col items-center justify-center cursor-pointer ${
          isHovering
            ? "border-blue-500 bg-blue-50/50"
            : error
              ? "border-red-300 bg-red-50/20"
              : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept={ALLOWED_TYPES.join(",")}
          onChange={handleFileChange}
        />

        {preview ? (
          <div className="absolute inset-0 w-full h-full group">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-contain bg-gray-50"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                onClick={clearImage}
                title="Xóa ảnh"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center p-6 flex flex-col items-center">
            <UploadCloud
              className={`mb-3 ${error ? "text-red-400" : "text-gray-400"}`}
              size={32}
            />
            <p className="text-sm text-gray-600 font-medium">
              Kéo thả ảnh hoặc{" "}
              <span className="text-blue-600 hover:underline">
                nhấn để tải lên
              </span>
            </p>
            <p className="text-xs text-gray-400 mt-2">
              JPG, PNG, GIF, WEBP tới 5MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1">
          <X size={14} />
          {error}
        </p>
      )}
    </div>
  );
};
