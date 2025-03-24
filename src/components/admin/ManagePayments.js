import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Alert, Spinner } from 'react-bootstrap';

const ManagePayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token'); // Ensure you have a token stored in localStorage after login

  // Fetch payments from the backend
  const fetchPayments = async () => {
    try {
      const response = await axios.get('http://localhost:5289/api/admin/payments', {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.data && response.data.$values && Array.isArray(response.data.$values)) {
        setPayments(response.data.$values);  // Set the correct array of payments
      } else {
        console.error("Unexpected response format:", response.data);
        setError("Failed to fetch payment data or no payments available.");
      }
    } catch (error) {
      console.error("Error fetching payments:", error.response || error);
      setError("Failed to fetch payment data. Please check the console for details.");
    } finally {
      setLoading(false);
    }
  };  

  // Update the payment status (mark as paid or pending)
  const handlePaymentStatusUpdate = async (paymentId, status) => {
    try {
      const response = await axios.put(
        `http://localhost:5289/api/admin/payments/${paymentId}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        // After updating, refetch the payments to reflect changes
        fetchPayments();
      } else {
        console.error("Failed to update payment status");
      }
    } catch (error) {
      console.error("Error updating payment status:", error.response || error);
    }
  };

  // Fetch payments on component mount
  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div>
      <h3>Manage Payments</h3>

      {/* Show loading spinner while fetching data */}
      {loading && <Spinner animation="border" variant="primary" />}

      {/* Show error message if there is an issue fetching payments */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Show no data available message if no payments are found */}
      {payments.length === 0 && !loading && !error && (
        <Alert variant="info">No data available. Please add some payments.</Alert>
      )}

      {/* Table to display payments if there is data */}
      {payments.length > 0 && (
        <Table bordered>
          <thead>
            <tr>
              <th>User Email</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.user.email}</td>
                <td>${payment.amount}</td>
                <td>{payment.status}</td>
                <td>
                  {payment.status === 'Pending' ? (
                    <Button
                      variant="success"
                      onClick={() => handlePaymentStatusUpdate(payment.id, 'Paid')}
                    >
                      Mark as Paid
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      onClick={() => handlePaymentStatusUpdate(payment.id, 'Pending')}
                    >
                      Mark as Pending
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default ManagePayments;
