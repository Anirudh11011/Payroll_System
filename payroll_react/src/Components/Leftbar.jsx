import { Link } from "react-router-dom";

const Leftbar = () => {
  return (
    <div className="bg-dark text-white vh-100 p-3" style={{ width: "250px" }}>
      <h2 className="fs-4 mb-4">Payroll System</h2>
      <ul className="nav flex-column">
        <li className="nav-item mb-2">
          <Link className="nav-link text-white" to="/">
            Dashboard
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link className="nav-link text-white" to="/employees">
            Employees
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link className="nav-link text-white" to="/payroll">
            Payroll
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link className="nav-link text-white" to="/settings">
            Settings
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Leftbar;