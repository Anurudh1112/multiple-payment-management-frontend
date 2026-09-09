import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const isAdmin = user?.isAdmin === true;

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div>
            <h1>Payment Manager</h1>
            <p>
              Welcome, {user?.username || "User"}
            </p>
          </div>

          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </header>

        <main className="dashboard-content">
          <div className="welcome-card">
            <h2>Manage Your Payments</h2>

            <p>
              Add, view, edit, and delete your payment
              methods from one place.
            </p>

            <button
              type="button"
              onClick={() => navigate("/payments")}
            >
              Manage Payment Methods
            </button>
          </div>

          <div className="dashboard-grid">
            <div className="dashboard-info-card">
              <h3>Account</h3>

              <p>
                <strong>Username:</strong>{" "}
                {user?.username || "-"}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                {user?.email || "-"}
              </p>
            </div>

            <div className="dashboard-info-card">
              <h3>Payment Types</h3>

              <p>Bank</p>
              <p>Paytm</p>
              <p>UPI</p>
              <p>PayPal</p>
              <p>USDT</p>
            </div>
          </div>

          {isAdmin && (
            <div className="admin-card">
              <h2>Admin Panel</h2>

              <p>
                View and manage users' payment information.
              </p>

              <button
                type="button"
                onClick={() => navigate("/admin")}
              >
                Open Admin Dashboard
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;