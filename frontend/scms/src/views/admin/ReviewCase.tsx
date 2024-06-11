import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import CaseInfo from "../partials/CaseInfo";
import axios from "axios";
import jsPDF from "jspdf";

interface ChildInfo {
  id: number;
  firstname: string;
  lastname: string;
  identity: string;
  gender: string;
  age: number;
  created_at: string;
  updated_at: string;
  status: string;
  behavior: string;
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
}

interface CaseInfo {
  id: number;
  child: {
    id: number;
  };
  case_code: string;
  reason_of_capture: string;
  date_of_capture: string;
  district_of_capture: string;
  sector_of_capture: string;
  cell_of_capture: string;
  village_of_capture: string;
  orientation: string;
  case_desc: string;
}

const ReviewCase = () => {
  var childId = "";
  const [message, setMessage] = useState<string | undefined>(undefined);
  const { caseId } = useParams();
  const [childInfo, setChildInfo] = useState<ChildInfo | null>(null);
  const [childCaseInfo, setCaseInfo] = useState<CaseInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [cellData, setCellData] = useState<
    {
      id: number;
      cellname: string;
      sector: string;
    }[]
  >([]);

  const [sectors, setSectors] = useState<
    {
      id: number;
      sectorname: string;
    }[]
  >([]);

  const userPrivilege = localStorage.getItem("user_privilege");

  const fetchChildData = async () => {
    try {
      if (caseId) {
        const case_id = parseInt(caseId);

        if (!isNaN(case_id)) {
          const response = await axios.get(
            `http://127.0.0.1:8000/api/case/${case_id}`,
            {
              headers: {
                Authorization: "Token " + localStorage.getItem("token"),
              },
            }
          );

          if (!response.data) {
            throw new Error("Failed to fetch case information");
          }

          setCaseInfo(response.data);
          childId = response.data.child.id;
        } else {
          throw new Error("Invalid case ID");
        }

        if (childId) {
          const child_id = parseInt(childId);

          const childResponse = await axios.get(
            `http://127.0.0.1:8000/api/child/${child_id}`,
            {
              headers: {
                Authorization: "Token " + localStorage.getItem("token"),
              },
            }
          );

          if (!childResponse.data) {
            throw new Error("Failed to fetch case information");
          }

          setChildInfo(childResponse.data);
        } else {
          console.log("Invalid child ID");
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

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
      .catch((error) => {
        console.log("Error fetching data", error);
      });

    axios
      .get("http://127.0.0.1:8000/api/sectors/", {
        method: "GET",
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setSectors(response.data);
      })
      .catch((error) => {
        console.log("Error fetching data", error);
      });
  }, []);

  useEffect(() => {
    fetchChildData();
  }, [caseId]);

  const handleInputChange = () => {
    setHasChanges(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16);
  };

  const updateCaseInfo = async () => {
    try {
      const reasonOfCaptureInput = document.querySelector<HTMLInputElement>(
        'input[name="reason"]'
      );
      const districtInput = document.querySelector<HTMLInputElement>(
        'input[name="district"]'
      );
      const sectorSelect = document.querySelector<HTMLSelectElement>(
        'select[name="sector"]'
      );
      const cellSelect = document.querySelector<HTMLSelectElement>(
        'select[name="cell"]'
      );
      const villageInput = document.querySelector<HTMLInputElement>(
        'input[name="village"]'
      );
      const dateOfCaptureInput = document.querySelector<HTMLInputElement>(
        'input[name="date_of_capture"]'
      );
      const orientationSelect = document.querySelector<HTMLSelectElement>(
        'select[name="orientation"]'
      );
      const otherInfoTextarea = document.querySelector<HTMLTextAreaElement>(
        'textarea[name="other_info"]'
      );

      if (
        reasonOfCaptureInput &&
        districtInput &&
        sectorSelect &&
        cellSelect &&
        villageInput &&
        dateOfCaptureInput &&
        orientationSelect &&
        otherInfoTextarea
      ) {
        const updatedCaseInfo = {
          child: childCaseInfo?.child.id,
          reason_of_capture: reasonOfCaptureInput.value,
          district_of_capture: districtInput.value,
          sector_of_capture: parseInt(sectorSelect.value),
          cell_of_capture: parseInt(cellSelect.value),
          village_of_capture: villageInput.value,
          date_of_capture: dateOfCaptureInput.value,
          orientation: orientationSelect.value,
          case_desc: otherInfoTextarea.value,
        };

        await axios.put(
          `http://127.0.0.1:8000/api/case/${childCaseInfo?.id}/`,
          updatedCaseInfo,
          {
            headers: {
              Authorization: "Token " + localStorage.getItem("token"),
            },
          }
        );

        setMessage("Case information updated successfully");
        setHasChanges(false);
      } else {
        console.error("One or more form elements not found.");
      }
    } catch (error) {
      console.error("Error updating case information:", error);
    }
  };

  function hexToRgb(hex: any) {
    const bigint = parseInt(hex.replace("#", ""), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  }

  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`Case report`, 10, 20);

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Personal Information", 10, 40);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Names: ${childInfo?.firstname} ${childInfo?.lastname}`, 10, 50);
    doc.text(`ID Number: ${childInfo?.identity}`, 10, 58);
    doc.text(`Age: ${childInfo?.age}`, 10, 66);
    doc.text(`Gender: ${childInfo?.gender}`, 10, 74);

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Parents Information", 10, 90);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Father: ${childInfo?.family.fathernames}`, 10, 98);
    doc.text(`Mother: ${childInfo?.family.mothernames}`, 10, 106);
    doc.text(`Marriage status: ${childInfo?.family.mariage_status}`, 10, 114);

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Address", 150, 90);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`District: ${childInfo?.family.district}`, 150, 98);
    doc.text(`Sector: ${childInfo?.family.sector}`, 150, 106);
    doc.text(`Cell: ${childInfo?.family.cell}`, 150, 114);
    doc.text(`Village: ${childInfo?.family.village}`, 150, 122);

    const colorHex = "#c6c5c5";
    const colorRGB = hexToRgb(colorHex);
    doc.setDrawColor(colorRGB.r, colorRGB.g, colorRGB.b);
    doc.line(10, 140, 200, 140);

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Case Information", 10, 155);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Case code: ", 10, 165);

    doc.setFont("helvetica", "bold");
    doc.text(`${childCaseInfo?.case_code}`, 35, 165);

    doc.setFont("helvetica", "normal");
    doc.text("Reason of capture: ", 10, 173);

    doc.line(13, 176, 13, 183);
    doc.text(`${childCaseInfo?.reason_of_capture}`, 16, 180);

    doc.text("Location of capture: ", 10, 190);
    doc.line(13, 194, 13, 225);
    doc.text(`District: ${childCaseInfo?.district_of_capture}`, 16, 198);
    doc.text(`Sector: ${childCaseInfo?.sector_of_capture}`, 16, 206);
    doc.text(`Cell: ${childCaseInfo?.cell_of_capture}`, 16, 214);
    doc.text(`Village: ${childCaseInfo?.village_of_capture}`, 16, 222);

    doc.text(`Date of capture: ${childCaseInfo?.date_of_capture}`, 10, 232);
    doc.text(`Recommend orientation: ${childCaseInfo?.orientation}`, 10, 241);
    doc.text(`Other information:`, 10, 250);

    doc.line(13, 252, 13, 260);
    doc.text(`${childCaseInfo?.case_desc}`, 16, 256);

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString();

    const pageSize = doc.internal.pageSize;
    const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
    const textBottomMargin = 15;
    const y = pageHeight - textBottomMargin;

    doc.setFontSize(10);
    doc.text(`Report generated on: ${formattedDate}`, 10, y);

    doc.save("case_info.pdf");
  };

  return (
    <div>
      <div className="mb-3 d-flex justify-content-end">
        <button onClick={exportToPDF} className="secondary-btn px-3 py-1">
          Print / Download
        </button>
      </div>
      <div className="p-4 border rounded w-full">
        <div className="flex-box justify-content-between gap-5">
          <div className="w-full">
            <h6 className="text-muted fw-700">Personal Information</h6>
            <p className="m-0">
              Names:{" "}
              <strong className="fw-500">
                {childInfo?.firstname} {childInfo?.lastname}
              </strong>
            </p>
            <p className="m-0">
              ID Number:{" "}
              <strong className="fw-500">{childInfo?.identity}</strong>
            </p>
            <p className="m-0">
              Age: <strong className="fw-500">{childInfo?.age}</strong>
            </p>
            <p className="m-0">
              Gender: <strong className="fw-500">{childInfo?.gender}</strong>
            </p>
          </div>

          <div className="col-md-2 border rounded">
            <img src="" alt="" />
          </div>
        </div>

        <div className="mt-4 flex-box  justify-content-between gap-5">
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

          <div className="col-md-2">
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
              Cell: <strong className="fw-500">{childInfo?.family.cell}</strong>
            </p>
            <p className="m-0">
              Village:{" "}
              <strong className="fw-500">{childInfo?.family.village}</strong>
            </p>
          </div>
        </div>

        <div className="mt-5 bt py-3">
          <h6 className="text-muted fw-700 mt-3">Case Information</h6>

          <p className="mt-3 mb-0">
            Case code:{" "}
            <strong className="fw-500">{childCaseInfo?.case_code}</strong>
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateCaseInfo();
            }}
            method="POST"
          >
            <div className="mt-3">
              <div className="w-full">
                <label htmlFor="">Reason of capture</label>
                <input
                  type="text"
                  name="reason"
                  className="w-full"
                  placeholder="Enter reason of capture"
                  defaultValue={childCaseInfo?.reason_of_capture}
                  onChange={handleInputChange}
                  disabled={userPrivilege == "rehab"}
                />
              </div>

              <div className="w-full mt-3">
                <label htmlFor="">Location of capture</label>
                <div className="flex-box gap-2">
                  <div className="w-full">
                    <label htmlFor="">
                      <small>District</small>
                    </label>
                    <input
                      type="text"
                      name="district"
                      className="w-full"
                      defaultValue={childCaseInfo?.district_of_capture}
                      onChange={handleInputChange}
                      placeholder="Enter district"
                      disabled={userPrivilege == "rehab"}
                    />
                  </div>

                  <div className="w-full">
                    <label htmlFor="">
                      <small>Sector</small>
                    </label>
                    <select
                      name="sector"
                      id=""
                      className="w-full"
                      defaultValue={childCaseInfo?.sector_of_capture}
                      onChange={handleInputChange}
                      disabled={userPrivilege == "rehab"}
                    >
                      <option value="">------</option>
                      {sectors.map((sector) => (
                        <option key={sector.id} value={sector.id}>
                          {sector.sectorname}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-full">
                    <label htmlFor="">
                      <small>Cell</small>
                    </label>
                    <select
                      name="cell"
                      id=""
                      className="w-full"
                      value={childCaseInfo?.cell_of_capture || ""}
                      onChange={handleInputChange}
                      disabled={userPrivilege == "rehab"}
                    >
                      <option value="">------</option>
                      {cellData.map((cell) => (
                        <option key={cell.id} value={cell.id}>
                          {cell.cellname}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-full">
                    <label htmlFor="">
                      <small>Village</small>
                    </label>
                    <input
                      type="text"
                      name="village"
                      className="w-full"
                      defaultValue={childCaseInfo?.village_of_capture}
                      onChange={handleInputChange}
                      placeholder="Enter village"
                      disabled={userPrivilege == "rehab"}
                    />
                  </div>
                </div>
              </div>

              <div className="d-flex gap-3 mt-3">
                <div className="w-full">
                  <label htmlFor="">Date of capture</label>
                  <input
                    type="datetime-local"
                    name="date_of_capture"
                    className="w-full"
                    defaultValue={formatDateForInput(
                      childCaseInfo?.date_of_capture || ""
                    )}
                    onChange={handleInputChange}
                    disabled={userPrivilege == "rehab"}
                  />
                </div>

                <div className="w-full">
                  <label htmlFor="">Recommend orientation</label>
                  <select
                    name="orientation"
                    className="w-full"
                    defaultValue={childCaseInfo?.orientation}
                    onChange={handleInputChange}
                    disabled={userPrivilege == "rehab"}
                  >
                    <option value="">---------</option>
                    <option value="Transit center">Transit center</option>
                    <option value="Imprisonment">Imprisonment</option>
                    <option value="Rehabilitation">Rehabilitation</option>
                    <option value="Family re-integration">
                      Family re-integration
                    </option>
                    <option value="School re-integration">
                      School re-integration
                    </option>
                  </select>
                </div>
              </div>

              <div className="w-full mt-3">
                <label htmlFor="">Other Information</label>
                <textarea
                  name="other_info"
                  className="w-full"
                  rows={3}
                  placeholder="Enter other information"
                  defaultValue={childCaseInfo?.case_desc || ""}
                  onChange={handleInputChange}
                  disabled={userPrivilege == "rehab"}
                />
              </div>

              {message && (
                <div className="alert alert-primary mt-3 p-2" role="alert">
                  <p className="m-0 text-muted f-14">{message}</p>
                </div>
              )}

              {userPrivilege != "rehab" ? (
                <div className="mt-4">
                  <button
                    type={"submit"}
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
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewCase;
