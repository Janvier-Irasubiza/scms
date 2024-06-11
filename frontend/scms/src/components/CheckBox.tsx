
interface Props {
  name: string,
  value: string,
}

const Input = (props: Props) => {
return (
  <input 
      type="checkbox"
      value={props.value}
      name={props.name}
  />
);
}

export default Input