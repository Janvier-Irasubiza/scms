
interface Props {
  name: string,
  class: string,
  value?: string,
  placeholder?: string,
  rows?: number
}

const TextArea = (props: Props) => {
return (
  <textarea 
      name={props.name}
      className={props.class}
      rows={props.rows}
      placeholder={props.placeholder}
  >
    </textarea>
);
}

export default TextArea