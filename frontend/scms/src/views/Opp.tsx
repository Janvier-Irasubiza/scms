import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Nav from "../components/Nav";

interface Props {
  poster: string;
  title: string;
  description: string;
}

const Opp = () => {
  const { opp } = useParams();
  const [data, setData] = useState<Props | null>(null);

  useEffect(() => {
    if (opp) {
      axios
        .get(`http://127.0.0.1:8000/api/slag-opp/${encodeURIComponent(opp)}`)
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [opp]);

  useEffect(() => {
    console.log(data?.poster);
  }, [data]);

  return (
    <div>
      {data ? (
        <>
          <Nav />

          <div className="w-full pdg-ntb flex-wrap">
            <h3>{data.title}</h3>
            <div
              style={{
                backgroundImage: `url(${data.poster})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                width: "100%",
                height: "300px",
              }}
            ></div>
            <div className="mt-4">{data.description}</div>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Opp;
