// src/api/client.js
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

/**
 * 공통 요청 함수
 * - path: '/api/recipes' 같은 문자열
 * - options: fetch 옵션 (method, headers, body 등)
 */
async function request(path, options = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const res = await fetch(url, {
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
    ...options,
  });

  let data = {};
  try {
    data = await res.json();
  } catch (e) {
    data = {};
  }

  if (!res.ok || data.success === false) {
    const message = data.message || `API Error (${res.status})`;
    throw new Error(message);
  }

  return data; // { success, message, data }
}

const apiClient = {
  get(path) {
    return request(path);
  },
  post(path, body) {
    return request(path, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },
  put(path, body) {
    return request(path, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },
  delete(path) {
    return request(path, {
      method: 'DELETE',
    });
  },
};

export default apiClient;