import React from "react";
import type {
  Content,
  Block,
  HeaderBlockData,
  ParagraphBlockData,
  FileBlockData,
} from "../../types/blog";

// Utility for conditional classes
const cn = (...classes: (string | undefined | null | boolean)[]) =>
  classes.filter(Boolean).join(" ");

interface Props {
  content: Content;
  className?: string;
}

const MINIO_BASE_URL =
  import.meta.env.VITE_MINIO_URL || "https://minio.iesfocus.edu.vn/blog/";

const BlockRenderer: React.FC<Props> = ({ content, className }) => {
  if (!content || !content.blocks) return null;

  return (
    <div className={cn("blog-content-wrapper space-y-6", className)}>
      {content.blocks.map((block: Block, index: number) => {
        switch (block.type) {
          case "header": {
            const headerData = block.data as HeaderBlockData;
            const level = headerData.level;
            const HeaderTag = `h${level}` as keyof React.JSX.IntrinsicElements;

            const headerClasses =
              (
                {
                  h1: "text-3xl font-bold text-gray-900 mt-8 mb-4",
                  h2: "text-2xl font-bold text-gray-800 mt-6 mb-3",
                  h3: "text-xl font-bold text-gray-800 mt-4 mb-2",
                  h4: "text-lg font-bold text-gray-800 mt-3 mb-1",
                  h5: "text-md font-bold text-gray-800 mt-2 mb-1",
                  h6: "text-sm font-bold text-gray-800 mt-1 mb-1",
                } as Record<string, string>
              )[`h${level}`] || "text-xl font-bold";

            return (
              <HeaderTag key={index} className={headerClasses}>
                {headerData.text}
              </HeaderTag>
            );
          }

          case "paragraph": {
            const paraData = block.data as ParagraphBlockData;
            return (
              <p
                key={index}
                className="text-gray-700 leading-relaxed text-lg"
                dangerouslySetInnerHTML={{ __html: paraData.text }}
              />
            );
          }

          case "file": {
            const fileData = block.data as FileBlockData;
            const imageUrl =
              fileData.url ||
              (fileData.fileKey?.startsWith("http")
                ? fileData.fileKey
                : `${MINIO_BASE_URL}${MINIO_BASE_URL.endsWith("/") ? "" : "/"}${fileData.fileKey}`);

            return (
              <figure key={index} className="blog-image-block my-8">
                <div className="overflow-hidden rounded-xl shadow-md border border-gray-100">
                  <img
                    src={imageUrl}
                    alt={fileData.caption || "Blog image"}
                    loading="lazy"
                    className="w-full h-auto object-cover hover:scale-[1.02] transition-transform duration-500"
                  />
                </div>
                {fileData.caption && (
                  <figcaption className="text-center mt-3 text-sm text-gray-500 italic">
                    {fileData.caption}
                  </figcaption>
                )}
              </figure>
            );
          }

          default:
            console.warn(
              `Block type ${(block as any).type} is not supported yet.`,
            );
            return null;
        }
      })}
    </div>
  );
};

export default BlockRenderer;
