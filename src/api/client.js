// src/api/client.js
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

/**
 * 공통 요청 함수
 * - path: '/api/recipes' 같은 문자열
 * - options: fetch 옵션 (method, headers, body 등)
 */
async function request(path, options = {}) {
  const { params, ...restOptions } = options;

  let url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
  if (params && typeof params === 'object') {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query.append(key, value);
      }
    });
    const qs = query.toString();
    if (qs) {
      url += url.includes('?') ? `&${qs}` : `?${qs}`;
    }
  }
  // 개발 편의를 위한 디버그 로그
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug('[apiClient] request', url);
  }

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const res = await fetch(url, {
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
    ...restOptions,
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
  get(path, options) {
    return request(path, options);
  },
  post(path, body, options) {
    return request(path, {
      method: 'POST',
      body: JSON.stringify(body),
      ...(options || {}),
    });
  },
  put(path, body, options) {
    return request(path, {
      method: 'PUT',
      body: JSON.stringify(body),
      ...(options || {}),
    });
  },
  delete(path, options) {
    return request(path, {
      method: 'DELETE',
      ...(options || {}),
    });
  },
};

export default apiClient;
