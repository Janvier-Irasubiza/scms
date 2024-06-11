import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Props {
  endpoint?: string;
  onDataFetched: (data: childrenData[]) => void;
}

interface childrenData {
  id: number;
  firstname: string;
  lastname: string;
  identity: string;
  gender: string;
  age: number;
  family: {
    fathernames: string;
    mothernames: string;
    mariage_status: string;
  };
  cases: number;
  created_at: string;
  update_at: string;
  status: string;
  behavior: string;
  profile_picture: string;
}

const ChildrenComponent: React.FC<Props> = ({ endpoint, onDataFetched }) => {
  const sector_id = localStorage.getItem("sector_id");
  const cell = localStorage.getItem("cell");
  const userPrivilege = localStorage.getItem("user_privilege");

  let cellChildrenUri =
    sector_id && userPrivilege == "sectorial"
      ? `http://127.0.0.1:8000/api/sector-children/?sector=${encodeURIComponent(
          sector_id
        )}`
      : cell && userPrivilege == "cellular"
      ? `http://127.0.0.1:8000/api/cap-cell-children/?cell=${encodeURIComponent(
          cell
        )}`
      : `http://127.0.0.1:8000/api/children`;

  const uri = endpoint ? endpoint : cellChildrenUri;    

  const [childrenData, setChildrenData] = useState<childrenData[]>([]);

  useEffect(() => {
    axios
      .get(uri, {
        method: "GET",
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setChildrenData(response.data);
        onDataFetched(response.data);
      })
      .catch((error) => {
        console.log("Error fetching data", error);
      });
  }, [uri, onDataFetched]);

  return (
    <table className="table">
      <thead>
        <th className="text-muted">Child info</th>
        <th className="text-muted">Identity</th>
        <th className="text-muted">Family</th>
        <th className="text-muted">Cases</th>
        <th className="text-muted text-center">Action</th>
      </thead>
      <tbody>
        {childrenData.map((child) => (
          <tr key={child.id}>
            <td className="py-3">
              <p className="m-0">
                {child.firstname} {child.lastname}
              </p>
              
              <small>status: {child.status}</small> <br/>
              <small>age: {child.age}</small>
            </td>
            <td className="py-3">
              <p className="m-0">{child.identity}</p>
            </td>
            <td className="py-3">
              <p className="m-0">
                <small>Father:</small> {child.family.fathernames}
              </p>
              <p className="m-0">
                <small>Mother:</small> {child.family.mothernames}
              </p>
              <p className="mt-1">
                <small>Marriage status:</small>{" "}
                <small>{child.family.mariage_status}</small>
              </p>
            </td>
            <td>{child.cases}</td>
            <td className="text-center py-4">
              <Link
                to={`/admin/child/${child.id}`}
                className="py-1 px-3 secondary-btn"
              >
                Review
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ChildrenComponent;
