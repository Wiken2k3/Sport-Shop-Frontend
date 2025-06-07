import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cart/cartSlice';
import { gsap } from 'gsap';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const location = useLocation();
  const dispatch = useDispatch();

  const searchParams = new URLSearchParams(location.search);
  let keyword = searchParams.get('search') || '';
  keyword = keyword.trim().toLowerCase(); // Chuẩn hóa keyword

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        // Build URL với các query param search, category, sort
        let url = `http://localhost:5000/api/products?`;

        const queryParams = [];

        if (keyword) {
          queryParams.push(`search=${encodeURIComponent(keyword)}`);
        }
        if (category) {
          queryParams.push(`category=${encodeURIComponent(category)}`);
        }
        if (sort) {
          queryParams.push(`sort=${encodeURIComponent(sort)}`);
        }

        url += queryParams.join('&');

        const res = await axios.get(url);
        let data = res.data;

        // Nếu API chưa hỗ trợ filter và sort server, bạn có thể filter và sort ở client:
        // Nếu API đã hỗ trợ thì bỏ đoạn này
        if (!category && !sort) {
          // giả sử API trả về tất cả, thì filter client
          if (keyword) {
            data = data.filter(
              (p) =>
                p.name.toLowerCase().includes(keyword) ||
                (p.description && p.description.toLowerCase().includes(keyword))
            );
          }
        }
        if (!sort && !category) {
          // nếu server chưa sort
          if (sort === 'asc') {
            data.sort((a, b) => a.price - b.price);
          } else if (sort === 'desc') {
            data.sort((a, b) => b.price - a.price);
          }
        }

        setProducts(data);

        // GSAP animation
        gsap.from('.product-card', {
          opacity: 0,
          y: 50,
          stagger: 0.1,
          duration: 0.5,
        });
      } catch (err) {
        console.error(err);
        setError('Lấy dữ liệu sản phẩm thất bại. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keyword, sort, category]);

  const handleAddToCart = (product) => {
    dispatch(addToCart({ ...product, quantity: 1 }));
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4 text-center">🛍️ Danh Sách Sản Phẩm</h2>

      {/* Filters */}
      <Row className="mb-4">
        <Col md={4}>
          <Form.Select onChange={(e) => setCategory(e.target.value)} value={category}>
            <option value="">-- Lọc theo danh mục --</option>
            <option value="shoes">Giày</option>
            <option value="clothes">Quần áo</option>
            <option value="accessories">Phụ kiện</option>
          </Form.Select>
        </Col>
        <Col md={4}>
          <Form.Select onChange={(e) => setSort(e.target.value)} value={sort}>
            <option value="">-- Sắp xếp theo giá --</option>
            <option value="asc">Tăng dần</option>
            <option value="desc">Giảm dần</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Loading & Error */}
      {loading && (
        <div className="text-center my-4">
          <Spinner animation="border" variant="primary" />
        </div>
      )}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Product List */}
      {!loading && !error && (
        <Row>
          {products.length === 0 ? (
            <p>Không có sản phẩm nào phù hợp.</p>
          ) : (
            products.map((product) => (
              <Col key={product._id} xs={12} sm={6} md={4} lg={3} className="mb-4 d-flex">
                <Card className="product-card shadow-sm d-flex flex-column">
                  <Card.Img
                    variant="top"
                    src={product.image || 'https://via.placeholder.com/300'}
                    alt={product.name}
                    className="product-img-fixed"
                  />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="fs-6 text-truncate">{product.name}</Card.Title>
                    <Card.Text className="fw-bold mb-3">{product.price.toLocaleString()}₫</Card.Text>
                    <Button variant="dark" onClick={() => handleAddToCart(product)} className="mt-auto">
                      Thêm vào giỏ
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
      )}
    </Container>
  );
};

export default Products;
