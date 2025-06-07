import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cart/cartSlice';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify'; // ✅ Thêm toast

const Home = () => {
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        setProducts(res.data.slice(0, 8)); // ✅ Lấy 8 sản phẩm đầu tiên
      } catch {
        toast.error('Lỗi khi tải sản phẩm trang chủ!'); // ✅ Hiển thị lỗi toast
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="bg-light min-vh-100 pt-4">
      <Container className="px-3 px-md-5">
        <h2 className="text-center fw-bold mb-4 text-uppercase">Sản phẩm nổi bật</h2>
        <Row className="g-4">
          {products.map((product) => (
            <Col key={product._id} xs={12} sm={6} md={4} lg={3}>
              <Card className="h-100 shadow-sm product-card">
                {/* Bọc ảnh sản phẩm trong Link */}
                <Link to={`/product/${product._id}`}>
                  <Card.Img
                    variant="top"
                    src={product.image || 'https://via.placeholder.com/300x200'}
                    alt={product.name}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                </Link>

                <Card.Body className="d-flex flex-column">
                  {/* Tiêu đề sản phẩm */}
                  <Card.Title className="fs-6 text-truncate">
                    <Link
                      to={`/product/${product._id}`}
                      className="text-decoration-none text-dark"
                    >
                      {product.name}
                    </Link>
                  </Card.Title>

                  <Card.Text className="text-muted small">
                    {product.description?.slice(0, 50)}...
                  </Card.Text>

                  <div className="mt-auto d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-danger">
                      {product.price.toLocaleString()}₫
                    </span>
                    <Button
                      variant="dark"
                      size="sm"
                      onClick={() => dispatch(addToCart({ ...product, quantity: 1 }))}
                    >
                      Thêm vào giỏ
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Home;
