import { Link } from "react-router-dom";
import TextInput from "../../components/TextInput";
import CasesComponent from "../../components/CasesComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faFilter } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState, ChangeEvent, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface Cell {
  id: number;
  cellname: string;
  sector: string;
}

const Cases = () => {
  const [cellsFilter, showCellsFilter] = useState(false);
  const [dateFilter, showDateFilter] = useState(false);
  const [dateRangeFilter, showDateRangeFilter] = useState(false);
  const [filterBtn, showFilterBtn] = useState(true);
  const [filter, setFilter] = useState("All cases");
  const [filterValue, setFilterValue] = useState("");
  const [filterDateRange, setFilterDateRange] = useState("");
  const [selectedCells, setSelectedCells] = useState<Cell[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [endpoint, setEndpoint] = useState("");
  const [cellAndTimeRange, setCellAndTimeRange] = useState(false);
  const [cellData, setCellData] = useState<Cell[]>([]);
  const [caseData, setCaseData] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [cellsIds, setCellsIds] = useState("");

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
    showFilterBtn(filter === "Cell");

    switch (filter) {
      case "Date":
        showDateFilter(true);
        break;
      case "Time range":
        showDateRangeFilter(true);
        break;
      case "Cell & date":
        showCellsFilter(true);
        showDateFilter(true);
        break;
      case "Cell & Time range":
        showDateRangeFilter(true);
        setCellAndTimeRange(true);
        showCellsFilter(true);
        break;
      case "Cell":
        showCellsFilter(true);
        break;
      default:
        break;
    }
  };

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

  const filterByCells = () => {
    const cellsInput = document.querySelector<HTMLInputElement>(
      "input[name=selected_cells]"
    );

    if (cellsInput) {
      const cells = cellsInput.value
        .split(",")
        .map((cellsInput) => cellsInput.trim());

      const queryString = cells
        .map((cell) => `cell=${encodeURIComponent(cell)}`)
        .join("&");

      const dynamicEndpoint =
        sector_id && userPrivilege == "sectorial"
          ? `http://127.0.0.1:8000/api/cell-cases/?sector=${encodeURIComponent(
              sector_id
            )}&${queryString}`
          : `http://127.0.0.1:8000/api/cell-cases/?${queryString}`;

      setEndpoint(dynamicEndpoint);
      setFilter("Cell(s)");
      setFilterValue(cellsInput.value);
      setFilterDateRange("");
    }
  };

  const filterByDate = () => {
    const dateInput =
      document.querySelector<HTMLInputElement>("input[name=date]");
    if (dateInput) {
      const queryString = `date=${encodeURIComponent(dateInput.value)}`;

      const dynamicEndpoint =
        sector_id && cellId && userPrivilege == "sectorial"
          ? `http://127.0.0.1:8000/api/cell-date-cases/?sector=${encodeURIComponent(
              sector_id
            )}&cell=${encodeURIComponent(cellId)}&${queryString}`
          : cellId && userPrivilege == "cellular"
          ? `http://127.0.0.1:8000/api/cell-date-cases/?cell=${encodeURIComponent(
              cellId
            )}&${queryString}`
          : `http://127.0.0.1:8000/api/date-cases/?${queryString}`;

      setEndpoint(dynamicEndpoint);
      setFilter("Date");
      setFilterValue(dateInput.value);
      setFilterDateRange("");
    }
  };

  const filterByTimeRange = () => {
    const fromInput =
      document.querySelector<HTMLInputElement>("input[name=from]");
    const toInput = document.querySelector<HTMLInputElement>("input[name=to]");

    if (fromInput && toInput) {
      const queryString = `start_date=${encodeURIComponent(
        fromInput.value
      )}&end_date=${encodeURIComponent(toInput.value)}`;

      const dynamicUrl =
        sector_id && cellId && userPrivilege == "sectorial"
          ? `http://127.0.0.1:8000/api/cell-date-range-cases/?sector=${encodeURIComponent(
              sector_id
            )}&cell=${encodeURIComponent(cellId)}&${queryString}`
          : cellId && userPrivilege == "cellular"
          ? `http://127.0.0.1:8000/api/cell-date-range-cases/?cell=${encodeURIComponent(
              cellId
            )}&${queryString}`
          : `http://127.0.0.1:8000/api/date-range-cases/?${queryString}`;

      setEndpoint(dynamicUrl);
      setFilter("Time range");
      setFilterValue(
        `Time range: From: ${fromInput.value} To: ${toInput.value}`
      );
      setFilterDateRange("");
    }
  };

  const filterByCellAndDate = () => {
    const cellsInput = document.querySelector<HTMLInputElement>(
      "input[name=cells_ids]"
    );
    const dateInput =
      document.querySelector<HTMLInputElement>("input[name=date]");

    if (cellsInput && dateInput) {
      const cells = cellsInput.value
        .split(",")
        .map((cellsInput) => cellsInput.trim());

      const cellQuery = cells
        .map((cell) => `cell=${encodeURIComponent(cell)}`)
        .join("&");

      const cellDateQuery = `${cellQuery}&date=${encodeURIComponent(
        dateInput?.value
      )}`;

      const cellDateEndpoint =
        sector_id && userPrivilege == "sectorial"
          ? `http://127.0.0.1:8000/api/date-cell-cases/?sector=${encodeURIComponent(
              sector_id
            )}&${cellDateQuery}`
          : `http://127.0.0.1:8000/api/date-cell-cases/?${cellDateQuery}`;

      setEndpoint(cellDateEndpoint);
      setFilter("Cell(s) and date");
      setFilterValue(`Date: ${dateInput?.value}`);
    }
  };

  const filterByCellsAndTimeRange = () => {
    const cellsInput = document.querySelector<HTMLInputElement>(
      "input[name=cells_ids]"
    );
    const fromInput =
      document.querySelector<HTMLInputElement>("input[name=from]");
    const toInput = document.querySelector<HTMLInputElement>("input[name=to]");

    let queryString = "";

    if (cellsInput) {
      const cells = cellsInput.value
        .split(",")
        .map((cell) => cell.trim())
        .filter((cell) => cell);

      if (cells.length > 0) {
        queryString += cells
          .map((cell) => `cell=${encodeURIComponent(cell)}`)
          .join("&");
      }
    }

    if (fromInput && toInput) {
      const timeRangeQuery = `start_date=${encodeURIComponent(
        fromInput.value
      )}&end_date=${encodeURIComponent(toInput.value)}`;
      if (queryString) {
        queryString += `&${timeRangeQuery}`;
      } else {
        queryString = timeRangeQuery;
      }
    }

    if (queryString && cellsInput) {
      const dynamicEndpoint =
        sector_id && userPrivilege == "sectorial"
          ? `http://127.0.0.1:8000/api/cell-date-range-cases/?sector=${encodeURIComponent(
              sector_id
            )}&${queryString}`
          : `http://127.0.0.1:8000/api/cell-date-range-cases/?${queryString}`;

      console.log(dynamicEndpoint);

      setEndpoint(dynamicEndpoint);
      setFilter("Cell(s)");
      setFilterDateRange(
        `Time range: From: ${fromInput?.value} To: ${toInput?.value}`
      );
      setFilterValue(cellsInput.value);
    }
  };

  const handleFilter = () => {
    if (cellAndTimeRange) {
      filterByCellsAndTimeRange();
    } else {
      filterByTimeRange();
    }
  };

  const filterEventHandle = () => {
    if (dateFilter && cellsFilter) {
      filterByCellAndDate();
    } else {
      filterByDate();
    }
  };

  const handleDataFetched = (data: any) => {
    setCaseData(data);
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

  const exportToPDF = () => {
    const doc = new jsPDF();

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString();
    var startY = 62;

    doc.setFontSize(15);
    doc.text("Cases Report", 14, 22);
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

    const columns = ["Case Code", "Convict", "Capture Date"];
    const rows = caseData.map((caseItem: any) => [
      caseItem.case_code,
      `${caseItem.child.first_name} ${caseItem.child.last_name}\nage: ${caseItem.child.age}`,
      caseItem.date_of_capture,
    ]);

    doc.autoTable({
      head: [columns],
      body: rows,
      startY: startY,
      styles: { cellPadding: 2, fontSize: 10 },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 50 },
        2: { cellWidth: 70 },
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

    doc.save("cases.pdf");
  };

  const exportToExcel = () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString();

    const sector = localStorage.getItem("sector");

    const headers = [
      ["Cases Report"],
      [`Sector: ${sector}`],
      [filterValue ? `${filter}: [${filterValue}]` : `${filter}`],
      [filterDateRange ? filterDateRange : ""],
      [],
    ];

    const caseDataRows = caseData.map((caseItem: any) => [
      caseItem.case_code,
      `${caseItem.child.first_name} ${caseItem.child.last_name}`,
      caseItem.child.age,
      caseItem.date_of_capture,
    ]);

    const footer = [[], [`Report generated on: ${formattedDate}`]];

    const worksheetData = [
      ...headers,
      ["Case Code", "Convict Name", "Age", "Capture Date"],
      ...caseDataRows,
      ...footer,
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Cases");

    XLSX.writeFile(workbook, "cases.xlsx");
  };

  return (
    <>
      <div className="">
        <div className="mt-3">
          <div className="">
            <div className="w-full">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="text-muted">Cases</h5>
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
                        <option>----------</option>
                        <option value="Date">Date</option>
                        {userPrivilege != "cellular" ? (
                          <option value="Cell">Cell(s)</option>
                        ) : (
                          ""
                        )}
                        <option value="Time range">Date range</option>
                        {userPrivilege != "cellular" ? (
                          <option value="Cell & date">Cell(s) & date</option>
                        ) : (
                          ""
                        )}
                        {userPrivilege != "cellular" ? (
                          <option value="Cell & Time range">
                            Cell(s) & date range
                          </option>
                        ) : (
                          ""
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

              <div className="filters-holder">
                {cellsFilter && (
                  <div>
                    <label htmlFor="">
                      Select cell<small>(</small>s<small>)</small>
                    </label>
                    <div className="d-flex by-cell gap-3">
                      <div className="col-lg-3">
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
                      <div className="col-lg-3">
                        <div className="cells-div">
                          <input
                            name="selected_cells"
                            type="text"
                            className="w-full sel-cells"
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
                                {" "}
                                Nothing selected{" "}
                              </button>
                            ) : (
                              selectedCells.map((cell) => (
                                <button
                                  key={cell.id}
                                  className="cell-btn border"
                                  onClick={() => handleRemoveCell(cell.id)}
                                >
                                  {cell.cellname}{" "}
                                  <small className="f-14 fw-700">&times;</small>
                                </button>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                      {filterBtn && (
                        <div className="col-lg-3">
                          <button
                            className="primary-btn px-3"
                            onClick={filterByCells}
                          >
                            FILTER
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {dateFilter && (
                  <div>
                    <label htmlFor="">Pick date</label>
                    <div className="d-flex by-date gap-3">
                      <div className="col-lg-3">
                        <div className="">
                          <input type="date" className="w-full" name="date" />
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <button
                          className="primary-btn px-3"
                          onClick={filterEventHandle}
                        >
                          FILTER
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {dateRangeFilter && (
                  <div className="mt-2">
                    <label htmlFor="">Pick dates</label>
                    <div className="d-flex by-date gap-3">
                      <div className="col-lg-3">
                        <div className="">
                          <small>
                            <label htmlFor="">From</label>
                          </small>
                          <input type="date" className="w-full" name="from" />
                        </div>
                      </div>

                      <div className="col-lg-3">
                        <div className="">
                          <small>
                            <label htmlFor="">To</label>
                          </small>
                          <input type="date" className="w-full" name="to" />
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <button
                          className="primary-btn px-3 mt-4"
                          onClick={handleFilter}
                        >
                          FILTER
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className=" border rounded p-2 children-th scroll mt-3">
                <CasesComponent
                  endpoint={endpoint}
                  onDataFetched={handleDataFetched}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cases;
