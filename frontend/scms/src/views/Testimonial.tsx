import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Nav from "../components/Nav";

interface Props {
  poster: string;
  video: string;
  title: string;
  description: string;
}

const Testimonial = () => {
  const { testimonial } = useParams();
  const [data, setData] = useState<Props | null>(null);

  useEffect(() => {
    if (testimonial) {
      axios
        .get(`http://127.0.0.1:8000/api/slag-testimonial/${encodeURIComponent(testimonial)}`)
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [testimonial]);

  return (
    <div>
      {data ? (
        <>
          <Nav />

          <div className="w-full pdg-ntb flex-wrap">
            <h3>{data.title}</h3>
            {data.video ? (
              <video src={data.video} />
            ) : (
              <div style={{ backgroundImage: `url(${data.poster})` }}></div>
            )}
            <div className="mt-4">{data.description}</div>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Testimonial;
