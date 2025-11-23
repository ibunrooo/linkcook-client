// src/pages/ShareList.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ShareList() {
  const navigate = useNavigate();
  const [shares, setShares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchShares = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/share');
        const data = await res.json();

        if (!res.ok || data.success === false) {
          throw new Error(data.message || '나눔 목록을 불러오지 못했습니다.');
        }

        setShares(data.data || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShares();
  }, []);

  if (loading) return <p>나눔 목록을 불러오는 중입니다...</p>;
  if (error) return <p>에러: {error}</p>;
  if (shares.length === 0)
    return (
      <main style={{ padding: '2rem' }}>
        <h2>식재료 나눔</h2>
        <button
          onClick={() => navigate('/share/create')}
          style={{
            padding: '0.5rem 1rem',
            marginBottom: '1rem',
            backgroundColor: '#7c3aed',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          나눔 등록하기
        </button>
        <p>등록된 나눔이 아직 없습니다.</p>
      </main>
    );

  return (
    <main style={{ padding: '2rem' }}>
      <h2>식재료 나눔</h2>

      <button
        onClick={() => navigate('/share/create')}
        style={{
          padding: '0.5rem 1rem',
          marginBottom: '1rem',
          backgroundColor: '#7c3aed',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
        }}
      >
        나눔 등록하기
      </button>

      <ul style={{ listStyle: 'none', padding: 0, maxWidth: 700 }}>
        {shares.map((share) => (
          <li
            key={share._id}
            style={{
              padding: '0.75rem 1rem',
              border: '1px solid #eee',
              borderRadius: 6,
              marginBottom: '0.5rem',
            }}
          >
            <strong>{share.item}</strong>{' '}
            <span>
              · 수량: {share.quantity || '-'} · 위치: {share.location}
            </span>
            {share.expiry && (
              <span>
                {' '}
                · 소비기한:{' '}
                {new Date(share.expiry).toLocaleDateString('ko-KR')}
              </span>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}

export default ShareList;
