// src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const [profile, setProfile] = useState(null); // Thông tin chi tiết user
  const [orders, setOrders] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchUserProfile = async () => {
      setLoadingProfile(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${user._id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setProfile(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Không thể tải thông tin người dùng');
      } finally {
        setLoadingProfile(false);
      }
    };

    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/orders/user/${user._id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setOrders(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Không thể tải đơn hàng');
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchUserProfile();
    fetchOrders();
  }, [user]);

  if (!user) {
    return <p className="text-center mt-5">🔒 Bạn cần đăng nhập để xem trang hồ sơ.</p>;
  }

  if (loadingProfile) {
    return <p className="text-center mt-5">⏳ Đang tải thông tin người dùng...</p>;
  }

  if (!profile) {
    return <p className="text-center mt-5">❌ Không tìm thấy thông tin người dùng.</p>;
  }

  const renderOrderStatus = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'đã hoàn thành':
        return <span className="badge bg-success">Đã hoàn thành</span>;
      case 'processing':
      case 'đang xử lý':
        return <span className="badge bg-warning text-dark">Đang xử lý</span>;
      case 'cancelled':
      case 'đã hủy':
        return <span className="badge bg-danger">Đã hủy</span>;
      default:
        return <span className="badge bg-secondary">{status || 'Chưa xác định'}</span>;
    }
  };

  return (
    <div className="container mt-5">
      <div className="row mb-5">
        <div className="col-md-4 text-center">
          <img
            src={profile.avatarUrl || '/default-avatar.png'}
            alt="Avatar"
            className="img-thumbnail rounded-circle mb-3"
            style={{ width: 150, height: 150, objectFit: 'cover' }}
            onError={(e) => (e.target.src = '/default-avatar.png')}
          />
          <h4>{profile.username}</h4>
          <p className="text-muted">{profile.email}</p>
        </div>

        <div className="col-md-8">
          <h3 className="mb-4">Thông tin cá nhân</h3>
          <ul className="list-group">
            <li className="list-group-item">
              <strong>Họ tên:</strong> {profile.fullName || profile.username}
            </li>
            <li className="list-group-item">
              <strong>Email:</strong> {profile.email}
            </li>
            {/* Mở rộng: thêm số điện thoại, địa chỉ nếu có */}
            {profile.phone && (
              <li className="list-group-item">
                <strong>Số điện thoại:</strong> {profile.phone}
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="order-history">
        <h3 className="mb-3">🧾 Lịch sử đơn hàng</h3>
        {loadingOrders ? (
          <p className="text-center">⏳ Đang tải đơn hàng...</p>
        ) : orders.length === 0 ? (
          <p className="text-muted">Chưa có đơn hàng nào.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Ngày đặt</th>
                  <th>Sản phẩm</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, idx) => (
                  <tr key={order._id}>
                    <td>{idx + 1}</td>
                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                    <td>
                      <ul className="ps-3 mb-0">
                        {order.products.map((p, i) => (
                          <li key={i}>
                            {p.name || p.productId} × {p.quantity}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td>{order.amount.toLocaleString()}₫</td>
                    <td>{renderOrderStatus(order.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
