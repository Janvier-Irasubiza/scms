import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const Testmonials = () => {
  const [testimonies, setData] = useState<
    {
      id: number;
      title: string;
      description: string;
      speaker: string;
      poster: string;
    }[]
  >([]);

  const fetchData = async () => {
    axios
      .get("http://127.0.0.1:8000/api/admin-testimonials/", {
        method: "GET",
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log("Error fetching data", error);
      });
  }

  useEffect(() => {
    fetchData();
  }, []);

  const deleteTestimony = async (testimony: number) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:8000/api/testimony/${testimony}`);
      if(response.status == 204) {
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
            <h6 className="text-muted">Testimonials</h6>
            <Link to="add-testmony" className="secondary-btn px-3 py-1 f-15">
              Add Testimony
            </Link>
          </div>
          <table className="table mt-2">
            <thead>
              <tr>
                <th className="text-muted">Title</th>
                <th className="text-muted">Description</th>
                <th className="text-muted">Speaker</th>
                <th className="text-muted text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {testimonies.map((testimony) => (
                <tr key={testimony.id}>
                  <td>
                    <div className="d-flex gap-2">
                      <div className="tst-poster">
                        <img src={testimony.poster} alt="" />
                      </div>
                      <span>{testimony.title}</span>
                    </div>
                  </td>
                  <td>{testimony.description}</td>
                  <td>{testimony.speaker}</td>
                  <td className="text-right">
                    <Link
                      to={testimony.id.toString()}
                      className="secondary-btn f-13 px-3 py-1"
                    >
                      Review
                    </Link>
                    &nbsp;
                    <button onClick={() => deleteTestimony(testimony.id)} className="danger-btn f-13 px-3 py-1">
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

export default Testmonials;
