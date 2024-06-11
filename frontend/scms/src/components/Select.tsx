import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

export interface Categories {
  id: string;
  category: string;
}

export interface Filters {
  cats: Categories[];
}

const Select: React.FC<{ data: Filters }> = ({ data }) => {
  return (
    <div className="select-wrapper border rounded d-flex align-items-center">
      <select name="" id="" className="select">
        <option value="">----------</option>
        {data.cats.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.category}
          </option>
        ))}
      </select>
      <FontAwesomeIcon icon={faFilter} className="select-icon" />
    </div>
  );
};

export default Select;
