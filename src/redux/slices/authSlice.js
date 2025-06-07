// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

// Lấy user từ localStorage nếu có
const savedUser = localStorage.getItem('user');
const user = savedUser ? JSON.parse(savedUser) : null;

const initialState = {
  user,
  isLoading: false,
  error: null,
};

// 🔐 Đăng nhập
export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
  try {
    const user = await authService.login(userData);
    return user;
  } catch (err) {
    // Nếu err là object lỗi axios thì lấy message chuẩn
    const message = err.response?.data?.message || err.message || 'Lỗi đăng nhập';
    return thunkAPI.rejectWithValue(message);
  }
});

// 📝 Đăng ký
export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
  try {
    const user = await authService.register(userData);
    return user;
  } catch (err) {
    const message = err.response?.data?.message || err.message || 'Lỗi đăng ký';
    return thunkAPI.rejectWithValue(message);
  }
});

// 📥 Lấy lại thông tin user từ token (dùng trong Profile hoặc khi refresh trang)
export const fetchUserProfile = createAsyncThunk('auth/fetchProfile', async (_, thunkAPI) => {
  try {
    const stored = localStorage.getItem('user');
    if (!stored) throw new Error('Không có token.');

    const { token } = JSON.parse(stored);

    const res = await axios.get(`${API_BASE}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Gộp lại token với dữ liệu user từ backend
    return { ...res.data, token };
  } catch (err) {
    console.error('Lỗi fetchUserProfile:', err);
    const message = err.response?.data?.message || 'Không thể lấy thông tin người dùng.';
    return thunkAPI.rejectWithValue(message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Đăng nhập
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Đăng ký
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Lấy thông tin người dùng từ token
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        localStorage.removeItem('user');
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
