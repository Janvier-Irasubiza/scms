import { useEffect, useState } from "react";
import "../App.css";
import Nav from "../components/Nav";
import axios from "axios";
import PieChart from "../components/PieChart";

const Statistics = () => {
  const [data, setData] = useState<{
    in_transit: {
      count: number;
    };
    in_rehab: {
      count: number;
    };
    in_school: {
      count: number;
    };
    in_family: {
      count: number;
    };
  } | null>(null);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/statistics/`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <Nav />
      <div className="flex-box pdg-ntb justify-content-center align-items-center gap-5 min-vh">
        <div className="border w-full">
          {data && (
            <PieChart
              inRehab={data.in_rehab.count}
              inTransit={data.in_transit.count}
              inSchools={data.in_school.count}
              inFamilies={data.in_family.count}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Statistics;
