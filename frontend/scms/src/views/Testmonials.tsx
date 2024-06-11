import "../App.css";
import Card from "../components/Card";
import CarouselItem from "../components/CarouselItem";
import Carousel from "../components/Carousel";
import Nav from "../components/Nav";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

interface Testimonial {
  id: number;
  title: string;
  slag: string;
  description: string;
  poster: string;
}

const Testmonials = () => {

  const [data, setData] = useState<Testimonial[]>([]);
  const [carouselData, setCarouselData] = useState<Testimonial[]>([]);

  const fetchOpps = async () => {
    await axios
      .get("http://127.0.0.1:8000/api/testimonials/")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  };

  const fetchCarouselData = async () => {
    await axios
      .get("http://127.0.0.1:8000/api/car-test/")
      .then((response) => {
        setCarouselData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  };

  useEffect(() => {
    fetchOpps();
    fetchCarouselData();
  }, []);

  return (
    <>
      <Nav />
      <div className="pdg-ntb pb-1">
        <h4>Testimonials</h4>
      </div>

      <div className="w-full flex-box gap-3 pdg-ntb flex-wrap">
        <Carousel>
          {carouselData.map((item) => (
            <Link to={`/testimonials/${item.slag}`} key={item.id}>
              <CarouselItem
                img={item.poster}
                title={item.title}
                desc={item.description}
              />
            </Link>
          ))}
        </Carousel>

        {data.map((opp) => (
          <Link key={opp.id} to={``} className="a-card">
            <Card img={opp.poster} title={opp.title} desc={opp.description} />
          </Link>
        ))}
      </div>
    </>
  );
};

export default Testmonials;
