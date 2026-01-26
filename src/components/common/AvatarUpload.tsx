import { useState, useRef } from "react";
import { FaCamera, FaSpinner } from "react-icons/fa";
import { uploadAvatarApi } from "../../services/authService";
import { toast } from "./Toast";

interface AvatarUploadProps {
  currentImageUrl?: string;
  onUploadSuccess: (newUrl: string) => void;
  size?: number; // size in px, default 100
  altText?: string;
  className?: string; // Add className prop
}

export const AvatarUpload = ({
  currentImageUrl,
  onUploadSuccess,
  size = 100,
  altText = "Avatar",
  className = "",
}: AvatarUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file hình ảnh.");
      return;
    }

    // Limit size (e.g., 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước ảnh không được vượt quá 5MB.");
      return;
    }

    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    try {
      setIsUploading(true);
      const newUrl = await uploadAvatarApi(file);
      onUploadSuccess(newUrl);
      toast.success("Cập nhật ảnh đại diện thành công!");
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật ảnh thất bại. Vui lòng thử lại.");
      // Revert preview on error
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
      // Verify if we need to revoke object URL to avoid memory leaks
      // URL.revokeObjectURL(objectUrl); // Maybe keep it until success or component unmount?
    }
  };

  const triggerFileInput = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  const displayUrl =
    previewUrl ||
    currentImageUrl ||
    `https://ui-avatars.com/api/?name=${altText}&background=random`;

  return (
    <div className={`relative group inline-block ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />

      <div
        className="relative rounded-full overflow-hidden border-4 border-gray-100 cursor-pointer transition-all hover:border-[#0077BE]/30"
        style={{ width: size, height: size }}
        onClick={triggerFileInput}
      >
        <img
          src={displayUrl}
          alt={altText}
          className="w-full h-full object-cover"
        />

        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-200 ${isUploading ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
        >
          {isUploading ? (
            <FaSpinner className="text-white animate-spin text-xl" />
          ) : (
            <FaCamera className="text-white text-xl" />
          )}
        </div>
      </div>

      {/* Edit Button (Optional, if we want it outside) */}
      {/* <button 
                onClick={triggerFileInput}
                className="absolute bottom-0 right-0 bg-white shadow-md p-1.5 rounded-full text-gray-600 hover:text-[#0077BE] border border-gray-200"
                disabled={isUploading}
            >
                <FaCamera className="text-xs" />
            </button> */}
    </div>
  );
};
