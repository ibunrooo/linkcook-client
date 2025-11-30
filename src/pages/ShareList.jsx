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
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [region, setRegion] = useState('');

  useEffect(() => {
    const fetchShares = async () => {
      setLoading(true);
      try {
        const { data } = await apiClient.get('/api/share', {
          params: { q: searchQuery || undefined, region: region || undefined },
        });
        setShares(data || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShares();
  }, [searchQuery, region]);

  if (loading) return <p style={pageStyle}>나눔 목록을 불러오는 중입니다...</p>;
  if (error) return <p style={pageStyle}>에러: {error}</p>;

  const handleRegionChange = (e) => {
    setRegion(e.target.value);
    setLoading(true);
  };

  return (
    <div style={pageStyle}>
      <header style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ marginBottom: '0.4rem' }}>식재료 나눔</h2>
        <p style={{ margin: 0, color: '#4b5563', fontSize: '0.95rem' }}>
          아직 쓸 수 있는 재료를 버리는 대신, 근처 이웃에게 나눠주세요.
        </p>
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setLoading(true);
          setSearchQuery(searchInput.trim());
        }}
        style={{
          marginBottom: '1rem',
          display: 'flex',
          gap: '0.35rem',
          alignItems: 'center',
          maxWidth: '420px',
        }}
      >
        <input
          type="text"
          value={searchInput}
          onChange={(e) => {
            const value = e.target.value;
            setSearchInput(value);
            if (value.trim() === '') {
              setLoading(true);
              setSearchQuery('');
            }
          }}
          placeholder="나눔 품목, 설명, 위치, 작성자로 검색해보세요"
          style={{
            flex: 1,
            padding: '0.6rem 0.8rem',
            borderRadius: '10px',
            border: '1px solid #d1d5db',
            fontSize: '0.95rem',
          }}
        />
        <button
          type="submit"
          aria-label="검색"
          style={{
            padding: '0.6rem 0.8rem',
            borderRadius: '10px',
            border: '1px solid #d1d5db',
            background: '#fff',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          🔍
        </button>
      </form>

      <div style={{ marginBottom: '1rem', maxWidth: '420px' }}>
        <label
          style={{
            display: 'block',
            marginBottom: '0.35rem',
            color: '#374151',
            fontWeight: 600,
          }}
        >
          지역 필터
        </label>
        <select
          value={region}
          onChange={handleRegionChange}
          style={{
            width: '100%',
            padding: '0.6rem 0.75rem',
            borderRadius: '10px',
            border: '1px solid #d1d5db',
            backgroundColor: '#fff',
          }}
        >
          <option value="">전체</option>
          <option value="서울">서울</option>
          <option value="경기">경기</option>
          <option value="인천">인천</option>
          <option value="강원">강원</option>
          <option value="충청">충청</option>
          <option value="전라">전라</option>
          <option value="경상">경상</option>
          <option value="제주">제주</option>
        </select>
      </div>

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
                <div
                  style={{
                    display: 'flex',
                    gap: '0.75rem',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
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
                  </div>

                  {share.image && (
                    <div
                      style={{
                        width: '110px',
                        height: '80px',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        border: '1px solid #e5e7eb',
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={share.image}
                        alt={share.item || '나눔 이미지'}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ShareList;
