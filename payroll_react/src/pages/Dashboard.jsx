import DashboardCard from '../Components/DashboardCard';
import { useState, useEffect } from 'react';

const Dashboard = () => {
  const [totalEmployees, setTotalEmployees] = useState(0);

    useEffect(() => {
    // Replace with your actual backend API URL if needed
    fetch('/api/stats/employees/count')
      .then((res) => res.json())
      .then((data) => {
        setTotalEmployees(data.totalEmployees);
      })
      .catch((err) => {
        console.error('Error fetching employee count:', err);
      });
  }, []);
  return (
    <>
      <main className="container mt-4">
        <h2 className="mb-4">Dashboard Overview</h2>
        <div className="row g-5">
          <div className="col-md-4"><DashboardCard title="Total Employees" value={totalEmployees} bg="primary" /></div>
          <div className="col-md-4"><DashboardCard title="Total Departments" value="8" bg="info" /></div>
          <div className="col-md-4"><DashboardCard title="Leaves Approved" value="45" bg="success" /></div>
          <div className="col-md-4"><DashboardCard title="Leaves Pending" value="12" bg="warning" /></div>
          <div className="col-md-4"><DashboardCard title="Leaves Rejected" value="5" bg="danger" /></div>
          <div className="col-md-4"><DashboardCard title="Calendar" value="5" bg="danger" /></div>
          <div className="col-md-4"><DashboardCard title="Payroll Investment (This Month)" value="₹5,40,000" bg="dark" /></div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;