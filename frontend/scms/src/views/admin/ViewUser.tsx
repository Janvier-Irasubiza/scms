import { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface UserInfoProps {
  id: number;
  user_uuid: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  username: string;
  identity: number;
  gender: string;
  age: number;
  office_sector: {
    id: number;
    sector: string;
  };
  office_cell: {
    id: number;
    cell: string;
  };
  responsability: string;
  residential_address: string;
}

interface Cell {
  id: number;
  cellname: string;
  sector: number;
}

const ViewUser = () => {
  const { user } = useParams();
  const [userInfo, setUserInfo] = useState<UserInfoProps | null>(null);
  const [hasChange, setHasChange] = useState(false);
  const [cellData, setCellData] = useState<Cell[]>([]);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [usernameMsg, setUsernameMsg] = useState("");
  const [emailMsg, setEmailMsg] = useState("");

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
    if (user) {
      axios
        .get(`http://127.0.0.1:8000/api/user-uuid/${encodeURIComponent(user)}`)
        .then((response) => {
          setUserInfo(response.data);
        });
    }
  }, [user]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/cells/", {
        method: "GET",
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setCellData(response.data);
      })
      .catch(() => {
        console.log("Error fetching cells");
      });
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserInfo((prevUserInfo: UserInfoProps | null) => {
      if (prevUserInfo) {
        return {
          ...prevUserInfo,
          [name]: value,
        };
      }
      return null;
    });
    setHasChange(true);
  };

  const updateUser = async () => {
    if (userInfo?.user_uuid) {
      try {
        const updatedUserInfo = { ...userInfo };
        const { office_sector, office_cell, ...rest } = updatedUserInfo;

        const officeSectorId = office_sector?.id;
        const officeCellId = office_cell?.id;

        const requestData = {
          ...rest,
          office_sector: officeSectorId,
          office_cell: officeCellId,
        };

        const response = await axios.put(
          `http://127.0.0.1:8000/api/user-uuid/${encodeURIComponent(
            userInfo?.user_uuid
          )}/`,
          requestData,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.status === 200 || response.status === 201) {
          setMessage("Successfully updated user info");
          setHasChange(false);
        }
      } catch (error: any) {
        if (error.response) {
          const response = error.response;
          console.log(response);
          if (response.status === 400) {
            response.data.email
              ? setEmailMsg(response.data.email)
              : setEmailMsg("");
            response.data.username
              ? setUsernameMsg(response.data.email)
              : setUsernameMsg("");
          } else {
            setErrorMsg("Something went wrong, try again");
          }
        }
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userInfo?.id) {
          const response = await axios.get(
            `http://127.0.0.1:8000/api/my-acts/${encodeURIComponent(
              userInfo?.id
            )}`,
            {
              headers: {
                Authorization: "Token " + localStorage.getItem("token"),
              },
            }
          );
          setData(response.data);
        }
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
    <div className="">
      <h5 className="text-muted fw-700">User Info</h5>

      <div className="d-flex gap-3">
        <div className="p-3 border rounded w-full">
          <div className="">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateUser();
              }}
              method="post"
              className=""
            >
              <div>
                <h6 className="text-muted fw-700">User Information</h6>
                <div className="d-flex gap-3 mt-3">
                  <div className="w-full">
                    <label htmlFor="">First name</label>
                    <input
                      type="text"
                      name="first_name"
                      className="w-full"
                      value={userInfo?.first_name}
                      placeholder="Enter Names"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="w-full">
                    <label htmlFor="">Last name</label>
                    <input
                      type="text"
                      name="last_name"
                      className="w-full"
                      value={userInfo?.last_name}
                      placeholder="Enter Names"
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="d-flex gap-3 mt-3">
                  <div className="w-full">
                    <label htmlFor="" className="">
                      Email
                    </label>
                    <input
                      type="text"
                      name="email"
                      className="w-full"
                      value={userInfo?.email}
                      placeholder="Enter email"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="w-full">
                    <label htmlFor="">Phone number</label>
                    <input
                      type="text"
                      name="phone"
                      className="w-full"
                      value={userInfo?.phone}
                      placeholder="Enter phone number"
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {emailMsg && (
                  <div className="mt-1 text-red-500 f-14 text-danger">
                    {emailMsg}
                  </div>
                )}

                <div className="w-full mt-3">
                  <label htmlFor="">Username</label>
                  <input
                    type="text"
                    name="username"
                    className="w-full"
                    value={userInfo?.username}
                    placeholder="Enter username"
                    onChange={handleChange}
                    required
                  />
                </div>

                {usernameMsg && (
                  <div className="mt-1 text-red-500 f-14 text-danger">
                    {usernameMsg}
                  </div>
                )}

                <div className="w-full mt-3">
                  <label htmlFor="">ID</label>
                  <input
                    type="text"
                    name="identity"
                    className="w-full"
                    value={userInfo?.identity}
                    placeholder="Enter ID number"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="d-flex gap-3 mt-3">
                  <div className="w-full">
                    <label htmlFor="" className="">
                      Gender
                    </label>
                    <select
                      name="gender"
                      id=""
                      className="w-full"
                      value={userInfo?.gender}
                      onChange={handleChange}
                      required
                    >
                      <option value="">------------</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>

                  <div className="w-full">
                    <label htmlFor="">Age</label>
                    <input
                      type="text"
                      name="age"
                      className="w-full"
                      value={userInfo?.age}
                      placeholder="Enter age"
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <input
                  type="text"
                  name="office_sector"
                  className="w-full mt-3"
                  value={userInfo?.office_sector.id}
                  hidden
                  readOnly
                />

                <div className="d-flex gap-3 mt-3">
                  <div className="w-full">
                    <label htmlFor="">Cell</label>
                    <select
                      name="office_cell"
                      id=""
                      className="w-full"
                      value={userInfo?.office_cell.id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">------------</option>
                      {cellData.map((cell) => (
                        <option key={cell.id} value={cell.id}>
                          {cell.cellname}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-full">
                    <label htmlFor="">Responsibility</label>
                    <input
                      type="text"
                      name="responsability"
                      className="w-full"
                      value={userInfo?.responsability}
                      placeholder="Enter user post"
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="w-full mt-3">
                  <label htmlFor="">Residential address</label>
                  <input
                    type="text"
                    name="residential_address"
                    className="w-full"
                    value={userInfo?.residential_address}
                    placeholder="Enter residential address"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {message && (
                <div className="alert alert-primary mt-3 p-2" role="alert">
                  <p className="m-0 text-muted f-14">{message}</p>
                </div>
              )}

              {errorMsg && (
                <div className="alert alert-danger mt-3 p-2" role="alert">
                  <p className="m-0 text-muted f-14">{errorMsg}</p>
                </div>
              )}

              <div className="w-full d-flex justify-content-start mt-4">
                <button
                  type={"submit"}
                  color={""}
                  disabled={!hasChange}
                  className={`g-btn ${
                    hasChange ? "primary-btn" : "muted-btn"
                  } `}
                >
                  SAVE CHANGES
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="p-3 border rounded col-md-4">
          <h6 className="text-muted fw-700">Activities</h6>
          <div className="flex-box flex-wrap gap-3 mt-2">
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
        </div>
      </div>
    </div>
  );
};

export default ViewUser;
