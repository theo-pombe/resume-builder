import { Eye } from "lucide-react";

const FileLink = ({ fileUrl, label }: { fileUrl?: string; label: string }) => {
  if (!fileUrl) {
    return <span className="text-xs italic text-gray-400">Not uploaded</span>;
  }

  return (
    <button
      title={`Preview ${label}`}
      className="flex items-center space-x-2 text-xs underline decoration-dotted"
      onClick={() => window.open(fileUrl, "_blank")}
    >
      <Eye size={14} />
      <span>{label}</span>
    </button>
  );
};

export default FileLink;
