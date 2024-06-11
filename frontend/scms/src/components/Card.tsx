interface Props {
  img: string;
  title: string;
  desc: string;
}

const Card = (props: Props) => {
  const backgroundImage = {
    backgroundImage: `url(${props.img})`,
  };

  return (
    <div className="card cd">
      <div className="img-container" style={backgroundImage}></div>
      <div className="p-2">
        <h5 className="m-0">{props.title}</h5>
        <p className="m-0">{props.desc}</p>
      </div>
    </div>
  );
};

export default Card;
