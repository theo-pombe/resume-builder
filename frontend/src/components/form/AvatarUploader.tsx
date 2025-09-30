import { useRef } from "react";

interface AvatarUploaderProps {
  avatar: File | string | undefined;
  setAvatar: (file: File | string | undefined) => void;
  existingUrl?: string; // backend avatar path
}

const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  avatar,
  setAvatar,
  existingUrl,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0];
    if (file) setAvatar(file);
  };

  const getPreviewUrl = () => {
    if (avatar instanceof File) {
      return URL.createObjectURL(avatar);
    }
    if (typeof avatar === "string") {
      return `${import.meta.env.VITE_API_BASE_URL?.replace(
        "/api/v0/admin",
        ""
      )}/uploads/${avatar}`;
    }
    if (existingUrl) {
      return `${import.meta.env.VITE_API_BASE_URL?.replace(
        "/api/v0/admin",
        ""
      )}/uploads/${existingUrl}`;
    }
    return null;
  };

  return (
    <div
      className="w-24 h-24 md:w-32 md:h-32 object-cover bg-gray-200 rounded-full 
                 flex items-center justify-center text-gray-400 text-sm 
                 font-semibold overflow-hidden cursor-pointer relative"
      onClick={() => fileInputRef.current?.click()}
    >
      {getPreviewUrl() ? (
        <img
          src={getPreviewUrl() || ""}
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
