interface Props {
  name: string;
  class: string;
  value?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const Input = (props: Props) => {
  return (
    <input
      type="text"
      name={props.name}
      className={props.class}
      placeholder={props.placeholder}
      onChange={props.onChange}
      required={props.required}
    />
  );
};

export default Input;
