import axios from "axios";
import { useEffect, useState } from "react";

const Acts = () => {

  const [activities, setData] = useState<
    {
      id: number;
      user: {
        id: number;
        names: string;
        cell: number;
      };
      activity: string;
      done_at: string;
    }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = localStorage.getItem("user");
        const response = await axios.get(
          `http://127.0.0.1:8000/api/my-acts/${user}`,
          {
            headers: {
              Authorization: "Token " + localStorage.getItem("token"),
            },
          }
        );
        setData(response.data);
      } catch (error) {
        console.log("Encountered an error fetching activities data:", error);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear().toString();
    return `${day} ${month}, ${year}`;
  };

  return (
    <div>
      {activities ? (
        activities.map((act) => (
          <div className="acts mt-2" key={act.id}>
            <p className="m-0 f-13">{act.activity}</p>
            <div className="mt-2 d-flex justify-content-between">
              <small className="m-0 fw-700 f-11">
                {formatDate(act.done_at)}
              </small>

              {/* {userPrivilege == "sectorial" || userPrivilege == "superuser" ? (
                <small className="m-0 fw-700 f-11">
                  {act.user ? `By: ${act.user.names}` : null}
                </small>
              ) : (
                ""
              )} */}
            </div>
          </div>
        ))
      ) : (
        <div className="acts mt-2">
          <p className="m-0 f-13">You have no activity</p>
        </div>
      )}
    </div>
  );
};

export default Acts;
