import React, { useState } from "react";
import Button from "../../components/Button";
import ChildInfo from "../partials/ChildInfo";
import ParentInfo from "../partials/ParentInfo";
import CaseInfo from "../partials/CaseInfo";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

const ReportCase: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const navigate = useNavigate();

  const [childData, setChildData] = useState({
    child: "",
    firstName: "",
    lastName: "",
    identity: "",
    gender: "",
    age: "",
    familyId: "",
  });

  const [parentsData, setParentsData] = useState<ParentsData>({
    id: "",
    sector: "",
    cell: "",
    fathernames: "",
    mothernames: "",
    mariage_status: "",
    district: "",
    village: "",
  });

  const [caseInfo, setCaseInfo] = useState<CaseInfoProperties>({
    reason: "",
    district_of_capture: "",
    sector_of_capture: 0,
    cell_of_capture: 0,
    village_of_capture: "",
    date_of_capture: "",
    orientation: "",
    other_info: "",
  });

  const handleParentsDataChange = (data: ParentsData) => {
    setParentsData(data);
  };

  const handleCaseInfoChange = (data: CaseInfoProperties) => {
    setCaseInfo(data);
  };

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    let familyInfoRequestData = {};
    let childInfoRequestData = {};
    let caseInfoRequestData = {};

    let familyId = "";
    let childId = "";
    const user = localStorage.getItem("user")!;

    try {
      if (childData.child) {
        caseInfoRequestData = {
          child: childData.child,
          reason_of_capture: caseInfo.reason,
          district_of_capture: caseInfo.district_of_capture,
          sector_of_capture: caseInfo.sector_of_capture,
          cell_of_capture: caseInfo.cell_of_capture,
          village_of_capture: caseInfo.village_of_capture,
          date_of_capture: caseInfo.date_of_capture,
          orientation: caseInfo.orientation,
          case_desc: caseInfo.other_info,
          reported_by: user,
        };

        await axios.post(
          "http://127.0.0.1:8000/api/cases/",
          caseInfoRequestData,
          {
            headers: {
              "Content-Type": "Application/json",
              Authorization: "Token " + localStorage.getItem("token"),
            },
          }
        );
      } else {
        if (parentsData) {
          familyInfoRequestData = {
            sector: parentsData.sector,
            cell: parentsData.cell,
            fathernames: parentsData.fathernames,
            mothernames: parentsData.mothernames,
            mariage_status: parentsData.mariage_status,
            district: parentsData.district,
            village: parentsData.village,
          };

          const familyResponse = await axios.post(
            "http://127.0.0.1:8000/api/families/",
            familyInfoRequestData,
            {
              headers: {
                "Content-Type": "Application/json",
                Authorization: "Token " + localStorage.getItem("token"),
              },
            }
          );

          familyId = familyResponse.data.id;
        }

        if (familyId) {
          childInfoRequestData = {
            firstname: childData.firstName,
            lastname: childData.lastName,
            identity: childData.identity,
            gender: childData.gender,
            age: parseInt(childData.age),
            family: familyId,
          };

          const childResponse = await axios.post(
            "http://127.0.0.1:8000/api/children/",
            childInfoRequestData,
            {
              headers: {
                "Content-Type": "Application/json",
                Authorization: "Token " + localStorage.getItem("token"),
              },
            }
          );

          childId = childResponse.data.id;
        }

        if (childId) {
          caseInfoRequestData = {
            child: childId,
            reason_of_capture: caseInfo.reason,
            district_of_capture: caseInfo.district_of_capture,
            sector_of_capture: caseInfo.sector_of_capture,
            cell_of_capture: caseInfo.cell_of_capture,
            village_of_capture: caseInfo.village_of_capture,
            date_of_capture: caseInfo.date_of_capture,
            orientation: caseInfo.orientation,
            case_desc: caseInfo.other_info,
            reported_by: parseInt(user),
          };

          await axios.post(
            "http://127.0.0.1:8000/api/cases/",
            caseInfoRequestData,
            {
              headers: {
                "Content-Type": "Application/json",
                Authorization: "Token " + localStorage.getItem("token"),
              },
            }
          );

          console.log("Case submitted successfully");
        }
      }

      const userAct = {
        activity:
          "Reported a case for " +
          childData.firstName +
          " " +
          childData.lastName,
        user: user,
      };

      await axios.post(`http://127.0.0.1:8000/api/my-acts/${user}`, userAct, {
        headers: {
          "Content-Type": "Application/json",
          Authorization: "Token " + localStorage.getItem("token"),
        },
      });

      navigate("/admin/cases");
      localStorage.removeItem("family_id");
    } catch (error) {
      console.error("Error submitting case:", error);
    }
  };

  return (
    <div className="">
      <div className="mt-3">
        <div className="flex-box pdg-ntb justify-content-center align-items-center gap-5">
          <div className="col-lg-8 border p-4 rounded">
            <h3 className="text-left">Report new case</h3>
            <form onSubmit={handleSubmit} method="post" className="mt-4">
              {currentPage === 1 && (
                <ChildInfo
                  childData={childData}
                  onChildDataChange={setChildData}
                />
              )}
              {currentPage === 2 && (
                <ParentInfo
                  Info={parentsData}
                  onParentsDataChange={handleParentsDataChange}
                />
              )}
              {currentPage === 3 && (
                <CaseInfo
                  caseInfo={caseInfo}
                  onCaseInfoChange={handleCaseInfoChange}
                />
              )}
              <div className="w-full d-flex justify-content-between mt-3">
                {currentPage > 1 && (
                  <Button
                    text={"PREVIOUS"}
                    type={"button"}
                    color={""}
                    class={"g-btn primary-btn"}
                    onClick={prevPage}
                  />
                )}
                {currentPage < 3 && (
                  <Button
                    text={"NEXT"}
                    type={"button"}
                    color={""}
                    class={"g-btn primary-btn"}
                    onClick={nextPage}
                  />
                )}
                {currentPage === 3 && (
                  <Button
                    text={"SUBMIT"}
                    type={"submit"}
                    color={""}
                    class={"g-btn primary-btn"}
                  />
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCase;
