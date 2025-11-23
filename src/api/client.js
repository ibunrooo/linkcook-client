// src/api/client.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api', // 백엔드 주소
  // 필요하면 나중에 헤더, 토큰 등 추가
});

export default api;
