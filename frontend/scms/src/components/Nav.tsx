import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Nav = () => {
  const location = useLocation();
  const getItemPath = location.pathname;

  const [activeItem, setActiveItem] = useState(getItemPath);

  useEffect(() => {
    setActiveItem(getItemPath);
  }, [getItemPath]);

  const handleItemClick = (itemName: string) => {
    setActiveItem(itemName);
  };

  return (
    <nav className="pdg">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h2 className="bg-ghw">SCMS</h2>
        </div>
        <div>
          <ul className="nav-links">
            <li>
              <Link
                to="/"
                className={`${activeItem === "/" ? "active" : ""}`}
                onClick={() => handleItemClick("/")}
              >
                <span className="mt-5">Home</span>
              </Link>
            </li>
            <li>
              <Link
                to="/testmonials"
                className={`${activeItem === "/testmonials" ? "active" : ""}`}
                onClick={() => handleItemClick("/testmonials")}
              >
                Testimonials
              </Link>
            </li>
            <li>
              <Link
                to="/statistics"
                className={`${activeItem === "/statistics" ? "active" : ""}`}
                onClick={() => handleItemClick("/statistics")}
              >
                Statistics
              </Link>
            </li>
            <li>
              <Link
                className={`${activeItem === "/auth" ? "active" : ""}`}
                to="/auth"
              >
                Sign In
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
