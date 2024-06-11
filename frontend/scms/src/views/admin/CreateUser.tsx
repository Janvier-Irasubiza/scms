import { useState } from "react";
import axios from "axios";
import Button from "../../components/Button";
import UserInfo from "../partials/UserInfo";
import { ChangeEvent } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const CreateUser = () => {
  const [errorMsg, setErrorMsg] = useState("");
  const [usernameMsg, setUsernameMsg] = useState("");
  const [emailMsg, setEmailMsg] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [link, setLink] = useState("");

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    username: "",
    identity: "",
    gender: "",
    age: "",
    office_sector: "",
    office_cell: "",
    privilege: "cellular",
    responsability: "",
    address: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: ["identity", "office_cell", "office_sector", "age"].includes(name)
        ? parseInt(value, 10) || 0
        : value,
    });
  };

  const createUserAccount = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/ns-users/",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        const successMsg =
          response.data.username + "'s account successfully created";
        localStorage.setItem("successMsg", successMsg);
        setErrorMsg("");
        setLink(
          `http://localhost:5173/change-password/${response.data.user_uuid}`
        );
        setShowModal(!showModal);
      }
    } catch (error: any) {
      console.error("Error");

      if (error.response) {
        const response = error.response;
        if (response.status === 400) {
          response.data.email
            ? setEmailMsg(response.data.email)
            : setEmailMsg("");
          response.data.username
            ? setUsernameMsg(response.data.email)
            : setUsernameMsg("");
        } else {
          setErrorMsg("Something went wrong, try again");
        }
      }
    }
  };

  const sendMail = () => {
    const recipientEmail = formData.email;
    const subject = encodeURIComponent("Password creation");
    const body = encodeURIComponent(
      `Click to the following link to create a password for your account.\n\n${link}`
    );
    window.open(
      `https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1&to=${recipientEmail}&su=${subject}&body=${body}`,
      "_blank"
    );
    setShowModal(!showModal);
    clearForm();
  };

  const clearForm = () => {
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      username: "",
      identity: "",
      gender: "",
      age: "",
      office_sector: "",
      office_cell: "",
      privilege: "cellular",
      responsability: "",
      address: "",
    });
  };

  return (
    <div className="">
      <div className="mt-3">
        {showModal && (
          <>
            <div
              className="modal-backdrop fade show"
              style={{ display: "block" }}
            ></div>

            <div
              className="modal fade show"
              style={{ display: "block" }}
              tabIndex={-1}
              role="dialog"
              aria-labelledby="sendMail"
              aria-hidden="true"
            >
              <div
                className="modal-dialog modal-dialog-centered"
                role="document"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-content">
                  <div className="modal-header d-flex justify-content-between align-items-center">
                    <h6 className="modal-title" id="exampleModalLongTitle">
                      Successfully created {formData.username}'s account
                    </h6>
                  </div>
                  <div className="modal-body">
                    send a password creation link
                    <div className="d-flex gap-3 w-full align-items-center mt-2">
                      <div className="py-1 px-2 border rounded w-full m-link">
                        <p className="m-0 text-muted">{link}</p>
                      </div>
                      <div className="col-md-3">
                        <button
                          type="button"
                          className="btn btn-primary py-1 w-full"
                          onClick={sendMail}
                        >
                          Send mail
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="flex-box pdg-ntb justify-content-center align-items-center gap-5">
          <div className="col-lg-8 border p-4 rounded">
            <h3 className="text-left">Create new user account</h3>
            <form onSubmit={createUserAccount} method="post" className="mt-4">
              <UserInfo
                formData={formData}
                handleChange={handleChange}
                emailMsg={emailMsg}
                usernameMsg={usernameMsg}
              />

              {errorMsg && (
                <div className="alert alert-danger mt-3 p-2" role="alert">
                  <p className="m-0 text-muted f-14">{errorMsg}</p>
                </div>
              )}

              <div className="w-full d-flex justify-content-between mt-3">
                <Button
                  text={"CREATE ACCOUNT"}
                  type={"submit"}
                  color={""}
                  class={"g-btn primary-btn mt-2 px-3"}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;
