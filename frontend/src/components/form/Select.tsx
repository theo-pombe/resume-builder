type SelectProps = {
  name: string;
  value: string;
  disabled?: boolean;
  label?: string;
  style?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactElement<React.OptionHTMLAttributes<HTMLOptionElement>>[];
  required?: boolean;
};

const Select = ({
  name,
  value,
  disabled,
  label,
  style,
  onChange,
  children,
  required = false,
}: SelectProps) => {
  return (
    <select
      onChange={onChange}
      value={value}
      disabled={disabled}
      name={name}
      required={required}
      id={name}
      className={
        style
          ? style
          : "outline-none border border-gray-400 rounded px-2.5 py-2.5 text-sm placeholder:capitalizestyle"
      }
    >
      {label && <option label={label} value=""></option>}
      {children}
    </select>
  );
};

export default Select;
