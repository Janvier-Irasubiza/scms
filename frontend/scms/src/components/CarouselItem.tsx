
interface Props {
  img: string
  title: string
  desc: string
}

const CarouselItem = (props: Props) => {

  const backgroundImage = {
    backgroundImage: `url(${props.img})`
  };
  
  return (    
    <div className="border rounded carouselitem p-rel" style={backgroundImage}>
    <div className="w-full flex flex-col">
        <div className="flex-grow">           
            <div className="item-content p-abs b-0 w-full px-3 pt-3 pb-4">
              <h3 className="m-0 bg-ghw">{props.title}</h3>
              <p className="m-0 bg-ghw">{props.desc}</p>        
            </div>
        </div>
    </div>
</div>
  )
}

export default CarouselItem