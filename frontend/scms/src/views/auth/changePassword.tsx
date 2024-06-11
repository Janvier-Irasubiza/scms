import { useEffect, useState } from "react";
import Password from "../../components/Password";
import Button from "../../components/Button";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

interface User {
  id: number;
  uuid: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
}

const ChangePassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const [userData, setUserData] = useState<User | null>(null);

  const { uuid } = useParams();

  if (uuid) {
    useEffect(() => {
      axios
        .get(`http://127.0.0.1:8000/api/user-uuid/${encodeURIComponent(uuid)}`)
        .then((response) => {
          setUserData(response.data);
        })
        .catch((error) => {
          console.log("Error fetching user data", error);
        });
    }, []);
  }

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setNewPasswordError("");
    setConfirmPasswordError("");

    let isValid = true;
    if (!newPassword) {
      setNewPasswordError("New password is required");
      isValid = false;
    }
    if (!confirmPassword) {
      setConfirmPasswordError("You need to confirm you password");
      isValid = false;
    }

    if (isValid) {
      if (newPassword == confirmPassword && uuid) {
        setIsLoading(true);
        try {
          const response = await axios.put(
            `http://127.0.0.1:8000/api/change-password/${encodeURIComponent(
              uuid
            )}/`,
            {
              password: newPassword,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (response.status === 200) {
            navigate("/auth/");
          } else {
            console.log("Failed to change your password", response.data.error);
          }
        } catch (error: any) {
          if (error.response) {
            setError(error.response.data.status);
            console.log(error.response.data.status);
          } else {
            setError("An unexpected error occurred, Please try again");
          }
        } finally {
          setIsLoading(false);
        }
      } else {
        setError("Passwords do not match!");
      }
    }
  };

  return (
    <div className="flex-box pdg-ntb justify-content-center align-items-center gap-5 min-vh-80">
      <div className="col-lg-5 p-5">
        <div className="d-flex justify-content-between border rounded py-2 px-3 align-items-center">
          <div className="d-flex gap-4 align-items-center">
            <div>JK</div>
            <div>
              <h6 className="m-0">
                {userData?.first_name} {userData?.last_name}
              </h6>
            </div>
          </div>
          <div>
            <h6 className="m-0">username: {userData?.username}</h6>
          </div>
        </div>

        <div className="mt-4">
          <h6>Set password</h6>
        </div>

        <form onSubmit={handleChangePassword} method="post" className="mt-1">
          <div>
            <label htmlFor="">
              <small>New password</small>
            </label>
            <Password
              name="username"
              class="w-full mt-1"
              value={newPassword}
              placeholder="Enter your password"
              onChange={(e) => setNewPassword(e.target.value)}
              required="required"
            />
          </div>

          {newPasswordError && (
            <div className="mt-1 text-red-500 text-danger f-14">
              {newPasswordError}
            </div>
          )}

          <div className="mt-3">
            <div className="d-flex justify-content-between">
              <label htmlFor="">
                <small>Confirm Password</small>
              </label>
            </div>
            <Password
              name="username"
              class="w-full mt-1"
              value={confirmPassword}
              placeholder="Re-enter your password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required="required"
            />
          </div>
          {confirmPasswordError && (
            <div className="mt-1 text-red-500 f-14 text-danger">
              {confirmPasswordError}
            </div>
          )}

          <div className="mt-3">
            {error && (
              <div className="mt-3 text-red-500 f-14 text-danger">{error}</div>
            )}
          </div>

          <div className="mt-4 d-flex justify-content-between align-items-center">
            <div>
              <Button
                text={isLoading ? "LOGGING IN..." : "CHANGE PASSWORD"}
                type={"submit"}
                color={""}
                class={"g-btn primary-btn f-12"}
                disabled={isLoading}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
