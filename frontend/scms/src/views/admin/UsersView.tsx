import { Link } from "react-router-dom";
import TextInput from "../../components/TextInput";
import Users from "../../components/Users";

const UsersView = () => {

  return (
    <>
      <div className="">
        <div className="mt-3">
          <div className="">
            <div className="w-full">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="text-muted">Users</h5>
                <Link to="/admin/new-user" className="py-1 px-3 secondary-btn">
                  Create New User
                </Link>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-2 mt-3">
                <div className="w-full d-flex justify-content-end">
                  <TextInput
                    name="username"
                    class=""
                    value=""
                    placeholder="Search"
                  />
                </div>
              </div>

              <div className=" border rounded p-2 children-th scroll">
                <Users />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UsersView;
