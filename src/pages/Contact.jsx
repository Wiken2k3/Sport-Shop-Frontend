import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import './Contact.css';

const Contact = () => (
  <Container className="contact-section py-5">
    <h2 className="contact-title mb-4 text-center">Liên hệ với chúng tôi</h2>
    <Row className="justify-content-center">
      <Col md={6}>
        <Card className="contact-card shadow-sm p-4">
          <p><FaEnvelope className="contact-icon" /> <strong>Email:</strong> <a href="mailto:wiken2k3@gmail.com">wiken2k3@gmail.com</a></p>
          <p><FaPhoneAlt className="contact-icon" /> <strong>Hotline:</strong> <a href="tel:0989648691">0989 648 691</a></p>
          <p><FaMapMarkerAlt className="contact-icon" /> <strong>Địa chỉ:</strong> 123 Đường ABC, TP.HCM</p>
        </Card>
      </Col>
    </Row>
  </Container>
);

export default Contact;
