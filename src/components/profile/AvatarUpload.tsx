"use client";

import { useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@/lib/fontawesome";

interface AvatarUploadProps {
  currentImage: string | null;
  userName: string;
}

export function AvatarUpload({ currentImage, userName }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const initials = (userName || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const displayImage = preview || currentImage;

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Please use JPEG, PNG, or WebP images.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be under 2MB.");
      return;
    }

    // Show preview
    const url = URL.createObjectURL(file);
    setPreview(url);

    // Upload
    startTransition(async () => {
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await fetch("/api/avatar", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload failed");
        setPreview(null);
      } else {
        setPreview(null);
        router.refresh();
      }
    });
  }

  function handleRemove() {
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/avatar", { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      }
    });
  }

  return (
    <div className="flex flex-col items-center">
      {/* Avatar with camera overlay */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isPending}
        className="group relative mb-2 h-20 w-20 overflow-hidden rounded-full focus:outline-none focus:ring-2 focus:ring-forest focus:ring-offset-2"
      >
        {displayImage ? (
          <Image
            src={displayImage}
            alt={userName || "User avatar"}
            width={80}
            height={80}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-forest text-2xl font-bold text-white">
            {initials}
          </div>
        )}

        {/* Camera overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <FontAwesomeIcon icon={faCamera} className="h-5 w-5 text-white" />
        </div>

        {/* Loading overlay */}
        {isPending && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
          </div>
        )}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      <span className="text-xs text-slate">Click to change photo</span>

      {currentImage && (
        <button
          type="button"
          onClick={handleRemove}
          disabled={isPending}
          className="mt-1 text-xs text-coral hover:underline disabled:opacity-50"
        >
          Remove photo
        </button>
      )}

      {error && (
        <p className="mt-2 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
