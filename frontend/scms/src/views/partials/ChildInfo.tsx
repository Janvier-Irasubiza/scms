import { useState } from "react";
import axios from "axios";

interface Child {
  id: string;
  identity: number;
  firstname: string;
  lastname: string;
  family: {
    id: number;
  };
  gender: string;
  age: number;
}

interface ChildInfoProps {
  childData: {
    child: string;
    firstName: string;
    lastName: string;
    identity: string;
    gender: string;
    age: string;
    familyId: string;
  };
  onChildDataChange: (data: any) => void;
}

const ChildInfo: React.FC<ChildInfoProps> = ({
  childData,
  onChildDataChange,
}) => {
  const [childrenList, setChildrenList] = useState<Child[]>([]);
  const [showChildren, setShowChildren] = useState(false);

  const handleFirstNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    onChildDataChange({ ...childData, firstName: value });
    if (value || childData.lastName) {
      setShowChildren(true);
      fetchChildren(value, childData.lastName);
    } else {
      setShowChildren(false);
      setChildrenList([]);
    }
  };

  const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    onChildDataChange({ ...childData, lastName: value });
    if (value || childData.firstName) {
      setShowChildren(true);
      fetchChildren(childData.firstName, value);
    } else {
      setShowChildren(false);
      setChildrenList([]);
    }
  };

  const fetchChildren = async (firstName: string, lastName: string) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/children/?first_name=${firstName}&last_name=${lastName}`,
        {
          headers: {
            Authorization: "Token " + localStorage.getItem("token"),
          },
        }
      );

      if (response.data && response.data.length === 0) {
        setChildrenList([]);
      } else {
        setChildrenList(response.data);
        console.log(childrenList);
      }
    } catch (error) {
      console.error("Error fetching children:", error);
      setChildrenList([]);
    }
  };

  const handleChildClick = (child: Child) => {
    const updatedData = {
      child: child.id,
      firstName: child.firstname,
      lastName: child.lastname,
      identity: child.identity.toString(),
      gender: child.gender,
      age: child.age.toString(),
      familyId: child.family.id.toString(),
    };
    onChildDataChange(updatedData);
    setShowChildren(false);

    localStorage.setItem("family_id", child.family.id.toString());
  };

  return (
    <div>
      <h5>Child Information</h5>
      <div>
        <input
          type="hidden"
          value={childData.child}
          className="w-full"
          name="child"
        />
        <div className="w-full flex-box gap-3">
          <div className="w-full">
            <label htmlFor="">First name</label>
            <input
              type="text"
              name="first_name"
              className="w-full"
              value={childData.firstName}
              onChange={handleFirstNameChange}
              placeholder="Enter first name"
              autoFocus
              autoCapitalize="true"
            />
          </div>

          <div className="w-full">
            <label htmlFor="">Last name</label>
            <input
              type="text"
              name="last_name"
              className="w-full"
              value={childData.lastName}
              onChange={handleLastNameChange}
              placeholder="Enter last name"
            />
          </div>
        </div>
        {childrenList.length > 0 && (
          <div
            className="children-container"
            style={{ display: showChildren ? "block" : "none" }}
          >
            <div className="children">
              {childrenList.map((child) => (
                <button
                  key={child.id}
                  type="button"
                  className="child w-full"
                  onClick={() => handleChildClick(child)}
                >
                  <span className="fw-500">
                    {child.firstname} {child.lastname}
                  </span>{" "}
                  | <small className="f-12">{child.identity}</small>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="w-full mt-3">
          <label htmlFor="">ID</label>
          <input
            type="text"
            name="identity"
            className="w-full"
            value={childData.identity}
            onChange={(e) =>
              onChildDataChange({ ...childData, identity: e.target.value })
            }
            placeholder="Enter ID number"
          />
        </div>

        <div className="d-flex gap-3 mt-3">
          <div className="w-full">
            <label htmlFor="" className="">
              Gender
            </label>
            <select
              name="gender"
              id=""
              className="w-full"
              value={childData.gender}
              onChange={(e) =>
                onChildDataChange({ ...childData, gender: e.target.value })
              }
            >
              <option value="">--------</option>
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
              value={childData.age}
              onChange={(e) =>
                onChildDataChange({ ...childData, age: e.target.value })
              }
              placeholder="Enter age"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChildInfo;
