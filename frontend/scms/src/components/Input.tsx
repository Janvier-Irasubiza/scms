
interface Props {
  name: string,
  type: string,
  class: string,
  value: string,
  placeholder?: string
}

const Input = (props: Props) => {
return (
  <input 
      type={props.type}
      name={props.name}
      className={props.class}
      placeholder={props.placeholder}
  />
);
}

export default Input