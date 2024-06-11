import React, { useEffect } from "react";
import axios from "axios";

interface ParentsData {
  id: string;
  sector: string;
  cell: string;
  fathernames: string;
  mothernames: string;
  mariage_status: string;
  district: string;
  village: string;
}

interface ParentsInfo {
  Info: ParentsData;
  onParentsDataChange: (data: ParentsData) => void;
}

const ParentInfo: React.FC<ParentsInfo> = ({ Info, onParentsDataChange }) => {
  const fam = localStorage.getItem("family_id");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (fam) {
          const response = await axios.get(
            `http://127.0.0.1:8000/api/family/${fam}`,
            {
              headers: {
                Authorization: "Token " + localStorage.getItem("token"),
              },
            }
          );
          onParentsDataChange(response.data);
        }
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchData();
  }, [fam, onParentsDataChange]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    onParentsDataChange({ ...Info, [name]: value });
  };

  return (
    <div>
      <h5>Parent Information</h5>
      <div className="form-group">
        <div className="w-full">
          <label htmlFor="">Father Names</label>
          <input
            type="text"
            name="fathernames"
            className="w-full"
            value={Info?.fathernames || ""}
            placeholder="Enter father names"
            autoFocus
            autoCapitalize="on"
            onChange={handleInputChange}
          />
        </div>

        <div className="w-full mt-3">
          <label htmlFor="">Mother Names</label>
          <input
            type="text"
            name="mothernames"
            className="w-full"
            value={Info?.mothernames || ""}
            placeholder="Enter mother names"
            onChange={handleInputChange}
          />
        </div>

        <div className="w-full mt-3">
          <label htmlFor="" className="">
            Marriage status
          </label>
          <select
            name="mariage_status"
            className="w-full"
            defaultValue={Info?.mariage_status}    
            onChange={handleInputChange}
          >
            <option value="">--------</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="One deceased">One deceased</option>
            <option value="Both deceased">Both deceased</option>
          </select>
        </div>

        <div className="w-full mt-3">
          <label htmlFor="">Residence address</label>
          <div className="flex-box gap-2">
            <div className="w-full">
              <label htmlFor="">
                <small>District</small>
              </label>
              <input
                type="text"
                name="district"
                className="w-full"
                defaultValue={Info?.district || ""}
                onChange={handleInputChange}
                placeholder="Enter origin address"
              />
            </div>
            <div className="w-full">
              <label htmlFor="">
                <small>Sector</small>
              </label>
              <input
                type="text"
                name="sector"
                className="w-full"
                defaultValue={Info.sector}
                onChange={handleInputChange}
                placeholder="Enter origin address"
              />
            </div>
            <div className="w-full">
              <label htmlFor="">
                <small>Cell</small>
              </label>
              <input
                type="text"
                name="cell"
                className="w-full"
                defaultValue={Info.cell}
                onChange={handleInputChange}
                placeholder="Enter origin address"
              />
            </div>

            <div className="w-full">
              <label htmlFor="">
                <small>Village</small>
              </label>
              <input
                type="text"
                name="village"
                className="w-full"
                defaultValue={Info.village}
                onChange={handleInputChange}
                placeholder="Enter origin address"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentInfo;
