import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Props {
  endpoint?: string;
  onDataFetched: (data: CaseData[]) => void;
}

interface CaseData {
  id: string;
  case_code: string;
  child: {
    id: number;
    first_name: string;
    last_name: string;
    age: number;
  };
  date_of_capture: string;
}

const CasesComponent: React.FC<Props> = ({ endpoint, onDataFetched }) => {
  const [caseData, setData] = useState<CaseData[]>([]);
  const sector_id = localStorage.getItem("sector_id");
  const cell = localStorage.getItem("cell");
  const userPrivilege = localStorage.getItem("user_privilege");

  let casesUri =
    sector_id && userPrivilege == "sectorial"
      ? `http://127.0.0.1:8000/api/cases/?sector=${encodeURIComponent(
          sector_id
        )}`
      : cell && userPrivilege == "cellular"
      ? `http://127.0.0.1:8000/api/cell-cases/?cell=${encodeURIComponent(cell)}`
      : "http://127.0.0.1:8000/api/cases/";

  const uri = endpoint ? endpoint : casesUri;

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
        console.log("Error fetching data", error);
      });
  }, [uri, onDataFetched]);

  return (
    <table className="table">
      <thead>
        <tr>
          <th className="text-muted">Case code</th>
          <th className="text-muted">Child</th>
          <th className="text-muted">Capture date</th>
          <th className="text-muted text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        {caseData.map((caseItem) => (
          <tr key={caseItem.id}>
            <td className="py-4">{caseItem.case_code}</td>
            <td className="py-3">
              <Link
                to={`/admin/child/${caseItem.child.id}`}
                className="m-0 fw-600"
              >
                {caseItem.child.first_name} {caseItem.child.last_name}
              </Link>
              <br />
              <small>age: {caseItem.child.age}</small>
            </td>
            <td className="py-4">{caseItem.date_of_capture}</td>
            <td className="text-center py-4">
              <Link
                to={`/admin/case/${caseItem.id}`}
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

export default CasesComponent;
