import React from "react";
import TextInput from "../../components/TextInput";

const ProfileInfo: React.FC = () => {
      
  return (
    <div>
      <h5>User Information</h5>
      <div className="mt-3">
        <div className="w-full">
            <label htmlFor="">Names</label>
            <TextInput
                name="username"
                class="w-full"
                value=""
                placeholder="Enter Names"
                />
            </div>

            <div className="d-flex gap-3 mt-3">
                <div className="w-full">
                    <label htmlFor="" className="">Email</label>
                    <TextInput
                        name="email"
                        class="w-full"
                        value=""
                        placeholder="Enter email"
                    />
                </div>

                <div className="w-full">
                    <label htmlFor="">Phone number</label>
                    <TextInput
                        name="phone"
                        class="w-full"
                        value=""
                        placeholder="Enter phone number"
                    />
                </div>
            </div>

            <div className="d-flex gap-3 mt-3">
                <div className="w-full">
                    <label htmlFor="" className="">Gender</label>
                    <select name="" id="" className="w-full">
                        <option value="Female">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>

                <div className="w-full">
                    <label htmlFor="">Age</label>
                    <TextInput
                        name="username"
                        class="w-full"
                        value=""
                        placeholder="Enter age"
                    />
                </div>
            </div>
        </div>
    </div>
  );
};

export default ProfileInfo;
