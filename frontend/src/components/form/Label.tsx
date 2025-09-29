type LabelProps = {
  htmlFor: string;
  text: string;
  style?: string;
};
const Label = ({ htmlFor, text, style }: LabelProps) => {
  return (
    <label
      htmlFor={htmlFor}
      className={style ? style : "text-sm text-gray-600 capitalize"}
    >
      {text}
    </label>
  );
};

export default Label;
