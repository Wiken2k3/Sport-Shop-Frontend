import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faShoppingCart, faSearch } from '@fortawesome/free-solid-svg-icons';
import { logout } from '../redux/slices/authSlice';
import logo from '../assets/logo.png';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const cart = useSelector((state) => state.cart.items);
  const [expanded, setExpanded] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    const keyword = e.target.search.value.trim().toLowerCase();
    if (keyword) {
      navigate(`/products?search=${encodeURIComponent(keyword)}`);
      setExpanded(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setExpanded(false);
    navigate('/login');
  };

  useEffect(() => {
    setExpanded(false);
  }, [location]);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top custom-navbar">
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand" to="/">
          <img src={logo} alt="Logo" className="logo" />
        </Link>

        {/* Toggle mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded={expanded}
          aria-label="Toggle navigation"
          onClick={() => setExpanded(!expanded)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Content */}
        <div className={`collapse navbar-collapse ${expanded ? 'show' : ''}`} id="navbarContent">
          {/* Menu */}
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            {['/', '/products', '/sale', '/contact', '/about'].map((path, idx) => (
              <li className="nav-item" key={idx}>
                <NavLink
                  className="nav-link text-uppercase"
                  to={path}
                  onClick={() => setExpanded(false)}
                >
                  {['Home', 'Products', 'Sale', 'Contact', 'About'][idx]}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Right side: Search + User + Cart */}
          <div className="d-flex align-items-center gap-3 navbar-right">
            <form className="d-flex" onSubmit={handleSearch}>
              <input
                type="text"
                name="search"
                className="form-control search-input"
                placeholder="Tìm sản phẩm..."
              />
              <button className="btn btn-outline-dark ms-2" type="submit">
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </form>

            {user ? (
            <>
              <Link
                to="/profile"
                className="text-dark text-decoration-none me-2"
                onClick={() => setExpanded(false)}
              >
                <FontAwesomeIcon icon={faUser} />
                <span className="ms-1">Xin chào, {user?.fullName || user?.username || 'bạn'}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="btn btn-link text-decoration-none text-danger p-0"
              >
                Đăng xuất
              </button>
            </>
              ) : (<Link
              to="/login"
              className="text-dark text-decoration-none"
              onClick={() => setExpanded(false)}
            >
              <FontAwesomeIcon icon={faUser} /> Đăng nhập
            </Link>
              )}


            <Link
              to="/cart"
              className="text-dark text-decoration-none position-relative"
              onClick={() => setExpanded(false)}
            >
              <FontAwesomeIcon icon={faShoppingCart} size="lg" />
              {cart?.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cart.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
