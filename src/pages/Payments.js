import React, { useEffect, useState } from "react";
import API from "../services/api";

const paymentTypes = ["Bank", "Paytm", "UPI", "PayPal", "USDT"];

const emptyForm = {
  paymentType: "Bank",
  ifscCode: "",
  branchName: "",
  bankName: "",
  accountNumber: "",
  accountHolderName: "",
  paytmNumber: "",
  upiId: "",
  paypalEmail: "",
  usdtWalletAddress: "",
};

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Fetch payment methods
  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/payments");

      setPayments(response.data.paymentMethods || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load payment methods"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Change payment type
  const handlePaymentTypeChange = (e) => {
    setFormData({
      ...emptyForm,
      paymentType: e.target.value,
    });
  };

  // Submit add/update
  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    try {
      if (editingId) {
        await API.put(`/payments/${editingId}`, formData);

        setMessage("Payment method updated successfully");
      } else {
        await API.post("/payments", formData);

        setMessage("Payment method added successfully");
      }

      setFormData(emptyForm);
      setEditingId(null);

      await fetchPayments();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to save payment method"
      );
    } finally {
      setSaving(false);
    }
  };

  // Edit payment
  const handleEdit = (payment) => {
    setEditingId(payment._id);

    setFormData({
      paymentType: payment.paymentType || "Bank",
      ifscCode: payment.ifscCode || "",
      branchName: payment.branchName || "",
      bankName: payment.bankName || "",
      accountNumber: payment.accountNumber || "",
      accountHolderName: payment.accountHolderName || "",
      paytmNumber: payment.paytmNumber || "",
      upiId: payment.upiId || "",
      paypalEmail: payment.paypalEmail || "",
      usdtWalletAddress: payment.usdtWalletAddress || "",
    });

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Delete payment
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this payment method?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await API.delete(`/payments/${id}`);

      setMessage("Payment method deleted successfully");

      await fetchPayments();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to delete payment method"
      );
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setError("");
    setMessage("");
  };

  // Render payment-specific fields
  const renderPaymentFields = () => {
    switch (formData.paymentType) {
      case "Bank":
        return (
          <>
            <div className="form-group">
              <label>IFSC Code</label>
              <input
                type="text"
                name="ifscCode"
                value={formData.ifscCode}
                onChange={handleChange}
                placeholder="Enter IFSC code"
                required
              />
            </div>

            <div className="form-group">
              <label>Branch Name</label>
              <input
                type="text"
                name="branchName"
                value={formData.branchName}
                onChange={handleChange}
                placeholder="Enter branch name"
                required
              />
            </div>

            <div className="form-group">
              <label>Bank Name</label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                placeholder="Enter bank name"
                required
              />
            </div>

            <div className="form-group">
              <label>Account Number</label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                placeholder="Enter account number"
                required
              />
            </div>

            <div className="form-group">
              <label>Account Holder's Name</label>
              <input
                type="text"
                name="accountHolderName"
                value={formData.accountHolderName}
                onChange={handleChange}
                placeholder="Enter account holder's name"
                required
              />
            </div>
          </>
        );

      case "Paytm":
        return (
          <div className="form-group">
            <label>Paytm Number</label>
            <input
              type="tel"
              name="paytmNumber"
              value={formData.paytmNumber}
              onChange={handleChange}
              placeholder="Enter Paytm number"
              required
            />
          </div>
        );

      case "UPI":
        return (
          <div className="form-group">
            <label>UPI ID</label>
            <input
              type="text"
              name="upiId"
              value={formData.upiId}
              onChange={handleChange}
              placeholder="example@upi"
              required
            />
          </div>
        );

      case "PayPal":
        return (
          <div className="form-group">
            <label>PayPal Email Address</label>
            <input
              type="email"
              name="paypalEmail"
              value={formData.paypalEmail}
              onChange={handleChange}
              placeholder="Enter PayPal email"
              required
            />
          </div>
        );

      case "USDT":
        return (
          <div className="form-group">
            <label>USDT Wallet Address</label>
            <input
              type="text"
              name="usdtWalletAddress"
              value={formData.usdtWalletAddress}
              onChange={handleChange}
              placeholder="Enter USDT wallet address"
              required
            />
          </div>
        );

      default:
        return null;
    }
  };

  // Display payment information
  const renderPaymentDetails = (payment) => {
    switch (payment.paymentType) {
      case "Bank":
        return (
          <>
            <p>
              <strong>Bank:</strong> {payment.bankName}
            </p>
            <p>
              <strong>Branch:</strong> {payment.branchName}
            </p>
            <p>
              <strong>IFSC:</strong> {payment.ifscCode}
            </p>
            <p>
              <strong>Account:</strong> {payment.accountNumber}
            </p>
            <p>
              <strong>Holder:</strong> {payment.accountHolderName}
            </p>
          </>
        );

      case "Paytm":
        return (
          <p>
            <strong>Paytm Number:</strong>{" "}
            {payment.paytmNumber}
          </p>
        );

      case "UPI":
        return (
          <p>
            <strong>UPI ID:</strong> {payment.upiId}
          </p>
        );

      case "PayPal":
        return (
          <p>
            <strong>PayPal Email:</strong>{" "}
            {payment.paypalEmail}
          </p>
        );

      case "USDT":
        return (
          <p>
            <strong>Wallet Address:</strong>{" "}
            {payment.usdtWalletAddress}
          </p>
        );

      default:
        return null;
    }
  };

  return (
    <div className="payments-page">
      <div className="payments-container">
        <div className="payments-header">
          <div>
            <h1>Payment Methods</h1>
            <p>Manage your payment information</p>
          </div>
        </div>

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Add / Edit Form */}
        <div className="payment-form-card">
          <h2>
            {editingId
              ? "Edit Payment Method"
              : "Add Payment Method"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Payment Type</label>

              <select
                name="paymentType"
                value={formData.paymentType}
                onChange={handlePaymentTypeChange}
                disabled={saving}
              >
                {paymentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {renderPaymentFields()}

            <div className="form-actions">
              <button
                type="submit"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Payment"
                  : "Add Payment"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={handleCancelEdit}
                  disabled={saving}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Payment List */}
        <div className="payment-list-section">
          <h2>Saved Payment Methods</h2>

          {loading ? (
            <p>Loading payment methods...</p>
          ) : payments.length === 0 ? (
            <div className="empty-state">
              <p>No payment methods added yet.</p>
            </div>
          ) : (
            <div className="payment-list">
              {payments.map((payment) => (
                <div
                  className="payment-card"
                  key={payment._id}
                >
                  <div className="payment-card-header">
                    <div>
                      <span className="payment-type">
                        {payment.paymentType}
                      </span>
                    </div>
                  </div>

                  <div className="payment-details">
                    {renderPaymentDetails(payment)}
                  </div>

                  <div className="payment-actions">
                    <button
                      type="button"
                      onClick={() => handleEdit(payment)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="delete-button"
                      onClick={() =>
                        handleDelete(payment._id)
                      }
                    >
                      Delete
                    </button>
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

export default Payments;