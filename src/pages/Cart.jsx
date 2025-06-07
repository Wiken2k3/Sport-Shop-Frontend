import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Button, Table, Image, Form } from 'react-bootstrap';
import { removeFromCart, updateQuantity } from '../redux/cart/cartSlice';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.items); // hoặc state.cart.cartItems tùy theo reducer bạn dùng
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
    toast.info('Đã xóa sản phẩm khỏi giỏ hàng');
  };

  const handleQuantityChange = (id, value) => {
    const quantity = parseInt(value, 10);
    if (quantity >= 1) {
      dispatch(updateQuantity({ id, quantity }));
    }
  };

  const getTotal = () =>
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Container className="py-5 px-2 px-md-5">
      <h2 className="mb-4">🛒 Giỏ Hàng Của Bạn</h2>
      {cartItems.length === 0 ? (
        <p>
          Giỏ hàng trống. <Link to="/products">Mua sắm ngay</Link>.
        </p>
      ) : (
        <>
          <Table responsive bordered hover className="align-middle text-center">
            <thead className="table-dark">
              <tr>
                <th>Hình</th>
                <th>Sản phẩm</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Tổng</th>
                <th>Xóa</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item._id}>
                  <td>
                    <Image
                      src={item.image || 'https://via.placeholder.com/100'}
                      alt={item.name}
                      rounded
                      fluid
                      style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                    />
                  </td>
                  <td>{item.name}</td>
                  <td>{item.price.toLocaleString()}₫</td>
                  <td>
                    <Form.Control
                      type="number"
                      value={item.quantity}
                      min="1"
                      onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                      style={{ width: '80px', margin: '0 auto' }}
                    />
                  </td>
                  <td>{(item.price * item.quantity).toLocaleString()}₫</td>
                  <td>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleRemove(item._id)}
                    >
                      X
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Row className="justify-content-end">
            <Col md={4} className="text-end">
              <h5>Tổng cộng: <span className="text-danger">{getTotal().toLocaleString()}₫</span></h5>
              <Button variant="success" className="mt-3" onClick={() => navigate('/checkout')}>
                Tiến hành thanh toán
              </Button>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default Cart;
