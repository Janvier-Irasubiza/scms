import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faBars,
  faChildren,
  faPeopleGroup,
  faPaperclip,
  // faVideo,
  faUsers,
  // faBriefcase,
} from "@fortawesome/free-solid-svg-icons";
import { useState, ChangeEvent, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

function Sidebar() {
  const location = useLocation();
  const getItemPath = location.pathname.split("/")[2];
  const [activeItem, setActiveItem] = useState(getItemPath || "");

  const sector_id = localStorage.getItem("sector_id");
  const userPrivilege = localStorage.getItem("user_privilege");

  const handleItemClick = (itemName: string) => {
    setActiveItem(itemName);
  };

  const [filter, setFilter] = useState("");

  const handleFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  const [cellData, setCellData] = useState<
    {
      id: number;
      cellname: string;
      executive_officer: string;
      sector: string;
    }[]
  >([]);

  const cellsUri =
    sector_id && userPrivilege == "sectorial"
      ? `http://127.0.0.1:8000/api/sector-cells/?sector=${encodeURIComponent(
          sector_id
        )}`
      : `http://127.0.0.1:8000/api/cells/`;

  useEffect(() => {
    axios
      .get(cellsUri, {
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
  }, []);

  return (
    <div className="sidebar">
      <div className="sb-pdg">
        <div className="sb-header m-0 text-muted f-12 fw-500">
          <p className="m-0">ADMINISTRATION</p>
        </div>
        <Link
          to="/admin/dashboard"
          className={`sb-link rounded d-block ${
            activeItem === "dashboard" ? "active" : ""
          }`}
          onClick={() => handleItemClick("dashboard")}
        >
          <div className="d-flex gap-2 align-items-center">
            <FontAwesomeIcon icon={faHome} className="f-13" />
            <span>Dashboard</span>
          </div>
        </Link>

        <Link
          to="/admin/cases"
          className={`sb-link rounded d-block ${
            activeItem === "cases" ? "active" : ""
          }`}
          onClick={() => handleItemClick("cases")}
        >
          <div className="d-flex align-items-center gap-2">
            <FontAwesomeIcon icon={faPaperclip} className="f-13" />
            <span>Cases</span>
          </div>
        </Link>

        <Link
          to="/admin/children"
          className={`sb-link rounded d-block ${
            activeItem === "children" ? "active" : ""
          }`}
          onClick={() => handleItemClick("children")}
        >
          <div className="d-flex align-items-center gap-2">
            <FontAwesomeIcon icon={faChildren} className="f-13" />
            <span>Children</span>
          </div>
        </Link>

        <Link
          to="/admin/families"
          className={`sb-link rounded d-block ${
            activeItem === "families" ? "active" : ""
          }`}
          onClick={() => handleItemClick("families")}
        >
          <div className="d-flex align-items-center gap-2">
            <FontAwesomeIcon icon={faPeopleGroup} className="f-13" />
            <span>Families</span>
          </div>
        </Link>
      </div>
      <div>
        {userPrivilege == "sectorial" || userPrivilege == "superuser" ? (
          <div className="sb-dp-container">
            <span
              className={`sb-dp-link m-0 d-block ${
                activeItem === "cells" ? "active" : ""
              }`}
            >
              <div className="d-flex align-items-center gap-2">
                <FontAwesomeIcon icon={faBars} className="f-13" />
                <span>Cells</span>
              </div>
              <div className="sb-dropdown">
                <div className="p-2 sb-search">
                  <input
                    type="text"
                    className=""
                    placeholder="Search"
                    value={filter}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="sb-content">
                  {cellData
                    .filter((cell) =>
                      cell.cellname.toLowerCase().includes(filter.toLowerCase())
                    )
                    .map((cell, index) => (
                      <Link
                        key={index}
                        to={`/admin/cells/${cell.cellname.toLowerCase()}`}
                        className={`sb-link m-0 d-block`}
                        onClick={() => handleItemClick("cells")}
                      >
                        {cell.cellname}
                      </Link>
                    ))}
                </div>
              </div>
            </span>
          </div>
        ) : (
          ""
        )}
      </div>
      {/* <div className="sb-pdg pt-2">
        <div className="sb-header mt-2 fw-500 mb-0 text-muted f-12 text-secondary">
          <p className="m-0">POSTING</p>
        </div>
        <Link
          to="/admin/testimonials"
          className={`sb-link rounded d-block ${
            activeItem === "testmonials" ? "active" : ""
          }`}
          onClick={() => handleItemClick("testmonials")}
        >
          <div className="d-flex align-items-center gap-2">
            <FontAwesomeIcon icon={faVideo} className="f-13" />
            <span>Testimonials</span>
          </div>
        </Link>
        <Link
          to="/admin/opps"
          className={`sb-link m-0 rounded d-block ${
            activeItem === "opps" ? "active" : ""
          }`}
          onClick={() => handleItemClick("opps")}
        >
          <div className="d-flex align-items-center gap-2">
            <FontAwesomeIcon icon={faBriefcase} className="f-13" />
            <span>Opportunities</span>
          </div>
        </Link>
      </div> */}

      {userPrivilege == "sectorial" || userPrivilege == "superuser" ? (
        <div className="sb-pdg pt-2">
          <div className="sb-header fw-500 mb-0 text-muted f-12">
            <p className="m-0">AUTHORIZATION</p>
          </div>
          <Link
            to="/admin/users"
            className={`sb-link m-0 rounded d-block ${
              activeItem === "users" ? "active" : ""
            }`}
            onClick={() => handleItemClick("users")}
          >
            <div className="d-flex align-items-center gap-2">
              <FontAwesomeIcon icon={faUsers} className="f-13" />
              <span>Users</span>
            </div>
          </Link>
        </div>
      ) : (
        " "
      )}
    </div>
  );
}

export default Sidebar;
