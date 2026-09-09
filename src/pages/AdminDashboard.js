import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const paymentTypes = ["All", "Bank", "Paytm", "UPI", "PayPal", "USDT"];

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    username: "",
    paymentType: "All",
    bankName: "",
    ifscCode: "",
    paytmNumber: "",
    upiId: "",
    paypalEmail: "",
    usdtWalletAddress: "",
  });

  const fetchUsers = async (currentFilters = filters) => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      if (currentFilters.username) {
        params.username = currentFilters.username;
      }

      if (currentFilters.paymentType !== "All") {
        params.paymentType = currentFilters.paymentType;
      }

      if (currentFilters.bankName) {
        params.bankName = currentFilters.bankName;
      }

      if (currentFilters.ifscCode) {
        params.ifscCode = currentFilters.ifscCode;
      }

      if (currentFilters.paytmNumber) {
        params.paytmNumber = currentFilters.paytmNumber;
      }

      if (currentFilters.upiId) {
        params.upiId = currentFilters.upiId;
      }

      if (currentFilters.paypalEmail) {
        params.paypalEmail = currentFilters.paypalEmail;
      }

      if (currentFilters.usdtWalletAddress) {
        params.usdtWalletAddress =
          currentFilters.usdtWalletAddress;
      }

      const response = await API.get("/admin/users/payments", {
        params,
      });

      setUsers(response.data.users || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load admin data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(filters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      username: "",
      paymentType: "All",
      bankName: "",
      ifscCode: "",
      paytmNumber: "",
      upiId: "",
      paypalEmail: "",
      usdtWalletAddress: "",
    };

    setFilters(clearedFilters);
    fetchUsers(clearedFilters);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const renderPaymentDetails = (payment) => {
    switch (payment.paymentType) {
      case "Bank":
        return (
          <>
            <p>
              <strong>Bank:</strong>{" "}
              {payment.bankName || "-"}
            </p>
            <p>
              <strong>Branch:</strong>{" "}
              {payment.branchName || "-"}
            </p>
            <p>
              <strong>IFSC:</strong>{" "}
              {payment.ifscCode || "-"}
            </p>
            <p>
              <strong>Account:</strong>{" "}
              {payment.accountNumber || "-"}
            </p>
            <p>
              <strong>Holder:</strong>{" "}
              {payment.accountHolderName || "-"}
            </p>
          </>
        );

      case "Paytm":
        return (
          <p>
            <strong>Paytm Number:</strong>{" "}
            {payment.paytmNumber || "-"}
          </p>
        );

      case "UPI":
        return (
          <p>
            <strong>UPI ID:</strong>{" "}
            {payment.upiId || "-"}
          </p>
        );

      case "PayPal":
        return (
          <p>
            <strong>PayPal Email:</strong>{" "}
            {payment.paypalEmail || "-"}
          </p>
        );

      case "USDT":
        return (
          <p>
            <strong>Wallet:</strong>{" "}
            {payment.usdtWalletAddress || "-"}
          </p>
        );

      default:
        return null;
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <header className="dashboard-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Manage users and payment information</p>
          </div>

          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </header>

        {/* Filters */}
        <div className="admin-filter-card">
          <h2>Search & Filter</h2>

          <form onSubmit={handleSearch}>
            <div className="admin-filter-grid">
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={filters.username}
                  onChange={handleFilterChange}
                  placeholder="Search username"
                />
              </div>

              <div className="form-group">
                <label>Payment Type</label>
                <select
                  name="paymentType"
                  value={filters.paymentType}
                  onChange={handleFilterChange}
                >
                  {paymentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Bank Name</label>
                <input
                  type="text"
                  name="bankName"
                  value={filters.bankName}
                  onChange={handleFilterChange}
                  placeholder="Search bank"
                />
              </div>

              <div className="form-group">
                <label>IFSC Code</label>
                <input
                  type="text"
                  name="ifscCode"
                  value={filters.ifscCode}
                  onChange={handleFilterChange}
                  placeholder="Search IFSC"
                />
              </div>

              <div className="form-group">
                <label>Paytm Number</label>
                <input
                  type="text"
                  name="paytmNumber"
                  value={filters.paytmNumber}
                  onChange={handleFilterChange}
                  placeholder="Search Paytm number"
                />
              </div>

              <div className="form-group">
                <label>UPI ID</label>
                <input
                  type="text"
                  name="upiId"
                  value={filters.upiId}
                  onChange={handleFilterChange}
                  placeholder="Search UPI ID"
                />
              </div>

              <div className="form-group">
                <label>PayPal Email</label>
                <input
                  type="text"
                  name="paypalEmail"
                  value={filters.paypalEmail}
                  onChange={handleFilterChange}
                  placeholder="Search PayPal email"
                />
              </div>

              <div className="form-group">
                <label>USDT Address</label>
                <input
                  type="text"
                  name="usdtWalletAddress"
                  value={filters.usdtWalletAddress}
                  onChange={handleFilterChange}
                  placeholder="Search wallet address"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit">
                Search
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={handleClearFilters}
              >
                Clear Filters
              </button>
            </div>
          </form>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Results */}
        <div className="admin-results">
          <div className="admin-results-header">
            <h2>Users & Payment Information</h2>

            <span>
              {users.length} user
              {users.length !== 1 ? "s" : ""}
            </span>
          </div>

          {loading ? (
            <div className="empty-state">
              <p>Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="empty-state">
              <p>No matching users or payment methods found.</p>
            </div>
          ) : (
            <div className="admin-user-list">
              {users.map((item) => (
                <div
                  className="admin-user-card"
                  key={item.user.id}
                >
                  <div className="admin-user-header">
                    <div>
                      <h3>{item.user.username}</h3>
                      <p>{item.user.email}</p>
                    </div>

                    <span className="user-badge">
                      {item.paymentMethods.length} payment
                      {item.paymentMethods.length !== 1
                        ? "s"
                        : ""}
                    </span>
                  </div>

                  <div className="admin-payment-list">
                    {item.paymentMethods.map((payment) => (
                      <div
                        className="admin-payment-card"
                        key={payment._id}
                      >
                        <span className="payment-type">
                          {payment.paymentType}
                        </span>

                        <div className="payment-details">
                          {renderPaymentDetails(payment)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;