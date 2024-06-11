import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import TextArea from "../../components/TextArea";
import { useState } from "react";
import Button from "../../components/Button";
import { Link } from "react-router-dom";

const FamilyChild = () => {
  const [showForm, setShowForm] = useState(false);
  return (
    <div className="">
      <h5 className="text-muted fw-700">Child Info</h5>

      <div className="d-flex gap-3">
        <div className="p-3 border rounded w-full">
          <div className="flex-box">
            <div className="w-full">
              <h6 className="text-muted fw-700">Child Information</h6>
              <p className="m-0">
                Names: <strong className="fw-500">John Doe</strong>
              </p>
              <p className="m-0">
                ID Number: <strong className="fw-500">123456789876543</strong>
              </p>
              <p className="m-0">
                Age: <strong className="fw-500">17</strong>
              </p>
              <p className="m-0">
                Gender: <strong className="fw-500">Male</strong>
              </p>
            </div>

            <div className="col-md-4">
              <h6 className="text-muted fw-700">Address</h6>
              <p className="m-0">
                District: <strong className="fw-500">John Doe</strong>
              </p>
              <p className="m-0">
                Sector: <strong className="fw-500">John Doe</strong>
              </p>
              <p className="m-0">
                Cell: <strong className="fw-500">John Doe</strong>
              </p>
              <p className="m-0">
                Village: <strong className="fw-500">John Doe</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="p-3 border rounded col-md-4">
          <h6 className="text-muted fw-700">Summary</h6>
          <p className="m-0">
            Recent case:{" "}
            <strong className="fw-500">
              <Link to="/admin/case">RW-GT345678NM</Link> - Marine
            </strong>
          </p>
          <p className="m-0">
            Behaviors: <strong className="fw-500">Good (Improving)</strong>
          </p>
          <p className="m-0">
            Current status: <strong className="fw-500">In school</strong> &nbsp;{" "}
            <button type="button" className="edit-btn" id="edit-btn">
              <FontAwesomeIcon
                icon={faPen}
                className="f-13"
                onClick={() => setShowForm(!showForm)}
              />
            </button>
          </p>

          <div className="mt-3" hidden={!showForm}>
            <form action="" method="post">
              <label htmlFor="" className="">
                Change status to
              </label>
              <div>
                <select name="" id="" className="w-full">
                  <option value="In family">In family</option>
                  <option value="In school">In school</option>
                  <option value="In transit center">In transit center</option>
                  <option value="In rehabilitation center">
                    In rehabilitation center
                  </option>
                  <option value="In street">In street</option>
                </select>
              </div>

              <div className="w-full mt-2">
                <label htmlFor="">Other information</label>
                <TextArea
                  name="other_info"
                  class="w-full"
                  value=""
                  placeholder="Describe child's behaviour"
                />
              </div>

              <Button
                text={"SUBMIT"}
                type={"submit"}
                color={""}
                class={"g-btn primary-btn mt-1"}
              />
            </form>
          </div>
        </div>
      </div>

      <div className="p-3 border rounded w-full mt-3">
        <h6 className="text-muted fw-700">History</h6>

        <div className="flex-box flex-wrap gap-3 mt-2">
          <div className="history ">
            <p className="m-0 f-13">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe
            </p>
            <small className="m-0 fw-700 f-11">23 April, 2024</small>
          </div>

          <div className="history ">
            <p className="m-0 f-13">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe
            </p>
            <small className="m-0 fw-700 f-11">23 April, 2024</small>
          </div>

          <div className="history ">
            <p className="m-0 f-13">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe
            </p>
            <small className="m-0 fw-700 f-11">23 April, 2024</small>
          </div>

          <div className="history ">
            <p className="m-0 f-13">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe
            </p>
            <small className="m-0 fw-700 f-11">23 April, 2024</small>
          </div>

          <div className="history ">
            <p className="m-0 f-13">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe
            </p>
            <small className="m-0 fw-700 f-11">23 April, 2024</small>
          </div>

          <div className="history ">
            <p className="m-0 f-13">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe
            </p>
            <small className="m-0 fw-700 f-11">23 April, 2024</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyChild;
