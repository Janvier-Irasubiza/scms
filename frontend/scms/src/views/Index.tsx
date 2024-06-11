import "../App.css";
import Card from "../components/Card";
import CarouselItem from "../components/CarouselItem";
import Carousel from "../components/Carousel";
import Nav from "../components/Nav";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

interface Opp {
  id: number;
  title: string;
  slag: string;
  description: string;
  poster: string;
}

const Index = () => {
  const [data, setData] = useState<Opp[]>([]);
  const [carouselData, setCarouselData] = useState<Opp[]>([]);

  const fetchOpps = async () => {
    await axios
      .get("http://127.0.0.1:8000/api/opps/")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  };

  const fetchCarouselData = async () => {
    await axios
      .get("http://127.0.0.1:8000/api/car-opps/")
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
        <h4>Children Opportunities</h4>
      </div>
      <div className="w-full flex-box gap-3 pdg-ntb flex-wrap">
        <Carousel>
          {carouselData.map((item) => (
            <Link to={`/opps/${item.slag}`} key={item.id}>
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

export default Index;
