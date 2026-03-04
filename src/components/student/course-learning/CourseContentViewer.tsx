import React, { useState, useEffect, useCallback, useRef } from "react";
import { FaCircleNotch } from "react-icons/fa";
import PdfSlideshow from "@/components/common/PdfSlideshow";
import type { LessonItem } from "@/types/learningTypes";
import {
  trackVideoHeartbeat,
  markLessonItemComplete,
} from "@/services/lessonService";

interface CourseContentViewerProps {
  currentItem: LessonItem | null;
  courseThumbnailUrl?: string;
  loadingItem: boolean;
  completedItemIds: Set<string>;
  onItemCompleted: (itemId: string) => void;
}

const CourseContentViewer = ({
  currentItem,
  courseThumbnailUrl,
  loadingItem,
  completedItemIds,
  onItemCompleted,
}: CourseContentViewerProps) => {
  const [markingComplete, setMarkingComplete] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const heartbeatIntervalRef = useRef<number | null>(null);
  const lastValidTimeRef = useRef<number>(0);

  // Handle mark item complete (for TEXT, PDF, PPT)
  const handleMarkComplete = useCallback(async () => {
    if (!currentItem || completedItemIds.has(currentItem.id)) return;

    setMarkingComplete(true);
    try {
      await markLessonItemComplete(currentItem.id);
      onItemCompleted(currentItem.id);
    } catch (error) {
      console.error("Failed to mark item complete:", error);
    } finally {
      setMarkingComplete(false);
    }
  }, [currentItem, completedItemIds, onItemCompleted]);

  // Video heartbeat tracking
  const startVideoHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }

    heartbeatIntervalRef.current = window.setInterval(() => {
      const video = videoRef.current;
      if (video && currentItem && !video.paused) {
        trackVideoHeartbeat({
          lessonItemId: currentItem.id,
          currentSecond: Math.floor(video.currentTime),
          totalDuration: Math.floor(video.duration),
        }).catch((err) => console.error("Heartbeat failed:", err));
      }
    }, 10000); // Every 10 seconds
  }, [currentItem]);

  const stopVideoHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
  }, []);

  // Handle video ended - mark as complete
  const handleVideoEnded = useCallback(async () => {
    stopVideoHeartbeat();
    if (currentItem && !completedItemIds.has(currentItem.id)) {
      try {
        await markLessonItemComplete(currentItem.id);
        onItemCompleted(currentItem.id);
      } catch (error) {
        console.error("Failed to mark video complete:", error);
      }
    }
  }, [currentItem, completedItemIds, stopVideoHeartbeat, onItemCompleted]);

  // Cleanup heartbeat on unmount or item change
  useEffect(() => {
    return () => {
      stopVideoHeartbeat();
    };
  }, [currentItem, stopVideoHeartbeat]);

  // Video handlers
  const handleVideoLoadedMetadata = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      const video = e.currentTarget;
      if (
        currentItem?.type === "VIDEO" &&
        currentItem.content?.lastWatchedSecond
      ) {
        video.currentTime = currentItem.content.lastWatchedSecond;
        lastValidTimeRef.current = currentItem.content.lastWatchedSecond;
      } else {
        lastValidTimeRef.current = 0;
      }
    },
    [currentItem],
  );

  const handleVideoSeeking = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      const video = e.currentTarget;
      // Skip check if item is completed
      if (
        currentItem &&
        (currentItem.completed || completedItemIds.has(currentItem.id))
      )
        return;

      // If user tries to seek forward beyond what they've watched + buffer, reset to last valid position
      if (video.currentTime > lastValidTimeRef.current + 2) {
        video.currentTime = lastValidTimeRef.current;
      }
    },
    [currentItem, completedItemIds],
  );

  const handleVideoTimeUpdate = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      const video = e.currentTarget;
      // Only update lastValidTime if current time is greater (moving forward naturally)
      if (video.currentTime > lastValidTimeRef.current) {
        lastValidTimeRef.current = video.currentTime;
      }
    },
    [],
  );

  if (!currentItem) {
    return (
      <div className="flex items-center justify-center h-64 bg-slate-100 rounded-xl">
        <div className="text-center text-gray-500">
          <span className="material-symbols-outlined text-5xl mb-2">
            play_lesson
          </span>
          <p>Chọn một nội dung từ danh sách bên trái để bắt đầu học</p>
        </div>
      </div>
    );
  }

  if (loadingItem) {
    return (
      <div className="flex items-center justify-center h-64 bg-slate-100 rounded-xl">
        <span className="animate-spin text-3xl text-blue-600">
          <FaCircleNotch />
        </span>
      </div>
    );
  }

  const content = currentItem.content;
  const isCompleted =
    currentItem.completed || completedItemIds.has(currentItem.id);

  if (currentItem.type === "VIDEO" && content?.resourceUrl) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl overflow-hidden bg-black relative">
          <video
            ref={videoRef}
            src={content.resourceUrl}
            controls
            controlsList="nodownload"
            className="w-full aspect-video"
            poster={courseThumbnailUrl}
            onPlay={startVideoHeartbeat}
            onPause={stopVideoHeartbeat}
            onEnded={handleVideoEnded}
            onSeeking={handleVideoSeeking}
            onTimeUpdate={handleVideoTimeUpdate}
            onLoadedMetadata={handleVideoLoadedMetadata}
          />
          {isCompleted && (
            <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-green-500/90 text-white rounded-full text-sm font-medium">
              <span className="material-symbols-outlined text-sm">check</span>
              Đã xem
            </div>
          )}
        </div>
        {!isCompleted && (
          <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 text-amber-700 rounded-lg text-sm">
            <span className="material-symbols-outlined text-lg">info</span>
            <span>
              Xem video đến hết để hoàn thành bài học. Video không thể tua
              nhanh.
            </span>
          </div>
        )}
      </div>
    );
  }

  if (
    (currentItem.type === "PDF" || currentItem.type === "PPT") &&
    content?.resourceUrl
  ) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl overflow-hidden border border-slate-200">
          <PdfSlideshow fileUrl={content.resourceUrl} />
        </div>
        {!isCompleted && (
          <button
            onClick={handleMarkComplete}
            disabled={markingComplete}
            className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            {markingComplete ? (
              <>
                <span className="animate-spin text-lg">
                  <FaCircleNotch />
                </span>
                Đang xử lý...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-lg">
                  check_circle
                </span>
                Đánh dấu đã học xong
              </>
            )}
          </button>
        )}
        {isCompleted && (
          <div className="flex items-center justify-center gap-2 py-3 bg-green-100 text-green-700 rounded-lg font-medium">
            <span className="material-symbols-outlined text-lg">check</span>
            Đã hoàn thành
          </div>
        )}
      </div>
    );
  }

  if (currentItem.type === "TEXT") {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="prose prose-sm max-w-none">
            {content?.textContent || "Không có nội dung văn bản"}
          </div>
        </div>
        {!isCompleted && (
          <button
            onClick={handleMarkComplete}
            disabled={markingComplete}
            className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            {markingComplete ? (
              <>
                <span className="animate-spin text-lg">
                  <FaCircleNotch />
                </span>
                Đang xử lý...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-lg">
                  check_circle
                </span>
                Đánh dấu đã học xong
              </>
            )}
          </button>
        )}
        {isCompleted && (
          <div className="flex items-center justify-center gap-2 py-3 bg-green-100 text-green-700 rounded-lg font-medium">
            <span className="material-symbols-outlined text-lg">check</span>
            Đã hoàn thành
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-64 bg-slate-100 rounded-xl">
      <div className="text-center text-gray-500">
        <span className="material-symbols-outlined text-5xl mb-2">
          description
        </span>
        <p>Không thể hiển thị nội dung này</p>
      </div>
    </div>
  );
};

export default CourseContentViewer;
