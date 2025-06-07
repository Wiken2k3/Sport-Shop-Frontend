import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaRunning, FaUsers, FaHandshake } from 'react-icons/fa';
import './About.css';

const About = () => (
  <div className="about-section">
    <Container className="py-5">
      <h2 className="mb-5 text-center about-title">Về SportShop</h2>
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm p-4 about-card">
            <p>
              <FaRunning className="about-icon" /> Chúng tôi chuyên cung cấp các sản phẩm thể thao chính hãng với chất lượng tốt nhất.  
              Với sứ mệnh mang đến trải nghiệm mua sắm tốt nhất cho khách hàng, SportShop luôn không ngừng cải tiến và mở rộng danh mục sản phẩm.
            </p>
            <p>
              <FaUsers className="about-icon" /> Đội ngũ của chúng tôi luôn sẵn sàng hỗ trợ bạn trong mọi nhu cầu về thể thao và sức khỏe.
            </p>
            <p>
              <FaHandshake className="about-icon" /> Cam kết mang lại sự hài lòng và giá trị thực sự cho khách hàng.
            </p>
          </Card>
        </Col>
      </Row>
    </Container>
  </div>
);

export default About;
