import { Link, useParams } from "react-router-dom";
import Acts from "../../components/Acts";
import SumCard from "../../components/SumCard";
import TextInput from "../../components/TextInput";
import { useEffect, useState } from "react";
import axios from "axios";

function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const CellDashboard = () => {
  const { cell } = useParams();  
  const capitalCell = cell? capitalizeFirstLetter(cell): '';

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

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/cell-overview/?cell=${capitalCell}`, {
        method: "GET",
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setStatusCountData(response.data);
        console.log("Here is the cell data: " + clildStatusCount);
        
      })
      .catch(() => {
        console.log("Encountered an error fetching status count data");
      });
  }, []);

  const [ casesData, setCasesData ] = useState<
    {
      id: string;
      case_code: string;
      child: {
        id: number;
        first_name: string;
        last_name: string;
        age: number;
      };
      age: number;
      date_of_capture: string;
    }[]
  >([])

  const [ familiesData, setFamiliesData ] = useState<
    {
      id: number;
      sector: string; 
      cell: string;
      fathernames: string;
      mothernames: string;
      mariage_status: string;
      district: string;
      village: string;
      children: number;
    }[]
  >([]);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/cell-cases/?cell=${capitalCell}`, {
      method: "GET",
      headers: {
        Authorization: "Token " + localStorage.getItem('token')
      }
    })
    .then((response) => {
      setCasesData(response.data);
    })
    .catch((error) => {
      console.log("Error fetching cases data", error);
    });
  }, [capitalCell]);  

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/cell-critical-families/?cell=${capitalCell}`, {
      method: "GET",
      headers: {
        Authorization: "Token " + localStorage.getItem('token')
      }
    })
    .then((response) => {
      setFamiliesData(response.data);
    })
    .catch((error) => {
      console.log("Error fetching families data", error);
    });
  }, [capitalCell]);  

  return (
    <>
      <div className="">
        <h5 className="text-muted">{capitalCell} cell</h5>
        <div className="mt-4">
          <h6 className="text-muted">Overview</h6>
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

          <div className="mt-5 flex-box gap-3">
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
              <table className="table">
                <thead>
                  <th className="text-muted">Case code</th>
                  <th className="text-muted">Convict</th>
                  <th className="text-muted">Capture date</th>
                  <th className="text-muted text-center">Action</th>
                </thead>
                <tbody>
                  {casesData.map((caseItem) => (
                    <tr key={caseItem.id}>
                      <td className="py-4">{caseItem.case_code}</td>
                      <td className="py-3">
                        <Link to={`/admin/child/${caseItem.child.id}`} className="m-0 fw-600">
                          {caseItem.child.first_name} {caseItem.child.last_name}
                        </Link> <br />
                        <small>age: {caseItem.child.age}</small>
                      </td>
                      <td className="py-4">{caseItem.date_of_capture}</td>
                      <td className="text-center py-4">
                        <Link to={`/admin/case/${caseItem.child.id}/${caseItem.id}`} className="py-1 px-3 secondary-btn">
                          Review
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              </div>
            </div>

            <div className="col-lg-3">
              <h5 className="text-muted">Recent activies</h5>
              <div className="border rounded px-2 pb-2 mt-3 recents-h scroll">
                <Acts />
              </div>
            </div>
          </div>

          <div className="mt-5">
            <h5 className="text-muted">Critical Families</h5>
            <table className="table">
              <thead>
                <tr>
                  <th className="text-muted">Parent(s) names</th>
                  <th className="text-muted">Mariage status</th>
                  <th className="text-muted">Residence address</th>
                  <th className="text-muted">Children</th>
                  <th className="text-muted text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {familiesData.map((family) => (
                  <tr key={family.id} className="danger">
                    <td className="py-3">
                      <p className="m-0">
                        <small className="text-muted">father: </small>
                        {family.fathernames}
                      </p>
                      <p className="m-0">
                        <small className="text-muted">mother: </small>
                        {family.mothernames}
                      </p>
                    </td>
                    <td className="py-4">{family.mariage_status}</td>
                    <td className="py-3">
                      <p className="m-0">
                        <small className="text-muted">cell: </small>
                        {family.cell}
                      </p>
                      <p className="m-0">
                        <small className="text-muted">village: </small>
                        {family.village}
                      </p>
                    </td>
                    <td>{family.children}</td>
                    <td className="text-center py-4">
                      <Link
                        to={`/admin/family/${family.id}`}
                        className="py-1 px-3 secondary-btn"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        </div>
      </div>
    </>
  );
};

export default CellDashboard;
