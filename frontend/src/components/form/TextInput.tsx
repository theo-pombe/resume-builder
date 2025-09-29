type TextInputProps = {
  type?: string;
  name: string;
  disabled?: boolean;
  placeholder?: string;
  value: string;
  style?: string;
  min?: any;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const TextInput = ({
  type = "text",
  name,
  placeholder = "",
  value,
  disabled,
  style,
  min,
  required,
  onChange,
}: TextInputProps) => {
  return (
    <input
      className={
        style
          ? style
          : "outline-none border border-gray-400 rounded px-2.5 py-2 text-sm placeholder:capitalizestyle"
      }
      autoComplete="true"
      type={type}
      name={name}
      disabled={disabled}
      placeholder={placeholder}
      id={name}
      value={value}
      min={min}
      required={required}
      onChange={onChange}
    />
  );
};

export default TextInput;
