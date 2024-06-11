interface Props {
  name: string;
  class: string;
  value: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: string;
}

const Input = (props: Props) => {
  return (
    <input
      type="password"
      name={props.name}
      className={props.class}
      placeholder={props.placeholder}
      onChange={props.onChange}
    />
  );
};

export default Input;
