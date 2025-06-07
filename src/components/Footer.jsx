import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css'; // để tùy chỉnh thêm nếu muốn

const Footer = () => {
  return (
    <footer className="footer bg-dark text-white pt-5 pb-3">
      <div className="container">
        <div className="row">
          {/* Cột 1: Logo và mô tả */}
          <div className="col-md-3 mb-4">
            <h4 className="fw-bold">SPORTSHOP</h4>
            <p>Chuyên cung cấp giày, quần áo, phụ kiện thể thao chính hãng, uy tín và chất lượng.</p>
          </div>

          {/* Cột 2: Liên kết nhanh */}
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold">Liên kết</h5>
            <ul className="list-unstyled">
              <li><Link className="text-white text-decoration-none" to="/">Trang chủ</Link></li>
              <li><Link className="text-white text-decoration-none" to="/products">Sản phẩm</Link></li>
              <li><Link className="text-white text-decoration-none" to="/sale">Giảm giá</Link></li>
              <li><Link className="text-white text-decoration-none" to="/contact">Liên hệ</Link></li>
              <li><Link className="text-white text-decoration-none" to="/about">Về chúng tôi</Link></li>
            </ul>
          </div>

          {/* Cột 3: Thông tin liên hệ */}
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold">Liên hệ</h5>
            <p>📍 123 Đường Thể Thao, TP. HCM</p>
            <p>📞 0909 999 999</p>
            <p>📧 sportshop@email.com</p>
          </div>

          {/* Cột 4: Newsletter */}
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold">Nhận tin khuyến mãi</h5>
            <form>
              <input type="email" className="form-control mb-2" placeholder="Email của bạn..." />
              <button className="btn btn-outline-light w-100" type="submit">Đăng ký</button>
            </form>
          </div>
        </div>

        <hr className="border-top border-secondary" />
        <p className="text-center mb-0">&copy; {new Date().getFullYear()} SPORTSHOP. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
