import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag } from '@fortawesome/free-solid-svg-icons';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  return (
    <Card className="shadow-sm product-card d-flex flex-column h-100">
      <Link to={`/product/${product._id}`} className="text-decoration-none text-dark">
        <Card.Img
          variant="top"
          src={product.image}
          alt={product.name}
          className="product-image"
        />
      </Link>

      <Card.Body className="d-flex flex-column">
        <Link to={`/product/${product._id}`} className="text-decoration-none text-dark">
          <Card.Title className="fs-6 text-truncate">{product.name}</Card.Title>

          <Card.Text>
            {product.salePrice ? (
              <>
                <span className="text-danger fw-bold me-2">
                  {product.salePrice.toLocaleString()}₫
                </span>
                <del className="text-muted">
                  {product.price.toLocaleString()}₫
                </del>
                <FontAwesomeIcon icon={faTag} className="ms-2 text-warning" />
              </>
            ) : (
              <span className="fw-bold">{product.price.toLocaleString()}₫</span>
            )}
          </Card.Text>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
