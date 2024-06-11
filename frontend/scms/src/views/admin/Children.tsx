import { Link } from "react-router-dom";
import TextInput from "../../components/TextInput";
import ChildrenComponent from "../../components/ChildrenComponent";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faDownload } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface Cell {
  id: number;
  cellname: string;
  sector: string;
}

const Children = () => {
  const [dateFilter, showDateFilter] = useState(false);
  const [cellsFilter, showCellsFilter] = useState(false);
  const [dateRangeFilter, showDateRangeFilter] = useState(false);
  const [statusFilter, setStatusFilter] = useState(false);
  const [cellAndTimeRange, setCellAndTimeRange] = useState(false);
  const [filterBtnHandler, setFilterBtnHandler] = useState(() => () => {});
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [cellsIds, setCellsIds] = useState("");
  const [selectedCells, setSelectedCells] = useState<Cell[]>([]);
  const [childrenData, setChildrenData] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [cellData, setCellData] = useState<Cell[]>([]);
  const [endpoint, setEndpoint] = useState("");

  const [filter, setFilter] = useState("All children");
  const [filterValue, setFilterValue] = useState("");
  const [statusValue, setStatusValue] = useState("");
  const [filterDateRange, setFilterDateRange] = useState("");

  const sector_id = localStorage.getItem("sector_id");
  const cellId = localStorage.getItem("cell_id");
  const userPrivilege = localStorage.getItem("user_privilege");

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

  const showFilters = (event: any) => {
    const filter = event.target.value;

    showDateFilter(false);
    showCellsFilter(false);
    showDateRangeFilter(false);
    setCellAndTimeRange(false);
    setStatusFilter(false);

    let handler = () => {};

    switch (filter) {
      case "date":
        showDateFilter(true);
        setIsFilterActive(true);
        handler = filterByDate;
        break;
      case "date range":
        showDateRangeFilter(true);
        setIsFilterActive(true);
        handler = filterByDateRange;
        break;
      case "cell & status":
        showCellsFilter(true);
        setStatusFilter(true);
        setIsFilterActive(true);
        handler = filterByCellAndStatus;
        break;
      case "cell & date range":
        showDateRangeFilter(true);
        setCellAndTimeRange(true);
        showCellsFilter(true);
        setIsFilterActive(true);
        handler = filterByCellAndDateRange;
        break;
      case "cell, status & date range":
        showCellsFilter(true);
        setStatusFilter(true);
        showDateRangeFilter(true);
        setIsFilterActive(true);
        handler = filterByCellStatusAndDateRange;
        break;
      case "cell, status & date reported":
        showCellsFilter(true);
        setStatusFilter(true);
        showDateFilter(true);
        setIsFilterActive(true);
        handler = filterByCellStatusAndDate;
        break;
      case "cell & date":
        showCellsFilter(true);
        showDateFilter(true);
        setIsFilterActive(true);
        handler = filterByCellAndDate;
        break;
      case "cell":
        showCellsFilter(true);
        setIsFilterActive(true);
        handler = filterByCell;
        break;
      case "status":
        setStatusFilter(true);
        setIsFilterActive(true);
        handler = filterByStatus;
        break;
      default:
        setIsFilterActive(false);
        handler = () => {};
        break;
    }

    setFilterBtnHandler(() => handler);
  };

  const filterByDate = () => {
    const dateInput = document.querySelector<HTMLInputElement>(
      "input[name=date_reported]"
    );

    if (dateInput) {
      const dateQueryStr = `date=${encodeURIComponent(dateInput.value)}`;
      const dateUri =
        sector_id && userPrivilege == "sectorial"
          ? `http://127.0.0.1:8000/api/cell-children-by-date/?sector=${encodeURIComponent(
              sector_id
            )}&${dateQueryStr}`
          : cellId && userPrivilege == "cellular"
          ? `http://127.0.0.1:8000/api/cell-children-by-date/?cell=${encodeURIComponent(
              cellId
            )}&${dateQueryStr}`
          : `http://127.0.0.1:8000/api/children-by-date/?${dateQueryStr}`;

      setEndpoint(dateUri);
      setFilter("Date");
      setFilterValue(dateInput.value);
      setFilterDateRange("");
    }
  };

  const filterByCell = () => {
    const cellsInput = document.querySelector<HTMLInputElement>(
      "input[name=cells_ids]"
    );

    const cellsNamesInput = document.querySelector<HTMLInputElement>(
      "input[name=selected_cells]"
    );

    if (cellsInput) {
      const cells = cellsInput.value
        .split(",")
        .map((cellsInput) => cellsInput.trim());
      const cellQueryStr = cells
        .map((cell) => `cell=${encodeURIComponent(cell)}`)
        .join("&");

      const cellUri =
        sector_id && userPrivilege == "sectorial"
          ? `http://127.0.0.1:8000/api/children-by-cell/?sector=${encodeURIComponent(
              sector_id
            )}&${cellQueryStr}`
          : `http://127.0.0.1:8000/api/children-by-cell/?${cellQueryStr}`;

      setEndpoint(cellUri);
      setFilter("Cell(s)");
      cellsNamesInput?.value
        ? setFilterValue(cellsNamesInput?.value)
        : setFilterValue("");
      setFilterDateRange("");
    }
  };

  const filterByStatus = () => {
    const statusInput = document.querySelector<HTMLSelectElement>(
      "select[name=status]"
    );

    if (statusInput) {
      const statusQueryStr = `status=${encodeURIComponent(statusInput.value)}`;

      const statusUri =
        sector_id && userPrivilege == "sectorial"
          ? `http://127.0.0.1:8000/api/cell-children-by-status/?sector=${encodeURIComponent(
              sector_id
            )}&${statusQueryStr}`
          : cellId && userPrivilege == "cellular"
          ? `http://127.0.0.1:8000/api/cell-children-by-status/?cell=${encodeURIComponent(
              cellId
            )}&${statusQueryStr}`
          : `http://127.0.0.1:8000/api/stat-children/?${statusQueryStr}`;

      setEndpoint(statusUri);
      setFilterValue(statusInput.value);
      setFilter("Status");
      setFilterDateRange("");
    }
  };

  const filterByCellAndDate = () => {
    const cellsInput = document.querySelector<HTMLInputElement>(
      "input[name=cells_ids]"
    );

    const cellsNamesInput = document.querySelector<HTMLInputElement>(
      "input[name=selected_cells]"
    );

    const dateInput = document.querySelector<HTMLInputElement>(
      "input[name=date_reported]"
    );

    if (cellsInput && dateInput) {
      const cells = cellsInput.value
        .split(",")
        .map((cellsInput) => cellsInput.trim());
      const cellQueryStr = cells
        .map((cell) => `cell=${encodeURIComponent(cell)}`)
        .join("&");

      const cdQryStr = `${cellQueryStr}&${encodeURIComponent(dateInput.value)}`;

      const cdUri =
        sector_id && userPrivilege == "sectorial"
          ? `http://127.0.0.1:8000/api/cd-children/?sector=${encodeURIComponent(
              sector_id
            )}&${cdQryStr}`
          : `http://127.0.0.1:8000/api/cd-children/?${cdQryStr}`;

      console.log(cdUri);

      setEndpoint(cdUri);
      setFilter("Cell(s) and date");
      cellsNamesInput?.value
        ? setFilterValue(cellsNamesInput?.value)
        : setFilterValue("");
      setFilterDateRange(`Date: ${dateInput.value}`);
    }
  };

  const filterByDateRange = () => {
    const fromInput =
      document.querySelector<HTMLInputElement>("input[name=from]");

    const toInput = document.querySelector<HTMLInputElement>("input[name=to]");

    if (fromInput && toInput) {
      const drQryStr = `start_date=${encodeURIComponent(
        fromInput.value
      )}&end_date=${encodeURIComponent(toInput.value)}`;

      const drUri =
        sector_id && userPrivilege == "sectorial"
          ? `http://127.0.0.1:8000/api/cell-children-by-date-range/?sector=${encodeURIComponent(
              sector_id
            )}&${drQryStr}`
          : cellId && userPrivilege == "cellular"
          ? `http://127.0.0.1:8000/api/cell-children-by-date-range/?cell=${encodeURIComponent(
              cellId
            )}&${drQryStr}`
          : `http://127.0.0.1:8000/api/dr-children/?${drQryStr}`;

      setEndpoint(drUri);
      setFilter("Date range");
      setFilterValue("");
      setFilterDateRange(`From: ${fromInput.value} To: ${toInput.value}`);
    }
  };

  const filterByCellAndDateRange = () => {
    const cellsInput = document.querySelector<HTMLInputElement>(
      "input[name=cells_ids]"
    );

    const cellsNamesInput = document.querySelector<HTMLInputElement>(
      "input[name=selected_cells]"
    );

    const fromInput =
      document.querySelector<HTMLInputElement>("input[name=from]");

    const toInput = document.querySelector<HTMLInputElement>("input[name=to]");

    if (cellsInput && fromInput && toInput) {
      const cells = cellsInput.value
        .split(",")
        .map((cellsInput) => cellsInput.trim());
      const cellQueryStr = cells
        .map((cell) => `cell=${encodeURIComponent(cell)}`)
        .join("&");

      const cdrQryStr = `${cellQueryStr}&start_date=${encodeURIComponent(
        fromInput.value
      )}&end_date=${encodeURIComponent(toInput.value)}`;

      const cdrUri = `http://127.0.0.1:8000/api/cdr-children/?${cdrQryStr}`;
      setEndpoint(cdrUri);
      setFilter("Cell(s) and date range");
      cellsNamesInput?.value
        ? setFilterValue(cellsNamesInput?.value)
        : setFilterValue("");
      setFilterDateRange(`From: ${fromInput.value} To: ${toInput.value}`);
    }
  };

  const filterByCellAndStatus = () => {
    const cellsInput = document.querySelector<HTMLInputElement>(
      "input[name=cells_ids]"
    );

    const cellsNamesInput = document.querySelector<HTMLInputElement>(
      "input[name=selected_cells]"
    );

    const statusInput = document.querySelector<HTMLSelectElement>(
      "select[name=status]"
    );

    if (cellsInput && statusInput) {
      const cells = cellsInput.value
        .split(",")
        .map((cellsInput) => cellsInput.trim());
      const cellQueryStr = cells
        .map((cell) => `cell=${encodeURIComponent(cell)}`)
        .join("&");

      const csQryStr = `${cellQueryStr}&status=${encodeURIComponent(
        statusInput.value
      )}`;

      const csUri =
        sector_id && userPrivilege == "sectorial"
          ? `http://127.0.0.1:8000/api/cs-children/?sector=${encodeURIComponent(
              sector_id
            )}&${csQryStr}`
          : `http://127.0.0.1:8000/api/cs-children/?${csQryStr}`;

      console.log(csUri);

      setEndpoint(csUri);
      setFilter("Cell(s) and status");
      cellsNamesInput?.value
        ? setFilterValue(cellsNamesInput?.value)
        : setFilterValue("");
      setFilterDateRange(`Status: ${statusInput.value}`);
    }
  };

  const filterByCellStatusAndDate = () => {
    const cellsInput = document.querySelector<HTMLInputElement>(
      "input[name=cells_ids]"
    );

    const cellsNamesInput = document.querySelector<HTMLInputElement>(
      "input[name=selected_cells]"
    );

    const statusInput = document.querySelector<HTMLSelectElement>(
      "select[name=status]"
    );

    const dateInput = document.querySelector<HTMLInputElement>(
      "input[name=date_reported]"
    );

    if (cellsInput && statusInput && dateInput) {
      const cells = cellsInput.value
        .split(",")
        .map((cellsInput) => cellsInput.trim());
      const cellQueryStr = cells
        .map((cell) => `cell=${encodeURIComponent(cell)}`)
        .join("&");

      const csdQryStr = `${cellQueryStr}&status=${encodeURIComponent(
        statusInput.value
      )}&date=${encodeURIComponent(dateInput.value)}`;

      const csdUri = `http://127.0.0.1:8000/api/csd-children/?${csdQryStr}`;
      setEndpoint(csdUri);
      setFilter("Cell(s), status and date");
      cellsNamesInput?.value
        ? setFilterValue(cellsNamesInput?.value)
        : setFilterValue("");
      setStatusValue(`Status: ${statusInput.value}`);
      setFilterDateRange(`Date: ${dateInput.value}`);
    }

    if (cellId && userPrivilege == "cellular" && statusInput && dateInput) {
      const csdQryStr = `cell=${encodeURIComponent(
        cellId
      )}&status=${encodeURIComponent(
        statusInput.value
      )}&date=${encodeURIComponent(dateInput.value)}`;

      const csdUri = `http://127.0.0.1:8000/api/cell-children-by-date/?${csdQryStr}`;
      setEndpoint(csdUri);
      setFilter("Status and date");
      setFilterValue(`Status: ${statusInput.value}`);
      setStatusValue("");
      setFilterDateRange(`Date: ${dateInput.value}`);
    }
  };

  const filterByCellStatusAndDateRange = () => {
    const cellsInput = document.querySelector<HTMLInputElement>(
      "input[name=cells_ids]"
    );

    const cellsNamesInput = document.querySelector<HTMLInputElement>(
      "input[name=selected_cells]"
    );

    const statusInput = document.querySelector<HTMLSelectElement>(
      "select[name=status]"
    );

    const fromInput =
      document.querySelector<HTMLInputElement>("input[name=from]");

    const toInput = document.querySelector<HTMLInputElement>("input[name=to]");

    if (cellsInput && statusInput && fromInput && toInput) {
      const cells = cellsInput.value
        .split(",")
        .map((cellsInput) => cellsInput.trim());
      const cellQueryStr = cells
        .map((cell) => `cell=${encodeURIComponent(cell)}`)
        .join("&");

      const csdrQryStr = `${cellQueryStr}&status=${encodeURIComponent(
        statusInput.value
      )}&start_date=${encodeURIComponent(
        fromInput.value
      )}&end_date=${encodeURIComponent(toInput.value)}`;

      const csdrUri =
        cellId && userPrivilege == "cellular"
          ? `http://127.0.0.1:8000/api/cell-children-by-sdr/?cell=${encodeURIComponent(
              cellId
            )}&${csdrQryStr}`
          : `http://127.0.0.1:8000/api/csdr-children/?${csdrQryStr}`;

      setEndpoint(csdrUri);
      setFilter("Cell(s), status and date range");
      cellsNamesInput?.value
        ? setFilterValue(cellsNamesInput?.value)
        : setFilterValue("");
      setStatusValue(`Status: ${statusInput.value}`);
      setFilterDateRange(`From: ${fromInput.value} To: ${toInput.value}`);
    }

    if (
      cellId &&
      userPrivilege == "cellular" &&
      statusInput &&
      fromInput &&
      toInput
    ) {
      const csdrQryStr = `status=${encodeURIComponent(
        statusInput.value
      )}&start_date=${encodeURIComponent(
        fromInput.value
      )}&end_date=${encodeURIComponent(toInput.value)}`;

      const csdrUri = `http://127.0.0.1:8000/api/cell-children-by-sdr/?cell=${encodeURIComponent(
        cellId
      )}&${csdrQryStr}`;

      setEndpoint(csdrUri);
      setFilter("Status and date range");
      setFilterValue(`Status: ${statusInput.value}`);
      setStatusValue("");
      setFilterDateRange(`From: ${fromInput.value} To: ${toInput.value}`);
    }
  };

  const handleDataFetched = (data: any) => {
    setChildrenData(data);
  };

  const handleButtonClick = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectCellFilter = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedCellId = parseInt(event.target.value);
    const selectedCell = cellData.find((cell) => cell.id === selectedCellId);

    if (
      selectedCell &&
      !selectedCells.some((cell) => cell.id === selectedCell.id)
    ) {
      const updatedSelectedCells = [...selectedCells, selectedCell];
      setSelectedCells(updatedSelectedCells);
      setInputValue(
        updatedSelectedCells.map((cell) => cell.cellname).join(", ")
      );

      setCellsIds(updatedSelectedCells.map((cell) => cell.id).join(", "));
    }
  };

  const handleRemoveCell = (id: number) => {
    const updatedSelectedCells = selectedCells.filter((cell) => cell.id !== id);
    setSelectedCells(updatedSelectedCells);
    setInputValue(updatedSelectedCells.map((cell) => cell.cellname).join(", "));
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString();
    var startY = 70;

    doc.setFontSize(15);
    doc.text("Children Report", 14, 22);
    doc.setFontSize(11);
    doc.text(`Sector: ${localStorage.getItem("sector")}`, 14, 30);
    filterValue
      ? doc.text(`${filter}: [${filterValue}]`, 14, 38)
      : doc.text(`${filter}`, 14, 38);

    if (filterDateRange) {
      doc.text(filterDateRange, 14, 46);
    } else {
      startY = startY - 8;
    }

    if (statusValue) {
      doc.text(`${statusValue}`, 14, 54);
    } else {
      startY = startY - 8;
    }

    cellAndTimeRange
      ? doc.text(`${cellAndTimeRange}`, 14, 54)
      : (startY = startY - 8);

    const columns = ["Child", "Identity", "Family", "Cases"];
    const rows = childrenData.map((child: any) => [
      `${child.firstname} ${child.lastname}\nage: ${child.age}\nstatus: ${child.status}`,
      child.identity,
      `Father: ${child.family.fathernames}\nMother: ${child.family.mothernames}\nMarriage status: ${child.family.mariage_status}`,
      child.cases,
    ]);

    doc.autoTable({
      head: [columns],
      body: rows,
      startY: startY,
      styles: { cellPadding: 2, fontSize: 10 },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 40 },
        2: { cellWidth: 65 },
        3: { cellWidth: 15 },
      },
      didDrawCell: (data: any) => {
        if (data.column.index === 1 && data.row.index === 1) {
          const cell = data.cell;
          cell.styles.fillColor = "#FFFF00";
          cell.styles.textColor = "#000000";
        }
      },
    });

    const pageSize = doc.internal.pageSize;
    const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
    const textBottomMargin = 15;
    const y = pageHeight - textBottomMargin;

    doc.setFontSize(10);
    doc.text(`Report generated on: ${formattedDate}`, 14, y);

    doc.save("children.pdf");
  };

  const exportToExcel = () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString();

    const sector = localStorage.getItem("sector");

    const headers = [
      ["Children Report"],
      [`Sector: ${sector}`],
      [filterValue ? `${filter}: [${filterValue}]` : `${filter}`],
      [filterDateRange ? filterDateRange : ""],
      [statusValue ? statusValue : ""],
      [],
    ];

    const childrenDataRows = childrenData.map((child: any) => [
      `${child.firstname} ${child.lastname}\tage: ${child.age}\tstatus: ${child.status}`,
      child.identity,
      `Father: ${child.family.fathernames}\nMother: ${child.family.mothernames}\nMarriage status: ${child.family.mariage_status}`,
      child.cases,
    ]);

    const footer = [[], [`Report generated on: ${formattedDate}`]];

    const worksheetData = [
      ...headers,
      ["Child", "Identity", "Family", "Cases"],
      ...childrenDataRows,
      ...footer,
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Cases");

    XLSX.writeFile(workbook, "children.xlsx");
  };

  return (
    <>
      <div className="">
        <div className="mt-3">
          <div className="">
            <div className="w-full">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="text-muted">Children</h5>
                <Link
                  to="/admin/report-case"
                  className="py-1 px-3 secondary-btn"
                >
                  Report New Case
                </Link>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-2 mt-3">
                <div className="d-flex align-items-center gap-3 w-full">
                  <h5 className="text-muted f-16 ">Filter by </h5>
                  <div className="filter">
                    <div className="select-wrapper border rounded d-flex align-items-center">
                      <select
                        name=""
                        id=""
                        className="select"
                        onChange={showFilters}
                      >
                        <option value="">----------</option>
                        {userPrivilege != "cellular" ? (
                          <option value="cell">Cell(s)</option>
                        ) : (
                          ""
                        )}
                        <option value="status">Status</option>
                        <option value="date range">Date range</option>
                        <option value="date">Date reported</option>
                        {userPrivilege != "cellular" ? (
                          <>
                            <option value="cell & status">
                              Cell(s) & status
                            </option>
                            <option value="cell & date range">
                              Cell(s) & Date range
                            </option>
                            <option value="cell & date">
                              Cell(s) & Date reported
                            </option>
                            <option value="cell, status & date range">
                              Cell(s), status & date range
                            </option>
                            <option value="cell, status & date reported">
                              Cell(s), status & date reported
                            </option>
                          </>
                        ) : (
                          <>
                            <option value="cell, status & date reported">
                              Status & date reported
                            </option>
                            <option value="cell, status & date range">
                              Status & date range
                            </option>
                          </>
                        )}
                      </select>
                      <FontAwesomeIcon
                        icon={faFilter}
                        className="select-icon"
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <TextInput
                      name="username"
                      class="py-1 search-box"
                      value=""
                      placeholder="Search"
                    />
                  </div>
                </div>
                <div className="w-full  d-flex justify-content-end align-items-center gap-3">
                  <div>
                    <div className="w-full">
                      <div className="">
                        <button
                          className="secondary-btn px-3 py-1"
                          onClick={handleButtonClick}
                        >
                          <FontAwesomeIcon icon={faDownload}></FontAwesomeIcon>{" "}
                          &nbsp; Download
                        </button>
                      </div>
                      {isDropdownVisible && (
                        <div className="d-btns-dropdown" ref={dropdownRef}>
                          <ul className="d-btns">
                            <li>
                              <button
                                onClick={exportToPDF}
                                className="d-btn cell-btn f-13 fw-500"
                              >
                                PDF
                              </button>
                            </li>
                            <li>
                              <button
                                onClick={exportToExcel}
                                className="d-btn cell-btn f-13 fw-500"
                              >
                                XLS
                              </button>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="filters-holder flex-box gap-3">
                <div className="col-lg-6">
                  {userPrivilege != "cellular" && cellsFilter && (
                    <div>
                      <label htmlFor="">
                        Select cell<small>(</small>s<small>)</small>
                      </label>
                      <div className="d-flex gap-3">
                        <div className="w-full">
                          <select
                            name="cell"
                            id=""
                            className="w-full"
                            onChange={handleSelectCellFilter}
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
                          <div className="cells-div">
                            <input
                              name="selected_cells"
                              type="text"
                              className="w-full  sel-cells"
                              value={inputValue}
                              readOnly
                            />

                            <input
                              name="cells_ids"
                              type="text"
                              className="w-full  sel-cells"
                              value={cellsIds}
                              readOnly
                            />
                            <div className="w-full sel-cel d-flex gap-1">
                              {selectedCells.length == 0 ? (
                                <button className="cell-btn border">
                                  Nothing selected
                                </button>
                              ) : (
                                selectedCells.map((cell) => (
                                  <button
                                    key={cell.id}
                                    className="cell-btn border"
                                    onClick={() => handleRemoveCell(cell.id)}
                                  >
                                    {cell.cellname}
                                    <small className="f-14 fw-700">
                                      &times;
                                    </small>
                                  </button>
                                ))
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {statusFilter && (
                    <div className="w-full mt-2">
                      <label>Select status</label>
                      <div className="d-flex gap-3">
                        <div className="w-full">
                          <div className="select-wrapper col-lg-12 border rounded d-flex align-items-center">
                            <select name="status" id="" className="w-full">
                              <option value="">----------</option>
                              <option value="In school">In school</option>
                              <option value="Re-integrated in family">
                                In family
                              </option>
                              <option value="In transit centre">
                                In transit centre
                              </option>
                              <option value="In rehabilitation center">
                                In rehabilitation center
                              </option>
                              <option value="In street">In street</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {dateFilter && (
                    <div className="w-full mt-2">
                      <label>Pick date</label>
                      <div className="d-flex gap-3">
                        <div className="w-full">
                          <div className="select-wrapper col-lg-12 border rounded d-flex align-items-center">
                            <input
                              type="date"
                              name="date_reported"
                              id=""
                              className="w-full"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {dateRangeFilter && (
                    <div className="mt-2">
                      <label htmlFor="">Pick dates</label>
                      <div className="d-flex by-date gap-3">
                        <div className="w-full">
                          <div className="">
                            <small>
                              <label htmlFor="">From</label>
                            </small>
                            <input type="date" className="w-full" name="from" />
                          </div>
                        </div>
                        <div className="w-full">
                          <div className="">
                            <small>
                              <label htmlFor="">To</label>
                            </small>
                            <input type="date" className="w-full" name="to" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {isFilterActive && (
                  <div className="col-lg-6 d-flex align-items-flex-end">
                    <div>
                      <button
                        className="primary-btn px-3 mt-4"
                        onClick={filterBtnHandler}
                      >
                        FILTER
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-3 border rounded p-2 children-th scroll">
                <ChildrenComponent
                  onDataFetched={handleDataFetched}
                  endpoint={endpoint}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Children;
