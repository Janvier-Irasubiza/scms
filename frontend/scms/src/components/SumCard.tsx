
interface Props {
  title: string,
  count: number | undefined,
  date?: string | undefined
}

const SumCard = ( props: Props ) => {
return (
  <div className="w-full smry-card rounded">
      <p className="m-0">{props.title}</p>
      <h2 className="m-0">{ props.count }</h2>
      <p className="m-0">{ props.date }</p>
  </div>
)
}

export default SumCard