import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Button from "../../components/Button";

interface ChildInfo {
  id: number;
  firstname: string;
  lastname: string;
  identity: string;
  gender: string;
  age: number;
  created_at: string;
  update_at: string;
  status: string;
  behavior: string;
  behavior_desc: string;
  family: {
    id: number;
    fathernames: string;
    mothernames: string;
    district: string;
    sector: string;
    cell: string;
    village: string;
    mariage_status: string;
  };
  profile_picture: string;
}

interface ChildHistory {
  id: number;
  case_code: string;
  reason_of_capture: string;
  date_of_capture: string;
}

const ReviewChild = () => {
  const { child } = useParams();
  const [showForm, setShowForm] = useState(false);
  const [childInfo, setChildInfo] = useState<ChildInfo | null>(null);
  const [childHistoryInfo, setChildHistory] = useState<ChildHistory[]>([]);
  const [fileName, setFileName] = useState("Select file");
  const [hasChanges, setHasChanges] = useState(false);
  const [hasFile, setHasFile] = useState(false);
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [statusMessage, setStatusMessage] = useState<string | undefined>(
    undefined
  );
  const [hasStatus, setHasStatus] = useState(false);

  const userPrivilege = localStorage.getItem("user_privilege");

  const fetchChildData = async () => {
    if (child) {
      try {
        const childId = parseInt(child);
        if (!isNaN(childId)) {
          const childInfoResponse = await fetch(
            `http://127.0.0.1:8000/api/child/${childId}`,
            {
              method: "GET",
              headers: {
                Authorization: "Token " + localStorage.getItem("token"),
              },
            }
          );
          const childInfoData = await childInfoResponse.json();
          setChildInfo(childInfoData);

          const childHistoryResponse = await fetch(
            `http://127.0.0.1:8000/api/child-case/${childId}/`,
            {
              method: "GET",
              headers: {
                Authorization: "Token " + localStorage.getItem("token"),
              },
            }
          );
          const childHistoryData = await childHistoryResponse.json();
          setChildHistory(childHistoryData);
        } else {
          console.error("Invalid child ID");
        }
      } catch (error) {
        console.error("Error fetching child data:", error);
      }
    }
  };

  useEffect(() => {
    if (child) {
      fetchChildData();
    }
  }, [child]);

  const recentCase = childHistoryInfo.length > 0 ? childHistoryInfo[0] : null;

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(truncateFileName(file.name, 14));
      setHasFile(true);
    } else {
      setFileName("Select file");
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;
    setChildInfo((prevStateInfo) => ({
      ...prevStateInfo!,
      [name]: value,
    }));
    setHasChanges(true);
  };

  const handleStatusInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;
    setChildInfo((prevStateInfo) => ({
      ...prevStateInfo!,
      [name]: value,
    }));
    setHasStatus(true);
  };

  const truncateFileName = (name: string, maxLength: number) => {
    if (name.length <= maxLength) {
      return name;
    }
    const extIndex = name.lastIndexOf(".");
    const extension = extIndex !== -1 ? name.slice(extIndex) : "";
    const truncatedName = name.slice(0, maxLength - extension.length - 3);
    return `${truncatedName}...${extension}`;
  };

  const updateChildInfo = async () => {
    try {
      const childInfoRequestData = {
        age: childInfo?.age,
        family: childInfo?.family.id,
        firstname: childInfo?.firstname,
        gender: childInfo?.gender,
        identity: childInfo?.identity,
        lastname: childInfo?.lastname,
      };

      await axios.put(
        `http://127.0.0.1:8000/api/child/${childInfo?.id}`,
        childInfoRequestData,
        {
          headers: {
            Authorization: "Token " + localStorage.getItem("token"),
          },
        }
      );

      setMessage("Child information updated successfully");
      setHasChanges(false);
    } catch (error) {
      console.error("Error updating child information:", error);
    }
  };

  const updateChildStatus = async () => {
    try {
      const childInfoStatusData = {
        age: childInfo?.age,
        family: childInfo?.family.id,
        firstname: childInfo?.firstname,
        gender: childInfo?.gender,
        identity: childInfo?.identity,
        lastname: childInfo?.lastname,
        status: childInfo?.status,
        behavior: childInfo?.behavior,
        behavior_desc: childInfo?.behavior_desc,
      };

      await axios.put(
        `http://127.0.0.1:8000/api/child/${childInfo?.id}`,
        childInfoStatusData,
        {
          headers: {
            Authorization: "Token " + localStorage.getItem("token"),
          },
        }
      );

      setStatusMessage("Child status changed successfully");
      setHasStatus(false);
    } catch (error) {
      console.log("Error updating child status", error);
    }
  };

  const changePicture = async () => {
    if (childInfo?.id) {
      try {
        const imageInput = document.querySelector<HTMLInputElement>(
          "input[name=profile_picture]"
        );

        console.log("this");

        if (imageInput && imageInput.files && imageInput.files.length > 0) {
          const formData = new FormData();
          formData.append("profile_picture", imageInput.files[0]);

          await axios.put(
            `http://127.0.0.1:8000/api/change-child-pp/${encodeURIComponent(
              childInfo?.id
            )}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Token ${localStorage.getItem("token")}`,
              },
            }
          );

          fetchChildData();
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div>
      <h5 className="text-muted fw-700">Child Info</h5>

      <div className="d-flex gap-3">
        <div className="p-3 border rounded w-full">
          <div className="flex-box gap-5 justify-content-between mb-5">
            <div className="col-md-7">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateChildInfo();
                }}
              >
                <h6 className="text-muted fw-700">Personal Information</h6>
                <p className="m-0">Names: </p>
                <div className="d-flex gap-3 w-full mt-1">
                  <div className="w-full">
                    <input
                      type="text"
                      name="firstname"
                      className="w-full"
                      defaultValue={childInfo?.firstname}
                      onChange={handleInputChange}
                      disabled={userPrivilege == "rehab"}
                    />
                  </div>
                  <div className="w-full">
                    <input
                      type="text"
                      name="lastname"
                      className="w-full"
                      defaultValue={childInfo?.lastname}
                      onChange={handleInputChange}
                      disabled={userPrivilege == "rehab"}
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <p className="m-0">ID Number: </p>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="identity"
                      className="w-full"
                      defaultValue={childInfo?.identity}
                      onChange={handleInputChange}
                      disabled={userPrivilege == "rehab"}
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <p className="m-0">Age:</p>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="age"
                      className="w-full"
                      defaultValue={childInfo?.age}
                      onChange={handleInputChange}
                      disabled={userPrivilege == "rehab"}
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <p className="m-0">Gender: </p>
                  <div className="mt-1">
                    <select
                      name="gender"
                      className="w-full"
                      value={childInfo?.gender || ""}
                      onChange={handleInputChange}
                      disabled={userPrivilege === "rehab"}
                    >
                      <option value="">------</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>

                {message && (
                  <div className="alert alert-primary mt-3 p-2" role="alert">
                    <p className="m-0 text-muted f-14">{message}</p>
                  </div>
                )}

                {userPrivilege != "rehab" ? (
                  <div className="mt-4">
                    <button
                      type="submit"
                      disabled={!hasChanges}
                      className={`g-btn px-3 f-11 ${
                        hasChanges ? "primary-btn" : "muted-btn"
                      }`}
                    >
                      SAVE CHANGES
                    </button>
                  </div>
                ) : (
                  <></>
                )}
              </form>
            </div>
            <div className="col-md-3 ">
              <div className="col-md-12 border rounded">
                <img
                  src={childInfo?.profile_picture}
                  className="rounded"
                  alt={childInfo?.firstname}
                />
              </div>

              {userPrivilege != "rehab" ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    changePicture();
                  }}
                  method="post"
                  encType="multipart/form-data"
                >
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <div>
                      <div className="img-pre-cont">
                        <div className="img-file-prev border rounded">
                          <small>{fileName}</small>
                        </div>
                        <input
                          type="file"
                          name="profile_picture"
                          className="img-input"
                          onChange={handleFileChange}
                        />
                      </div>
                    </div>

                    <div>
                      <Button
                        text={"UPLOAD"}
                        type={"submit"}
                        color={""}
                        class={`g-btn px-2 f-11 ${
                          hasFile ? "primary-btn" : "muted-btn"
                        }`}
                      />
                    </div>
                  </div>
                </form>
              ) : (
                <></>
              )}
            </div>
          </div>

          <div className="mt-4 flex-box">
            <div className="w-full">
              <h6 className="text-muted fw-700">Parents Information</h6>
              <p className="m-0">
                Father:{" "}
                <strong className="fw-500">
                  {childInfo?.family.fathernames}
                </strong>
              </p>
              <p className="m-0">
                Mother:{" "}
                <strong className="fw-500">
                  {childInfo?.family.mothernames}
                </strong>
              </p>
              <p className="m-0">
                Marriage status:{" "}
                <strong className="fw-500">
                  {childInfo?.family.mariage_status}
                </strong>
              </p>
            </div>

            <div className="col-md-3">
              <h6 className="text-muted fw-700">Address</h6>
              <p className="m-0">
                District:{" "}
                <strong className="fw-500">{childInfo?.family.district}</strong>
              </p>
              <p className="m-0">
                Sector:{" "}
                <strong className="fw-500">{childInfo?.family.sector}</strong>
              </p>
              <p className="m-0">
                Cell:{" "}
                <strong className="fw-500">{childInfo?.family.cell}</strong>
              </p>
              <p className="m-0">
                Village:{" "}
                <strong className="fw-500">{childInfo?.family.village}</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="p-3 border rounded col-md-4">
          <h6 className="text-muted fw-700">Summary</h6>
          <p className="m-0">
            Recent case:{" "}
            <strong className="fw-500">
              <Link to={`/admin/case/${recentCase?.id}`}>
                {recentCase?.case_code}
              </Link>{" "}
              - {recentCase?.reason_of_capture}
            </strong>
          </p>
          <p className="m-0">
            Behaviors: <strong className="fw-500">{childInfo?.behavior}</strong>
          </p>
          <p className="m-0">
            Current status:{" "}
            <strong className="fw-500">{childInfo?.status}</strong> &nbsp;{" "}
            <button type="button" className="edit-btn" id="edit-btn">
              <FontAwesomeIcon
                icon={faPen}
                className="f-13"
                onClick={() => setShowForm(!showForm)}
              />
            </button>
          </p>

          <div className="mt-3" hidden={!showForm}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateChildStatus();
              }}
            >
              <label htmlFor="" className="">
                Change status to
              </label>
              <div>
                <select
                  name="status"
                  className="w-full"
                  value={childInfo?.status}
                  onChange={handleStatusInputChange}
                >
                  {userPrivilege != "rehab" ? (
                    <>
                      <option value="In family">In family</option>
                      <option value="In school">In school</option>
                      <option value="In transit center">
                        In transit center
                      </option>
                      <option value="In street">In street</option>
                      <option value="In rehabilitation center">
                        In rehabilitation center
                      </option>
                    </>
                  ) : (
                    <>
                      <option value="In rehabilitation center">
                        In rehabilitation process
                      </option>
                      <option value="Rehabilitated">
                        Rehabilitated
                      </option>
                    </>
                  )}
                </select>
              </div>

              <div className="mt-3">
                <label htmlFor="">Behaviors</label>
                <input
                  name="behavior"
                  type="text"
                  className="w-full"
                  placeholder="Enter his/her behaviors"
                  defaultValue={childInfo?.behavior}
                  onChange={handleStatusInputChange}
                />
              </div>

              <div className="w-full mt-2">
                <label htmlFor="">Other information</label>
                <textarea
                  name="behavior_desc"
                  className="w-full"
                  placeholder="Describe child's behavior"
                  defaultValue={childInfo?.behavior_desc || ""}
                  onChange={handleStatusInputChange}
                />
              </div>

              {statusMessage && (
                <div className="alert alert-primary mt-3 p-2" role="alert">
                  <p className="m-0 text-muted f-14">{statusMessage}</p>
                </div>
              )}

              <button
                type="submit"
                className={`g-btn mt-1 ${
                  hasStatus ? "primary-btn" : "muted-btn"
                }`}
                disabled={!hasStatus}
              >
                SUBMIT
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="p-3 border rounded w-full mt-3">
        <h6 className="text-muted fw-700">History</h6>

        <div className="flex-box flex-wrap gap-3 mt-2">
          {childHistoryInfo.map((caseItem) => (
            <Link to={`/admin/case/${recentCase?.id}`}>
              <div className="history border" key={caseItem.id}>
                <p className="m-0 f-13">{caseItem.reason_of_capture}</p>
                <small className="m-0 fw-700 f-11">
                  {caseItem.date_of_capture}
                </small>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewChild;
