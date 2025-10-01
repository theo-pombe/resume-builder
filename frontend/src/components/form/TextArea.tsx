const TextArea = ({
  name,
  placeholder,
  required = false,
  disabled,
  value,
  onChange,
}: {
  name: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  value: string;
  style?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) => {
  return (
    <textarea
      name={name}
      placeholder={placeholder}
      value={value}
      disabled={disabled}
      rows={5}
      id={name}
      required={required}
      onChange={onChange}
      className="w-full outline-none border border-gray-400 rounded px-2.5 py-2 "
    />
  );
};

export default TextArea;
