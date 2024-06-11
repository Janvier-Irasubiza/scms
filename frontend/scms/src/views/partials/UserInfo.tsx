import React, { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";

interface UserInfoProps {
  formData: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    username: string;
    identity: string;
    gender: string;
    age: string;
    office_sector: string;
    office_cell: string;
    responsability: string;
    address: string;
  };
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  emailMsg?: string;
  usernameMsg?: string;
}

interface Cell {
  id: number;
  cellname: string;
  sector: number;
}

const UserInfo: React.FC<UserInfoProps> = ({
  formData,
  handleChange,
  emailMsg,
  usernameMsg,
}) => {
  const [cellData, setCellData] = useState<Cell[]>([]);
  formData.office_sector = localStorage.getItem("sector_id") || "";

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

  return (
    <div>
      <h5>User Information</h5>
      <div className="d-flex gap-3 mt-3">
        <div className="w-full">
          <label htmlFor="">First name</label>
          <input
            type="text"
            name="first_name"
            className="w-full"
            value={formData.first_name}
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
            value={formData.last_name}
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
            value={formData.email}
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
            value={formData.phone}
            placeholder="Enter phone number"
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {emailMsg && (
        <div className="mt-1 text-red-500 f-14 text-danger">{emailMsg}</div>
      )}

      <div className="w-full mt-3">
        <label htmlFor="">Username</label>
        <input
          type="text"
          name="username"
          className="w-full"
          value={formData.username}
          placeholder="Enter username"
          onChange={handleChange}
          required
        />
      </div>

      {usernameMsg && (
        <div className="mt-1 text-red-500 f-14 text-danger">{usernameMsg}</div>
      )}

      <div className="w-full mt-3">
        <label htmlFor="">ID</label>
        <input
          type="text"
          name="identity"
          className="w-full"
          value={formData.identity}
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
            value={formData.gender}
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
            value={formData.age}
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
        value={formData.office_sector}
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
            value={formData.office_cell}
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
            value={formData.responsability}
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
          name="address"
          className="w-full"
          value={formData.address}
          placeholder="Enter residential address"
          onChange={handleChange}
          required
        />
      </div>
    </div>
  );
};

export default UserInfo;
