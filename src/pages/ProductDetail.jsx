import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Row,
  Col,
  Button,
  Spinner,
  Image,
  Alert,
  Form,
  ListGroup,
} from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cart/cartSlice';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [quantity, setQuantity] = useState(1);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);

  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        const data = res.data;
        setProduct(data);
        setComments(data.comments || []);
        setLikes(data.likes || 0);
        setAverageRating(data.rating || 0);
        setRatingCount(data.ratingCount || 0);
        setError(null);
      } catch (err) {
        console.error('Lỗi khi lấy sản phẩm:', err);
        setError('Lỗi khi lấy sản phẩm. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product && quantity > 0) {
      dispatch(addToCart({ ...product, quantity }));
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (commentText.trim() === '') return;

    const newComment = {
      id: Date.now(),
      text: commentText.trim(),
      date: new Date().toLocaleString(),
    };

    setComments([newComment, ...comments]);
    setCommentText('');
  };

  const handleLike = () => {
    if (!isLiked) {
      setLikes(likes + 1);
      setIsLiked(true);
    }
  };

  const handleRating = (star) => {
    if (userRating === 0) {
      setUserRating(star);
      const total = averageRating * ratingCount + star;
      const newCount = ratingCount + 1;
      setRatingCount(newCount);
      setAverageRating(total / newCount);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="dark" />
      </div>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="py-5">
        <p className="text-center">Không tìm thấy sản phẩm.</p>
      </Container>
    );
  }

  return (
    <Container className="py-5 px-3 px-md-5">
      <Row className="g-5">
        <Col md={6}>
          <Image
            src={product.image || 'https://via.placeholder.com/500x400'}
            alt={product.name}
            className="img-fluid rounded shadow"
            fluid
          />
        </Col>

        <Col md={6}>
          <h3 className="fw-bold">{product.name}</h3>
          <p className="text-muted">{product.description || 'Chưa có mô tả chi tiết.'}</p>

          <h5 className="text-danger fw-semibold mb-3">
            {product.price?.toLocaleString()}₫
          </h5>

          {/* Thích + Đánh giá */}
          <div className="mb-3 d-flex align-items-center">
            <Button
              variant={isLiked ? 'danger' : 'outline-danger'}
              onClick={handleLike}
              className="me-3"
            >
              {isLiked ? 'Đã thích' : 'Thích'} ❤️ ({likes})
            </Button>

            <div>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  style={{
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    color: star <= userRating ? '#ffc107' : '#e4e5e9',
                  }}
                  onClick={() => handleRating(star)}
                >
                  ★
                </span>
              ))}
              <small className="ms-2">
                ({averageRating.toFixed(1)} / 5 từ {ratingCount} lượt)
              </small>
            </div>
          </div>

          {/* Số lượng */}
          <Form.Group controlId="quantity" className="mb-3" style={{ maxWidth: '120px' }}>
            <Form.Label>Số lượng</Form.Label>
            <Form.Control
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            />
          </Form.Group>

          <Button variant="dark" size="lg" onClick={handleAddToCart}>
            Thêm vào giỏ hàng
          </Button>
        </Col>
      </Row>

      {/* Bình luận */}
      <Row className="mt-5">
        <Col md={8}>
          <h4>Bình luận</h4>

          <Form onSubmit={handleAddComment} className="mb-3">
            <Form.Group controlId="commentText">
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Viết bình luận..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
            </Form.Group>
            <Button type="submit" variant="primary" className="mt-2">
              Gửi bình luận
            </Button>
          </Form>

          {comments.length === 0 && <p className="text-muted">Chưa có bình luận nào.</p>}

          <ListGroup>
            {comments.map((c) => (
              <ListGroup.Item key={c.id} className="mb-2 rounded shadow-sm">
                <div className="d-flex align-items-center mb-2">
                  <Image src="https://i.pravatar.cc/30" roundedCircle className="me-2" />
                  <strong>Người dùng</strong>
                  <small className="ms-auto text-muted">{c.date}</small>
                </div>
                <p className="mb-0">{c.text}</p>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;
