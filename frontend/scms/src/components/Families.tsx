import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Props {
  endpoint?: string;
  onDataFetched: (data: Fam[]) => void;
}

interface Fam {
  id: string;
  fathernames: string;
  mothernames: string;
  mariage_status: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
  children: number;
}

interface Props {
  endpoint?: string;
  onDataFetched: (data: Fam[]) => void;
}

const Families: React.FC<Props> = ({ endpoint, onDataFetched }) => {
  const cell = localStorage.getItem("cell");
  const userPrivilege = localStorage.getItem("user_privilege");
  let cellFamiliesUri = "";

  cell && userPrivilege == "cellular"
    ? (cellFamiliesUri = `http://127.0.0.1:8000/api/cell-families/?cell=${encodeURIComponent(
        cell
      )}`)
    : (cellFamiliesUri = `http://127.0.0.1:8000/api/families`);

  const uri =
    endpoint != ""
      ? endpoint || "http://127.0.0.1:8000/api/families"
      : cellFamiliesUri;

  const [famData, setData] = useState<Fam[]>([]);

  useEffect(() => {
    axios
      .get(uri, {
        method: "GET",
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setData(response.data);
        onDataFetched(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  }, [uri, onDataFetched]);

  return (
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
        {famData.map((family) => (
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
  );
};

export default Families;
