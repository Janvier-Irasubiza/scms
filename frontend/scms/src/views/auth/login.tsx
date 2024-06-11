import TextInput from "../../components/TextInput";
import { useState } from "react";
import Password from "../../components/Password";
import CheckBox from "../../components/CheckBox";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import Nav from "../../components/Nav";

const login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setUsernameError("");
    setPasswordError("");

    let isValid = true;
    if (!username) {
      setUsernameError("Email is required");
      isValid = false;
    }
    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    }

    if (isValid) {
      setIsLoading(true);
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/login/",
          { username, password },
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status == 200 || response.status == 201) {
          if (response.data.user.sector != null) {
            localStorage.setItem("sector", response.data.user.sector.sector);
            localStorage.setItem("sector_id", response.data.user.sector.id);
          } else {
            localStorage.removeItem("sector");
            localStorage.removeItem("sector_id");
          }

          if (response.data.user.cell != null) {
            localStorage.setItem("cell", response.data.user.cell.cell);
            localStorage.setItem("cell_id", response.data.user.cell.id);
          } else {
            localStorage.removeItem("cell");
            localStorage.removeItem("cell_id");
          }

          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", response.data.user.id);
          localStorage.setItem("user_id", response.data.user.uuid);
          localStorage.setItem("user_privilege", response.data.user.privilege);

          let dashboard_url =
            response.data.user.privilege == "sectorial" ||
            response.data.user.privilege == "cellular"
              ? "/admin/dashboard"
              : "/rehab/dashboard";

          navigate(dashboard_url);
        } else if (response.status == 401) {
          setError("Invalid credentials");
        } else {
          console.log("Failed to authenticate", response.data.error);
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
    }
  };

  return (
    <>
      {/* <Nav /> */}
      <div className="flex-box pdg-ntb justify-content-center align-items-center gap-5 min-vh-80">
        <div className="col-lg-5">
          <div className="border py-4 px-5 rounded">
            <h3 className="text-center">SCMS - Login</h3>

            <form onSubmit={handleAuth} method="post" className="mt-5">
              <div>
                <label htmlFor="">Username</label>
                <TextInput
                  name="username"
                  class="w-full"
                  value={username}
                  placeholder="Enter username"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {usernameError && (
                <div className="mt-1 text-red-500 text-danger f-14">
                  {usernameError}
                </div>
              )}

              <div className="mt-3">
                <div className="d-flex justify-content-between">
                  <label htmlFor="">Password</label>
                  {/* <Link to="" className="sm-link">
                    Forgot your password?{" "}
                  </Link> */}
                </div>
                <Password
                  name="username"
                  class="w-full"
                  value={password}
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                  required="required"
                />
              </div>
              {passwordError && (
                <div className="mt-1 text-red-500 f-14 text-danger">
                  {passwordError}
                </div>
              )}

              <div className="mt-3">
                {error && (
                  <div className="mt-3 text-red-500 f-14 text-danger">
                    {error}
                  </div>
                )}
              </div>

              <div className="mt-4 d-flex justify-content-between align-items-center">
                <div className="d-flex gap-2">
                  <CheckBox name="remember_me" value="remember me" />
                  Keep me signed in
                </div>
                <div>
                  <Button
                    text={isLoading ? "LOGGING IN..." : "LOGIN"}
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
      </div>
    </>
  );
};

export default login;
