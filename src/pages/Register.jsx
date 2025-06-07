import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formRef = useRef(null);

  const { user, isLoading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    gsap.set(formRef.current, { opacity: 1, y: 0 }); // hiện rõ ngay lập tức trước khi animate
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
    dispatch(register(formData));
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div className="col-md-5 shadow p-4 rounded bg-white" ref={formRef}>
        <h3 className="text-center mb-4">Đăng ký tài khoản</h3>
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">
              <FontAwesomeIcon icon="user" className="me-2" />
              Tên người dùng
            </label>
            <input
              type="text"
              name="username"
              className="form-control"
              placeholder="Nhập tên người dùng..."
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              <FontAwesomeIcon icon="user" className="me-2" />
              Email
            </label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Nhập email..."
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              <FontAwesomeIcon icon="lock" className="me-2" />
              Mật khẩu
            </label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Nhập mật khẩu..."
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-success w-100"
            disabled={isLoading}
          >
            {isLoading ? 'Đang đăng ký...' : (
              <>
                <FontAwesomeIcon icon="user-plus" className="me-2" />
                Đăng ký
              </>
            )}
          </button>
        </form>

        <p className="mt-3 text-center">
          Đã có tài khoản? <a href="/login">Đăng nhập</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
