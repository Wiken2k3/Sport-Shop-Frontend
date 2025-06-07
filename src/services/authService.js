// src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/';

// Đăng nhập
const login = async (data) => {
  try {
    const res = await axios.post(API_URL + 'login', data);
    // Giả sử res.data trả về { user: {...}, token: '...' }
    return res.data;
  } catch (error) {
    const message =
      error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
    throw new Error(message);
  }
};

// Đăng ký
const register = async (data) => {
  try {
    const res = await axios.post(API_URL + 'register', data);
    // Giả sử res.data trả về { user: {...}, token: '...' }
    return res.data;
  } catch (error) {
    const message =
      error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
    throw new Error(message);
  }
};

// Đăng xuất
const logout = () => {
  localStorage.removeItem('user');
};

export default {
  login,
  register,
  logout,
};
