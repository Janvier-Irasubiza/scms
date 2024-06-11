import Acts from "../../components/Acts";
import SumCard from "../../components/SumCard";
import TextInput from "../../components/TextInput";
import "../../App.css";
import CasesComponent from "../../components/CasesComponent";
import { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [clildStatusCount, setStatusCountData] = useState<{
    in_transit: {
      count: number;
      date: string;
    };
    in_rehab: {
      count: number;
      date: string;
    };
    in_school: {
      count: number;
      date: string;
    };
    in_family: {
      count: number;
      date: string;
    };
  } | null>(null);

  const cell = localStorage.getItem("cell");
  const sector_id = localStorage.getItem("sector_id");
  const userPrivilege = localStorage.getItem("user_privilege");

  let overviewUri =
    cell && userPrivilege == "cellular"
      ? `http://127.0.0.1:8000/api/cell-overview/?cell=${encodeURIComponent(
          cell
        )}`
      : sector_id && userPrivilege == "sectorial"
      ? `http://127.0.0.1:8000/api/overview/?sector=${encodeURIComponent(
          sector_id
        )}`
      : `http://127.0.0.1:8000/api/overview/`;

  let casesUri =
    sector_id && userPrivilege == "sectorial"
      ? `http://127.0.0.1:8000/api/cases/?sector=${encodeURIComponent(
          sector_id
        )}`
      : cell && userPrivilege == "cellular"
      ? `http://127.0.0.1:8000/api/cell-cases/?cell=${encodeURIComponent(cell)}`
      : "http://127.0.0.1:8000/api/cases/";

  useEffect(() => {
    axios
      .get(overviewUri, {
        method: "GET",
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setStatusCountData(response.data);
      })
      .catch(() => {
        console.log("Encountered an error fetching status count data");
      });
  }, []);

  return (
    <>
      <div className="">
        <h5 className="text-muted">Overview</h5>
        <div className="d-flex justify-content-between gap-4">
          <SumCard
            title="In transit centres"
            count={clildStatusCount?.in_transit.count}
            date={clildStatusCount?.in_transit.date}
          />
          <SumCard
            title="In rehabilitation centres"
            count={clildStatusCount?.in_rehab.count}
            date={clildStatusCount?.in_rehab.date}
          />
          <SumCard
            title="In school"
            count={clildStatusCount?.in_school.count}
            date={clildStatusCount?.in_school.date}
          />
          <SumCard
            title="Re-integrated in family"
            count={clildStatusCount?.in_family.count}
            date={clildStatusCount?.in_family.date}
          />
        </div>

        <div className="mt-5">
          <div className="flex-box gap-3">
            <div className="w-full">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="text-muted">Recently reported cases</h5>
                <TextInput
                  name="username"
                  class=""
                  value=""
                  placeholder="Search"
                />
              </div>
              <div className=" border rounded p-2 recents-h scroll">
                <CasesComponent endpoint={casesUri} onDataFetched={() => {}} />
              </div>
            </div>

            <div className="col-lg-3">
              <h5 className="text-muted">Recent activities</h5>
              <div className="border rounded px-2 pb-2 mt-3 recents-h scroll">
                <Acts />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
