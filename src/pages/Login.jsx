import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import gsap from 'gsap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faSignInAlt } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formRef = useRef(null);

  const { user, isLoading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    gsap.set(formRef.current, { opacity: 1, y: 0 }); // đảm bảo hiển thị ngay lập tức
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    );
  }, []);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div
        className="card shadow-lg p-4 rounded"
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: 'white',
          color: '#212529',
          opacity: 1,
        }}
        ref={formRef}
      >
        <h3 className="text-center mb-4 text-primary fw-bold">Đăng nhập</h3>

        {error && (
          <div className="alert alert-danger text-center py-2">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label className="form-label fw-semibold text-secondary">
              <FontAwesomeIcon icon={faEnvelope} className="me-2" />
              Email
            </label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Nhập email của bạn"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group mb-4">
            <label className="form-label fw-semibold text-secondary">
              <FontAwesomeIcon icon={faLock} className="me-2" />
              Mật khẩu
            </label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Nhập mật khẩu"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 fw-bold"
            disabled={isLoading}
          >
            {isLoading ? 'Đang đăng nhập...' : (
              <>
                <FontAwesomeIcon icon={faSignInAlt} className="me-2" />
                Đăng nhập
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <span className="text-muted">Bạn chưa có tài khoản? </span>
          <Link to="/register" className="fw-semibold text-primary">
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
