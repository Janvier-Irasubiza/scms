import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const Opportunities = () => {
  const [opps, SetData] = useState<
    {
      id: number;
      title: string;
      description: string;
      poster: string;
    }[]
  >([]);

  const fetchData = async () => {
    axios
      .get("http://127.0.0.1:8000/api/admin-opps/", {
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        SetData(response.data);
      })
      .catch((error) => {
        console.log("Failed to fetch data", error);
      });
  }

  useEffect(() => {
    fetchData();
  }, []);

  const deleteOpp = async (testimony: number) => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/opp/${testimony}`
      );
      if (response.status == 204) {
        fetchData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <h4 className="text-muted">Posting</h4>

      <div className="mt-3 border rounded p-3">
        <div>
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="text-muted">Opportunities</h6>
            <Link to="add-opportunity" className="secondary-btn px-3 py-1 f-15">
              Add Opportunity
            </Link>
          </div>
          <table className="table mt-2">
            <thead>
              <tr>
                <th className="text-muted">Title</th>
                <th className="text-muted">Description</th>
                <th className="text-muted text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {opps.map((opp) => (
                <tr>
                  <td>
                    <div className="d-flex gap-2">
                      <div className="tst-poster">
                        <img src={opp.poster} alt="" />
                      </div>
                      <span>{opp.title}</span>
                    </div>
                  </td>
                  <td>{opp.description}</td>
                  <td className="text-right">
                    <Link
                      to={opp.id.toString()}
                      className="secondary-btn f-13 px-3 py-1"
                    >
                      Review
                    </Link>
                    &nbsp;
                    <button onClick={() => deleteOpp(opp.id)} className="danger-btn f-13 px-3 py-1">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Opportunities;
