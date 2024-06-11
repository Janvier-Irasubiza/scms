import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export interface UserProps {
  id: number;
  user_uuid: string;
  username: string;
  email: string;
  phone: string;
  responsability: string;
  office_cell: {
    cell_id: number;
    cell: string;
  };
}

const Users = () => {
  const [users, setUsers] = useState<UserProps[]>([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/ns-users", {
        method: "GET",
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setUsers(response.data);
      });
  }, []);

  return (
    <table className="table">
      <thead>
        <tr>
          <th className="text-muted">Names</th>
          <th className="text-muted">Email/Phone</th>
          <th className="text-muted">Post</th>
          <th className="text-muted">Office cell</th>
          <th className="text-muted text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td className="py-4">
              <strong className="text-muted fw-700">{user.username}</strong>
            </td>
            <td className="py-3">
              <p className="m-0">
                <small>email: </small>
                <strong className="text-muted fw-600">{user.email}</strong>
              </p>
              <p className="m-0">
                <small>phone: </small>
                <strong className="text-muted fw-600">{user.phone}</strong>
              </p>
            </td>
            <td className="py-4">{user.responsability}</td>
            <td className="py-4">{user.office_cell.cell}</td>
            <td className="text-center py-4">
              <Link
                to={`/admin/view-user/${user.user_uuid}`}
                className="py-1 px-3 secondary-btn"
              >
                View
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Users;
