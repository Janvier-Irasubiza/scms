

interface Props {
  text: string
  type: "button" | "submit"
  color?: string
  class: string
  onClick?: () => void
  disabled?: boolean
}

const Button = (props: Props) => {
return (
  <button
      type={props.type}
      className={props.class}
      onClick={props.onClick}
  >
      {props.text}
  </button>
)
}

export default Button