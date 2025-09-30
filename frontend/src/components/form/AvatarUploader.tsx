import { useRef, useEffect, useMemo } from "react";

interface AvatarUploaderProps {
  avatar: File | string | undefined; // File for new upload, string for existing backend URL
  setAvatar: (file: File | string | undefined) => void;
}

const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  avatar,
  setAvatar,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0];
    if (file) setAvatar(file);
  };

  // Generate preview URL
  const previewUrl = useMemo(() => {
    if (avatar instanceof File) {
      return URL.createObjectURL(avatar); // preview for new file
    }
    if (typeof avatar === "string") {
      return avatar; // full URL from backend
    }
    return null;
  }, [avatar]);

  // Cleanup object URL for memory
  useEffect(() => {
    return () => {
      if (avatar instanceof File && previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [avatar, previewUrl]);

  return (
    <div
      className="w-24 h-24 md:w-32 md:h-32 object-cover bg-gray-200 rounded-full 
                 flex items-center justify-center text-gray-400 text-sm 
                 font-semibold overflow-hidden cursor-pointer relative"
      onClick={() => fileInputRef.current?.click()}
    >
      {previewUrl ? (
        <img
          src={previewUrl} // full URL or object URL
          alt="avatar"
          className="w-full h-full object-cover"
        />
      ) : (
        "Avatar"
      )}

      <input
        type="file"
        accept="image/*"
        onChange={onFileChange}
        ref={fileInputRef}
        className="hidden"
      />
    </div>
  );
};

export default AvatarUploader;
