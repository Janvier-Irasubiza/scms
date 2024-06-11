import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

interface FamData {
  id: string;
  fathernames: string;
  mothernames: string;
  mariage_status: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
  status: string;
  about_family: string;
}

interface CData {
  id: number;
  firstname: string;
  lastname: string;
  identity: string;
  gender: string;
  age: number;
  family: string;
  created_at: string;
  updated_at: string;
  status: string;
  behavior: string;
  profile_picture: string;
}

const ReviewFamily = () => {
  const { id } = useParams();
  const [familyData, setFamilyData] = useState<FamData | null>(null);
  const [childrenData, setChildrenData] = useState<CData[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [message, setMessage] = useState<string | undefined>(undefined);

  const fetchFamilyInfo = async (famId: number) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/family/${famId}/`,
        {
          method: "GET",
          headers: {
            Authorization: "Token " + localStorage.getItem("token"),
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch family information");
      }

      const data = await response.json();
      setFamilyData(data);

      const childrenDataResponse = await fetch(
        `http://127.0.0.1:8000/api/familychildren/${famId}`,
        {
          method: "GET",
          headers: {
            Authorization: "Token " + localStorage.getItem("token"),
          },
        }
      );

      if (!childrenDataResponse.ok) {
        throw new Error("Failed to fetch children information");
      }

      const childrenResponseData = await childrenDataResponse.json();
      setChildrenData(childrenResponseData);
    } catch (error) {
      console.error("Error fetching family information:", error);
    }
  };

  useEffect(() => {
    if (id) {
      const famId = parseInt(id);
      if (!isNaN(famId)) {
        fetchFamilyInfo(famId);
      } else {
        console.log("Error: Invalid family ID");
      }
    }
  }, [id]);

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;
    setFamilyData((prevStateInfo) => ({
      ...prevStateInfo!,
      [name]: value,
    }));
    setHasChanges(true);
  };

  const updateFamilyInfo = async () => {
    try {
      console.log(familyData);

      await axios.put(
        `http://127.0.0.1:8000/api/family/${familyData?.id}/`,
        familyData,
        {
          headers: {
            Authorization: "Token " + localStorage.getItem("token"),
          },
        }
      );

      setMessage("Family info changed successfully.");
      setHasChanges(false);
    } catch (error) {
      console.log("Error updating family info", error);
    }
  };

  return (
    <div className="">
      <h5 className="text-muted fw-700">Family Info</h5>

      <div className="d-flex gap-3">
        <div className="p-3 border rounded w-full">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateFamilyInfo();
            }}
          >
            <div className="mt-4 flex-box gap-5">
              <div className="w-full">
                <h6 className="text-muted fw-700">Parents Information</h6>
                <p className="m-0">Father </p>
                <div className="mt-1">
                  <input
                    name="fathernames"
                    type="text"
                    className="w-full"
                    defaultValue={familyData?.fathernames}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mt-3">
                  <p className="m-0">Mother </p>
                  <div className="mt-1">
                    <input
                      name="mothernames"
                      type="text"
                      className="w-full"
                      defaultValue={familyData?.mothernames}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <p className="m-0">
                    Marriage status
                  </p>
                  <div className="mt-1">
                    <select
                      name="mariage_status"
                      className="w-full"
                      value={familyData?.mariage_status}
                      onChange={handleInputChange}
                    >
                      <option value="">--------</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="One deceased">One deceased</option>
                      <option value="Both deceased">Both deceased</option>
                    </select>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="m-0">
                    Family status
                  </p>
                  <div className="mt-1">
                    <select
                      name="status"
                      className="w-full"
                      value={familyData?.status}
                      onChange={handleInputChange}
                    >
                      <option value="">--------</option>
                      <option value="Critical">Critical</option>
                      <option value="Improving">Improving</option>
                      <option value="Cleared">Cleared</option>
                      <option value="Dangerous">Dangerous</option>
                    </select>
                  </div>
                </div>
                <div className="mt-3">
                  <label htmlFor="">Describe family behavior</label>
                  <textarea
                    name="about_family"
                    className="w-full"
                    defaultValue={familyData?.about_family}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="col-md-4">
                <h6 className="text-muted fw-700">Address</h6>
                <p className="m-0">District </p>
                <div className="mt-1">
                  <input
                    name="district"
                    type="text"
                    className="w-full"
                    defaultValue={familyData?.district}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mt-3">
                  <p className="m-0">Sector </p>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="sector"
                      id=""
                      className="w-full"
                      value={familyData?.sector}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <p className="m-0">Cell </p>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="cell"
                      id=""
                      className="w-full"
                      value={familyData?.cell}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <p className="m-0">Village </p>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="village"
                      className="w-full"
                      defaultValue={familyData?.village}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {message && (
              <div className="alert alert-primary mt-3 p-2" role="alert">
                <p className="m-0 text-muted f-14">{message}</p>
              </div>
            )}

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
          </form>
        </div>

        <div className="p-3 border rounded col-md-4">
          <h6 className="text-muted fw-700">Children</h6>
          {childrenData.map((child) => (
            <p className="m-0" key={child.id}>
              <strong className="fw-500">
                <Link to={`/admin/child/${child.id}`}>
                  {child.firstname} {child.lastname}
                </Link>{" "}
                - {child.status} &nbsp;
              </strong>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewFamily;
