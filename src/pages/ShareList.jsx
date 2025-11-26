// src/pages/ShareList.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/client';

const pageStyle = {
  maxWidth: '960px',
  margin: '0 auto',
  padding: '2rem 1.5rem 4rem',
};

const listLayout = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.9rem',
};

const cardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '14px',
  padding: '1.1rem 1.3rem',
  boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
  border: '1px solid #f3f4f6',
  textDecoration: 'none',
  color: '#111827',
  display: 'block',
};

function ShareList() {
  const [shares, setShares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchShares = async () => {
      try {
        const { data } = await apiClient.get('/api/share');
        setShares(data || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShares();
  }, []);

  if (loading) return <p style={pageStyle}>나눔 목록을 불러오는 중입니다...</p>;
  if (error) return <p style={pageStyle}>에러: {error}</p>;

  return (
    <div style={pageStyle}>
      <header style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ marginBottom: '0.4rem' }}>식재료 나눔</h2>
        <p style={{ margin: 0, color: '#4b5563', fontSize: '0.95rem' }}>
          아직 쓸 수 있는 재료를 버리는 대신, 근처 이웃에게 나눠주세요.
        </p>
      </header>

      <div
        style={{
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <p style={{ margin: 0, fontSize: '0.95rem' }}>
          총 <strong>{shares.length}</strong>개의 나눔이 등록되어 있어요.
        </p>

        <Link
          to="/share/create"
          style={{
            padding: '0.55rem 1.3rem',
            borderRadius: '999px',
            backgroundColor: '#fbbf24',
            color: '#3b2600',
            fontWeight: 600,
            textDecoration: 'none',
            fontSize: '0.95rem',
          }}
        >
          나눔 등록하기
        </Link>
      </div>

      {shares.length === 0 ? (
        <p style={{ color: '#6b7280' }}>아직 등록된 나눔이 없습니다.</p>
      ) : (
        <div style={listLayout}>
          {shares.map((share) => {
            const expiryText = share.expiry
              ? share.expiry.slice(0, 10)
              : '소비기한 정보 없음';

            return (
              <Link
                key={share._id}
                to={`/share/${share._id}`}
                style={cardStyle}
              >
                <div style={{ marginBottom: '0.25rem' }}>
                  <strong>{share.item}</strong>
                  {share.quantity && (
                    <span style={{ marginLeft: '0.25rem', color: '#6b7280', fontSize: '0.9rem' }}>
                      · 나눔 수량 {share.quantity}
                      {share.unit || ''}
                    </span>
                  )}
                </div>

                <p
                  style={{
                    margin: 0,
                    fontSize: '0.88rem',
                    color: '#4b5563',
                  }}
                >
                  위치: {share.location || '위치 정보 없음'}
                </p>
                <p
                  style={{
                    margin: '0.15rem 0 0',
                    fontSize: '0.86rem',
                    color: '#6b7280',
                  }}
                >
                  소비기한: {expiryText}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ShareList;