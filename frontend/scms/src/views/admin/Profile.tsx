import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface UserInfoProps {
  id: number;
  user_uuid: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  username: string;
  identity: number;
  gender: string;
  age: number;
}

const Profile = () => {
  const user = localStorage.getItem("user_id");
  const [userInfo, setUserInfo] = useState<UserInfoProps | null>(null);
  const [hasChange, setHasChange] = useState(false);
  const [hasPasswordChange, setHasPasswordChange] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [usernameMsg, setUsernameMsg] = useState("");
  const [emailMsg, setEmailMsg] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const userPrivilege = localStorage.getItem("user_privilege");

  useEffect(() => {
    if (user) {
      axios
        .get(`http://127.0.0.1:8000/api/profile/${encodeURIComponent(user)}`, {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          setUserInfo(response.data);
        });
    }
  }, [user]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserInfo((prevUserInfo: UserInfoProps | null) => {
      if (prevUserInfo) {
        return {
          ...prevUserInfo,
          [name]: value,
        };
      }
      return null;
    });
    setHasChange(true);
  };

  const updateProfile = async () => {
    if (userInfo?.user_uuid) {
      try {
        const response = await axios.put(
          `http://127.0.0.1:8000/api/profile/${encodeURIComponent(
            userInfo?.user_uuid
          )}/`,
          userInfo,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.status === 200 || response.status === 201) {
          setMessage("Successfully updated user info");
          setHasChange(false);
        }
      } catch (error: any) {
        if (error.response) {
          const response = error.response;
          console.log(response);
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
    }
  };

  const changePassword = async () => {
    const oldPasswordInput = document.querySelector<HTMLInputElement>(
      "input[name=old_password]"
    );

    const newPasswordInput = document.querySelector<HTMLInputElement>(
      "input[name=new_password]"
    );

    const confirmPasswordInput = document.querySelector<HTMLInputElement>(
      "input[name=confirm_password]"
    );

    if (oldPasswordInput && newPasswordInput && confirmPasswordInput) {
      if (
        newPasswordInput.value == confirmPasswordInput.value &&
        userInfo?.user_uuid
      ) {
        try {
          const response = await axios.put(
            `http://127.0.0.1:8000/api/update-password/${encodeURIComponent(
              userInfo?.user_uuid
            )}/`,
            {
              old_password: oldPasswordInput.value,
              new_password: newPasswordInput.value,
            },
            {
              headers: {
                Authorization: `Token ${localStorage.getItem("token")}`,
              },
            }
          );

          if (response.status == 200) {
            navigate('/auth/');
          }
        } catch (error: any) {
          if (error.response) {
            const response = error.response;
            response.data.error
              ? setPasswordMsg(response.data.error)
              : setPasswordMsg(response.data.detail);
          }
          setSuccess(false);
        }
      } else {
        setPasswordMsg("Passwords do not match");
      }
    }
  };

  const handlePasswordChange = () => {
    setHasPasswordChange(true);
  };

  return (
    <div className={`${userPrivilege !== 'rehab' ? '' : 'py-4 px-5'}`}>
      <h3 className="text-left">Personal Info</h3>
      <div className="flex-box gap-3">
        <div className="w-full border p-4 rounded">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateProfile();
            }}
            method="post"
            className=""
          >
            <div>
              <h5>User Information</h5>
              <div className="mt-3">
                <div className="flex-box gap-3">
                  <div className="w-full">
                    <label htmlFor="">First name</label>
                    <input
                      type="text"
                      name="first_name"
                      className="w-full"
                      defaultValue={userInfo?.first_name}
                      placeholder="Enter first name"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="w-full">
                    <label htmlFor="">Last name</label>
                    <input
                      type="text"
                      name="last_name"
                      className="w-full"
                      defaultValue={userInfo?.last_name}
                      placeholder="Enter last name"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="d-flex gap-3 mt-3">
                  <div className="w-full">
                    <label htmlFor="" className="">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="w-full"
                      defaultValue={userInfo?.email}
                      placeholder="Enter email"
                      required
                      onChange={handleChange}
                    />
                  </div>

                  <div className="w-full">
                    <label htmlFor="">Username</label>
                    <input
                      type="text"
                      name="username"
                      className="w-full"
                      defaultValue={userInfo?.username}
                      placeholder="Enter username"
                      required
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {emailMsg && (
                  <div className="mt-1 text-red-500 f-14 text-danger">
                    {emailMsg}
                  </div>
                )}

                {usernameMsg && (
                  <div className="mt-1 text-red-500 f-14 text-danger">
                    {usernameMsg}
                  </div>
                )}

                <div className="d-flex gap-3 mt-3">
                  <div className="w-full">
                    <label htmlFor="">Phone number</label>
                    <input
                      type="text"
                      name="phone"
                      className="w-full"
                      defaultValue={userInfo?.phone}
                      placeholder="Enter phone number"
                      required
                      onChange={handleChange}
                    />
                  </div>

                  <div className="w-full d-flex gap-3">
                    <div className="w-full">
                      <label htmlFor="" className="">
                        Gender
                      </label>
                      <select
                        name="gender"
                        id=""
                        className="w-full"
                        value={userInfo?.gender}
                        required
                        onChange={handleChange}
                      >
                        <option value="">-------------</option>
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
                        defaultValue={userInfo?.age}
                        placeholder="Enter age"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {message && (
              <div className="alert alert-primary mt-3 p-2" role="alert">
                <p className="m-0 text-muted f-14">{message}</p>
              </div>
            )}

            {errorMsg && (
              <div className="alert alert-danger mt-3 p-2" role="alert">
                <p className="m-0 text-muted f-14">{errorMsg}</p>
              </div>
            )}

            <div className="w-full d-flex justify-content-between mt-4">
              <button
                type={"submit"}
                disabled={!hasChange}
                className={`g-btn px-3 ${
                  hasChange ? "primary-btn" : "muted-btn"
                }`}
              >
                SAVE CHANGES
              </button>
            </div>
          </form>
        </div>

        <div className="w-full border p-4 rounded">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              changePassword();
            }}
            method="post"
            className=""
          >
            <h5>Change password</h5>
            <div className="w-full mt-3">
              <label htmlFor="">Old Password</label>
              <input
                type="password"
                name="old_password"
                className="w-full"
                placeholder="Enter current password"
                required
                onChange={handlePasswordChange}
              />
            </div>

            <div className="w-full mt-3">
              <label htmlFor="">New Password</label>
              <input
                type="password"
                name="new_password"
                className="w-full"
                placeholder="Enter new password"
                required
                onChange={handlePasswordChange}
              />
            </div>

            <div className="w-full mt-3">
              <label htmlFor="">Confirm Password</label>
              <input
                type="password"
                name="confirm_password"
                className="w-full"
                placeholder="Re-enter your password"
                required
                onChange={handlePasswordChange}
              />
            </div>

            {passwordMsg && (
              <div
                className={`alert ${
                  success ? `alert-success` : `alert-danger`
                } mt-3 p-2`}
                role="alert"
              >
                <p className="m-0 text-muted f-14">{passwordMsg}</p>
              </div>
            )}

            <div className="w-full d-flex justify-content-end mt-4">
              <button
                type="submit"
                disabled={!hasPasswordChange}
                className={`g-btn px-3 ${
                  hasPasswordChange ? "primary-btn" : "muted-btn"
                }`}
              >
                CHANGE PASSWORD
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
