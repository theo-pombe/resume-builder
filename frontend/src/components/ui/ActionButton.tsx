const ActionButton = ({
  text,
  disabled,
  theme,
  icon,
}: {
  text: string;
  disabled?: boolean;
  theme: string;
  icon: React.ReactNode;
}) => {
  return (
    <div className="mt-5 flex justify-end">
      <button
        type="submit"
        disabled={disabled}
        className={`flex items-center ${
          text.toLowerCase() == "add" && "flex-row-reverse"
        } font-medium ${theme} text-gray-200 text-nowrap cursor-pointer px-3.5 py-1.5 gap-x-2 rounded-e`}
      >
        <span className="capitalize">{text}</span>
        {icon}
      </button>
    </div>
  );
};

export default ActionButton;
