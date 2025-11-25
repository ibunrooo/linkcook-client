// src/pages/GroupBuyDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:4000/api/groupbuy';

function formatRemainingTime(deadline) {
  if (!deadline) return '';
  const now = new Date();
  const end = new Date(deadline);
  const diff = end - now;

  if (diff <= 0) return '마감된 공동구매입니다.';

  const totalMinutes = Math.floor(diff / (1000 * 60));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) return `${days}일 ${hours}시간 ${minutes}분 남음`;
  if (hours > 0) return `${hours}시간 ${minutes}분 남음`;
  return `${minutes}분 남음`;
}

function GroupBuyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [groupBuy, setGroupBuy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [joining, setJoining] = useState(false);
  const [joinMessage, setJoinMessage] = useState('');

  const fetchDetail = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`${API_BASE}/${id}`);
      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message || '공동구매 정보를 불러오지 못했습니다.');
      }

      setGroupBuy(data.data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleJoin = async () => {
    if (!groupBuy) return;

    setJoinMessage('');
    setError('');
    setJoining(true);

    try {
      const res = await fetch(`${API_BASE}/${id}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: 1 }), // 일단 1개씩 참여
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message || '공동구매 참여에 실패했습니다.');
      }

      setGroupBuy(data.data);
      setJoinMessage('공동구매에 참여했습니다!');
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return <p style={{ padding: '2rem' }}>공동구매 정보를 불러오는 중입니다...</p>;
  }

  if (error) {
    return (
      <div style={{ padding: '2rem' }}>
        <p>에러: {error}</p>
        <button
          onClick={fetchDetail}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            borderRadius: '999px',
            border: '1px solid #ccc',
            cursor: 'pointer',
          }}
        >
          다시 시도하기
        </button>
      </div>
    );
  }

  if (!groupBuy) {
    return (
      <div style={{ padding: '2rem' }}>
        <p>공동구매 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const {
    title,
    item,
    description,
    totalQuantity,
    currentQuantity,
    pricePerUnit,
    deadline,
    status,
  } = groupBuy;

  const progress =
    totalQuantity > 0 ? Math.round((currentQuantity / totalQuantity) * 100) : 0;

  const remainingText = formatRemainingTime(deadline);
  const isClosed =
    status === 'CLOSED' || new Date(deadline) - new Date() <= 0 || currentQuantity >= totalQuantity;

  return (
    <div style={{ padding: '2rem', maxWidth: '720px', margin: '0 auto' }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: '1rem',
          padding: '0.4rem 0.9rem',
          borderRadius: '999px',
          border: '1px solid #ddd',
          backgroundColor: '#fff',
          cursor: 'pointer',
          fontSize: '0.9rem',
        }}
      >
        ← 목록으로
      </button>

      <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>{title}</h2>
      <p style={{ color: '#666', marginBottom: '0.75rem' }}>{item}</p>

      {description && (
        <p
          style={{
            marginBottom: '1.5rem',
            padding: '0.75rem 1rem',
            borderRadius: '12px',
            background: '#f9fafb',
            color: '#555',
            lineHeight: 1.5,
          }}
        >
          {description}
        </p>
      )}

      {/* 진행률 바 */}
      <div style={{ marginBottom: '1rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '0.25rem',
            fontSize: '0.9rem',
            color: '#555',
          }}
        >
          <span>
            참여 {currentQuantity} / {totalQuantity}
          </span>
          <span>{progress}%</span>
        </div>
        <div
          style={{
            width: '100%',
            height: '10px',
            borderRadius: '999px',
            backgroundColor: '#edf2f7',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              borderRadius: '999px',
              background:
                'linear-gradient(90deg, #90e36a 0%, #ffb347 50%, #ff8c42 100%)',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>

      {/* 가격 / 남은 시간 */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          fontSize: '0.94rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <strong>1인 참여 금액</strong>
          <div style={{ marginTop: '0.25rem' }}>
            {pricePerUnit ? `${pricePerUnit.toLocaleString()}원` : '—'}
          </div>
        </div>
        <div>
          <strong>마감까지</strong>
          <div
            style={{
              marginTop: '0.25rem',
              color: isClosed ? '#e53e3e' : '#2b6cb0',
            }}
          >
            {remainingText}
          </div>
        </div>
        <div>
          <strong>상태</strong>
          <div style={{ marginTop: '0.25rem' }}>
            {isClosed ? '마감' : '진행 중'}
          </div>
        </div>
      </div>

      {/* 참여하기 버튼 */}
      <button
        onClick={handleJoin}
        disabled={isClosed || joining}
        style={{
          padding: '0.75rem 1.8rem',
          borderRadius: '999px',
          border: 'none',
          fontSize: '1rem',
          fontWeight: 600,
          color: '#fff',
          cursor: isClosed || joining ? 'not-allowed' : 'pointer',
          background: isClosed
            ? '#cbd5e0'
            : 'linear-gradient(135deg, #90e36a 0%, #ffb347 100%)',
          boxShadow: isClosed
            ? 'none'
            : '0 8px 16px rgba(255, 140, 66, 0.25)',
          transition: 'transform 0.1s ease, box-shadow 0.1s ease',
        }}
      >
        {isClosed
          ? '공동구매가 마감되었습니다'
          : joining
          ? '참여 중...'
          : '공동구매 참여하기'}
      </button>

      {/* 참여/에러 메시지 */}
      <div style={{ marginTop: '1rem', minHeight: '1.5rem' }}>
        {joinMessage && (
          <p style={{ color: '#38a169', fontSize: '0.9rem' }}>{joinMessage}</p>
        )}
        {error && (
          <p style={{ color: '#e53e3e', fontSize: '0.9rem' }}>에러: {error}</p>
        )}
        {isClosed && (
          <p style={{ marginTop: '0.5rem', color: '#e53e3e', fontSize: '0.9rem' }}>
            🎉 모집 인원이 모두 찼거나 마감 시간이 지나 공동구매가 종료되었습니다.
          </p>
        )}
      </div>
    </div>
  );
}

export default GroupBuyDetail;