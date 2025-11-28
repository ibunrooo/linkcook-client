// src/pages/GroupBuyList.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/client';

const pageStyle = {
  maxWidth: '960px',
  margin: '0 auto',
  padding: '2rem 1.5rem 4rem',
};

const cardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  padding: '1.25rem 1.4rem',
  boxShadow: '0 4px 14px rgba(0,0,0,0.05)',
  border: '1px solid #f3f4f6',
  textDecoration: 'none',
  color: '#111827',
  display: 'block',
};

function GroupBuyList() {
  const [groupBuys, setGroupBuys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchGroupBuys = async () => {
      try {
        const { data } = await apiClient.get('/api/groupbuy', {
          params: { q: searchQuery || undefined },
        });
        setGroupBuys(data || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupBuys();
  }, [searchQuery]);

  if (loading) return <p style={pageStyle}>공동구매 목록을 불러오는 중입니다...</p>;
  if (error) return <p style={pageStyle}>에러: {error}</p>;

  return (
    <div style={pageStyle}>
      <header style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ marginBottom: '0.4rem' }}>공동구매</h2>
        <p style={{ margin: 0, color: '#4b5563', fontSize: '0.95rem' }}>
          이웃과 함께 저렴하게 장을 보고, 식재료를 나눠보세요.
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
          placeholder="제목, 품목, 설명, 위치, 작성자로 검색해보세요"
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

      <div
        style={{
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <p style={{ margin: 0, fontSize: '0.95rem' }}>
          총 <strong>{groupBuys.length}</strong>개의 공동구매가 열려있어요.
        </p>

        <Link
          to="/groupbuy/create"
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
          공동구매 등록
        </Link>
      </div>

      {groupBuys.length === 0 ? (
        <p style={{ color: '#6b7280' }}>아직 등록된 공동구매가 없습니다.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {groupBuys.map((gb) => {
            const participantCount = gb.participants?.length || 0;
            const totalUnits = gb.totalQuantity || gb.maxParticipants || 1;
            const rawPercent =
              totalUnits > 0 ? (participantCount / totalUnits) * 100 : 0;
            const percent = Math.min(100, Math.round(rawPercent));

            const isClosed =
              gb.status !== 'open' || new Date(gb.deadline) < new Date();

            return (
              <Link
                key={gb._id}
                to={`/groupbuy/${gb._id}`}
                style={cardStyle}
              >
                <h3 style={{ margin: 0 }}>{gb.title}</h3>
                <p
                  style={{
                    margin: '0.25rem 0 0.4rem',
                    color: '#4b5563',
                    fontSize: '0.9rem',
                  }}
                >
                  {gb.item}
                </p>

                <p
                  style={{
                    margin: 0,
                    fontSize: '0.86rem',
                    color: isClosed ? '#b91c1c' : '#374151',
                  }}
                >
                  {isClosed
                    ? '📌 종료된 공동구매'
                    : `참여 ${participantCount} / ${totalUnits} · 진행률 ${percent}%`}
                </p>

                <p
                  style={{
                    margin: '0.2rem 0 0',
                    fontSize: '0.86rem',
                    color: '#6b7280',
                  }}
                >
                  마감일: {gb.deadline?.slice(0, 10)} / 위치:{' '}
                  {gb.location || '위치 정보 없음'}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default GroupBuyList;
