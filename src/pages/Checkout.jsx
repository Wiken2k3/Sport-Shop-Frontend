// src/pages/Checkout.jsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { clearCart } from '../redux/cart/cartSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Checkout = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const currentUser = useSelector((state) => state.auth.user);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error('Vui lòng đăng nhập để thanh toán.');
      return navigate('/login');
    }

    // Validate form data
    if (!formData.fullName || !formData.phone || !formData.email || !formData.address) {
      toast.error('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    try {
      await axios.post(
        'http://localhost:5000/api/orders',
        {
          userId: currentUser._id,
          products: cartItems.map((item) => ({
            productId: item._id,
            quantity: item.quantity,
          })),
          amount: totalPrice,
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );

      dispatch(clearCart());
      toast.success('Đặt hàng thành công!');
      navigate('/profile');
    } catch (err) {
      console.error(err);
      toast.error('Đặt hàng thất bại, vui lòng thử lại!');
    }
  };

  const getGoogleMapsLink = (address) => {
    const query = encodeURIComponent(address);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  return (
    <Container className="py-5">
      <h2 className="mb-4">Thanh Toán</h2>

      {cartItems.length === 0 ? (
        <Alert variant="info">
          Giỏ hàng của bạn trống.{' '}
          <Button variant="link" onClick={() => navigate('/products')}>
            Quay lại mua sắm
          </Button>
        </Alert>
      ) : (
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Họ tên</Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Nguyễn Văn A"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Số điện thoại</Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0123 456 789"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Địa chỉ giao hàng</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Đường ABC, Quận XYZ, TP.HCM"
                  required
                />
                {formData.address && (
                  <div className="mt-2">
                    📍{' '}
                    <a
                      href={getGoogleMapsLink(formData.address)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-decoration-none text-primary"
                    >
                      Xem trên Google Maps
                    </a>
                  </div>
                )}
              </Form.Group>
            </Col>

            <Col md={6}>
              <h5>Thông tin đơn hàng</h5>
              {cartItems.map((item) => (
                <div key={item._id} className="d-flex justify-content-between my-2">
                  <span>{item.name} x{item.quantity}</span>
                  <span>{(item.price * item.quantity).toLocaleString()}₫</span>
                </div>
              ))}
              <hr />
              <div className="d-flex justify-content-between fw-bold">
                <span>Tổng cộng:</span>
                <span>{totalPrice.toLocaleString()}₫</span>
              </div>

              <Button type="submit" variant="success" className="mt-3 w-100">
                Xác nhận đặt hàng
              </Button>
            </Col>
          </Row>
        </Form>
      )}
    </Container>
  );
};

export default Checkout;
