const DashboardCard = ({ title, value, bg = "primary" }) => {
  return (
    <div className={`card text-white bg-${bg} mb-3`} style={{ minWidth: "12rem" }}>
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <h3 className="card-text">{value}</h3>
      </div>
    </div>
  );
};

export default DashboardCard;