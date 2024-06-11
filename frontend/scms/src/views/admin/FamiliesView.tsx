import TextInput from "../../components/TextInput";
import Families from "../../components/Families";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";

interface Cell {
  id: number;
  cellname: string;
  sector: string;
}

const FamiliesView = () => {
  const [cellsFilter, showCellsFilter] = useState(false);
  const [selectedCells, setSelectedCells] = useState<Cell[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [cellsIds, setCellsIds] = useState("");
  const [cellsData, setCellsData] = useState<Cell[]>([]);
  const [endpoint, setEndpoint] = useState("");
  const [filter, setFilter] = useState("All families");
  const [filterValue, setFilterValue] = useState("");
  const [famData, setData] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [multiFilter, setMultiFilter] = useState(false);

  const sector_id = localStorage.getItem("sector_id");
  const cell = localStorage.getItem("cell");
  const userPrivilege = localStorage.getItem("user_privilege");

  const cellsUri =
    sector_id && userPrivilege == "sectorial"
      ? `http://127.0.0.1:8000/api/sector-cells/?sector=${encodeURIComponent(
          sector_id
        )}`
      : `http://127.0.0.1:8000/api/cells/`;

  const handleDataFetched = (data: any) => {
    setData(data);
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

  useEffect(() => {
    axios
      .get(cellsUri, {
        method: "GET",
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setCellsData(response.data);
      })
      .catch((error) => {
        console.log("Error fetching data", error);
      });
  }, []);

  const filterByCell = () => {
    const cellsNamesInput = document.querySelector<HTMLInputElement>(
      "input[name=selected_cells]"
    );

    if (cellsNamesInput) {
      const cells = cellsNamesInput.value
        .split(",")
        .map((cellsNamesInput) => cellsNamesInput.trim());
      const cellQueryStr = cells
        .map((cell) => `cell=${encodeURIComponent(cell)}`)
        .join("&");

      const cellUri = `http://127.0.0.1:8000/api/cell-families/?${cellQueryStr}`;

      console.log(cellUri);

      setEndpoint(cellUri);
      setFilter("Cell(s)");
      cellsNamesInput?.value
        ? setFilterValue(cellsNamesInput?.value)
        : setFilterValue("");
    }
  };

  const filterByStatus = () => {
    const statusInput = document.querySelector<HTMLInputElement>(
      "select[name=status]"
    );

    if (statusInput) {
      const qryStr =
        cell && userPrivilege == "cellular"
          ? `http://127.0.0.1:8000/api/cell-families-by-status/?cell=${encodeURIComponent(
              cell
            )}&status=${encodeURIComponent(statusInput.value)}`
          : `http://127.0.0.1:8000/api/families-by-status/?status=${encodeURIComponent(
              statusInput.value
            )}`;

      setEndpoint(qryStr);
      setFilter("Status");
      setFilterValue("");
    }
  };

  const filterByCellAndStatus = () => {
    const cellsNamesInput = document.querySelector<HTMLInputElement>(
      "input[name=selected_cells]"
    );

    const statusInput = document.querySelector<HTMLInputElement>(
      "select[name=status]"
    );

    if (cellsNamesInput && statusInput) {
      const cells = cellsNamesInput.value
        .split(",")
        .map((cellsNamesInput) => cellsNamesInput.trim());
      const cellQueryStr = cells
        .map((cell) => `cell=${encodeURIComponent(cell)}`)
        .join("&");

      const cellUri = `http://127.0.0.1:8000/api/families-by-cell-and-status/?${cellQueryStr}&status=${encodeURIComponent(
        statusInput.value
      )}`;
      setEndpoint(cellUri);
      setFilter("Cell(s)");
      cellsNamesInput?.value
        ? setFilterValue(cellsNamesInput?.value)
        : setFilterValue("");
    }
  };

  const handleSelectCellFilter = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedCellId = parseInt(event.target.value);
    const selectedCell = cellsData.find((cell) => cell.id === selectedCellId);

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

  const showCellFilter = (event: any) => {
    const select = event.target.value;

    if (select == "cell") {
      showCellsFilter(true);
      setShowStatusFilter(false);
      setMultiFilter(true);
    } else if (select == "status") {
      setShowStatusFilter(true);
      showCellsFilter(false);
    } else if (select == "cells and status") {
      setShowStatusFilter(true);
      showCellsFilter(true);
      setMultiFilter(false);
    } else {
      showCellsFilter(false);
      setShowStatusFilter(false);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString();
    var startY = 56;

    doc.setFontSize(15);
    doc.text("Families Report", 14, 22);
    doc.setFontSize(11);
    doc.text(`Sector: ${localStorage.getItem("sector")}`, 14, 30);
    filterValue
      ? doc.text(`${filter}: [${filterValue}]`, 14, 38)
      : doc.text(`${filter}`, 14, 38);

    const columns = [
      "Parent(s) names",
      "Marriage status",
      "Residence address",
      "Children",
    ];

    const rows = famData.map((fam: any) => [
      `Father: ${fam.fathernames}\nMother: ${fam.mothernames}`,
      fam.mariage_status,
      `Cell: ${fam.cell}\Village: ${fam.village}`,
      fam.children,
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

    doc.save("Families.pdf");
  };

  const exportToExcel = () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString();

    const sector = localStorage.getItem("sector");

    const headers = [
      ["Family Report"],
      [`Sector: ${sector}`],
      [filterValue ? `${filter}: [${filterValue}]` : `${filter}`],
      [],
    ];

    const childrenDataRows = famData.map((fam: any) => [
      `Father: ${fam.fathernames}\nMother: ${fam.mothernames}`,
      fam.mariage_status,
      `Cell: ${fam.cell}\Village: ${fam.village}`,
      fam.children,
    ]);

    const footer = [[], [`Report generated on: ${formattedDate}`]];

    const worksheetData = [
      ...headers,
      ["Parent(s) names", "Marriage status", "Residence address", "Children"],
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
              <h5 className="text-muted">Families</h5>

              <div className="d-flex justify-content-between align-items-center mb-2 mt-3">
                <div className="d-flex align-items-center gap-3 w-full">
                  <h5 className="text-muted f-16">Filter by </h5>
                  <div className="">
                    <select
                      name=""
                      id=""
                      className=""
                      onChange={showCellFilter}
                    >
                      <option value="">----------</option>
                      {userPrivilege != "cellular" ? (
                        <option value="cell">Cell(s)</option>
                      ) : (
                        ""
                      )}
                      <option value="status">Status</option>
                      {userPrivilege != "cellular" ? (
                        <option value="cells and status">
                          Cell(s) & Status
                        </option>
                      ) : (
                        ""
                      )}
                    </select>
                  </div>
                  <div className="">
                    <TextInput
                      name="username"
                      class="search-box"
                      value=""
                      placeholder="Search"
                    />
                  </div>
                </div>
                <div className="w-full  d-flex justify-content-end align-items-center gap-3">
                  <div>
                    <div className="w-full">
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

              <div className="filters-holder flex-box gap-3 mb-2">
                <div className="w-full">
                  {cellsFilter && (
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
                            {cellsData.map((cell) => (
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

                        <div className="col-lg-6 d-flex align-items-flex-end">
                          {multiFilter && (
                            <div>
                              <button
                                className="primary-btn px-3"
                                onClick={filterByCell}
                              >
                                FILTER
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {showStatusFilter && (
                <div className="col-lg-6">
                  <div>
                    <p className="m-0">Select status</p>
                    <div className="mt-1 d-flex gap-3">
                      <select
                        name="status"
                        className="w-full"
                        // onChange={handleInputChange}
                      >
                        <option value="">--------</option>
                        <option value="Critical">Critical</option>
                        <option value="Improving">Improving</option>
                        <option value="Cleared">Cleared</option>
                        <option value="Dangerous">Dangerous</option>
                      </select>

                      <div>
                        <button
                          className="primary-btn px-3"
                          onClick={
                            multiFilter ? filterByCellAndStatus : filterByStatus
                          }
                        >
                          FILTER
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-2 border rounded p-2 children-th scroll">
                <Families
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

export default FamiliesView;
