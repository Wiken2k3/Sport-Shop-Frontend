import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import { toast } from "react-toastify";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";

const Sale = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaleProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products/sale");
        setProducts(res.data);
      } catch (error) {
        console.error("❌ Lỗi tải sản phẩm giảm giá:", error);
        toast.error("Không thể tải sản phẩm đang giảm giá!");
      } finally {
        setLoading(false);
      }
    };

    fetchSaleProducts();
  }, []);

  return (
    <Container className="py-5" style={{ minHeight: "700px" }}>
      <h2 className="mb-4 fw-bold text-uppercase text-danger text-center">
        Sản phẩm khuyến mãi
      </h2>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center py-5">
          <Spinner animation="border" variant="danger" />
        </div>
      ) : products.length > 0 ? (
        <Row className="g-4">
          {products.map((product) => (
            <Col key={product._id} xs={12} sm={6} md={4} lg={3}>
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>
      ) : (
        <Alert variant="info" className="text-center">
          Hiện tại chưa có sản phẩm nào đang khuyến mãi.
        </Alert>
      )}
    </Container>
  );
};

export default Sale;
