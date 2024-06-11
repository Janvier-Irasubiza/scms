import axios from "axios";
import React, { useEffect, useState } from "react";

interface CaseInfoProperties {
  reason: string;
  district_of_capture: string;
  sector_of_capture: number;
  cell_of_capture: number;
  village_of_capture: string;
  date_of_capture: string;
  orientation: string;
  other_info: string;
}

interface CaseInfoProps {
  caseInfo: CaseInfoProperties;
  onCaseInfoChange: (data: CaseInfoProperties) => void;
}

const CaseInfo: React.FC<CaseInfoProps> = ({ caseInfo, onCaseInfoChange }) => {
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
        console.log("Error fetching cell data", error);
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
        console.log("Error fetching sector data", error);
      });
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    onCaseInfoChange({
      ...caseInfo,
      [name]: value,
    });
  };

  return (
    <div>
      <h5>Case Information</h5>
      <div>
        <div className="w-full">
          <label htmlFor="">Reason of capture</label>
          <input
            type="text"
            name="reason"
            className="w-full"
            placeholder="Enter reason of capture"
            autoFocus
            value={caseInfo?.reason || ""}
            onChange={handleInputChange}
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
                name="district_of_capture"
                className="w-full"
                value={caseInfo?.district_of_capture || ""}
                onChange={handleInputChange}
                placeholder="Enter district"
              />
            </div>

            <div className="w-full">
              <label htmlFor="">
                <small>Sector</small>
              </label>
              <select
                name="sector_of_capture"
                className="w-full"
                value={caseInfo?.sector_of_capture || ""}
                onChange={handleInputChange}
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
                name="cell_of_capture"
                className="w-full"
                value={caseInfo?.cell_of_capture || ""}
                onChange={handleInputChange}
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
                name="village_of_capture"
                className="w-full"
                value={caseInfo?.village_of_capture || ""}
                onChange={handleInputChange}
                placeholder="Enter village"
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
              value={caseInfo?.date_of_capture || ""}
              onChange={handleInputChange}
            />
          </div>

          <div className="w-full">
            <label htmlFor="">Recommend orientation</label>
            <select
              name="orientation"
              className="w-full"
              value={caseInfo?.orientation || ""}
              onChange={handleInputChange}
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
            placeholder="Enter other information"
            value={caseInfo?.other_info || ""}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  );
};

export default CaseInfo;
