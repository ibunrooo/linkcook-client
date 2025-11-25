// src/pages/GroupBuyDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const pageStyle = {
  maxWidth: '960px',
  margin: '0 auto',
  padding: '2rem 1.5rem 4rem',
};

const cardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '18px',
  boxShadow: '0 8px 20px rgba(0,0,0,0.04)',
  padding: '2rem',
};

const progressBarOuter = {
  width: '100%',
  height: '10px',
  borderRadius: '999px',
  backgroundColor: '#f3f4f6',
  overflow: 'hidden',
  marginTop: '0.75rem',
};

const progressBarInnerBase = {
  height: '100%',
  borderRadius: '999px',
  background: 'linear-gradient(90deg, #a8e063 0%, #f6d365 50%, #fda085 100%)',
  transition: 'width 0.4s ease',
};

function GroupBuyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [groupBuy, setGroupBuy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/groupbuy/${id}`);
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

    fetchDetail();
  }, [id]);

  const handleJoin = async () => {
    if (!groupBuy) return;
    setIsJoining(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await fetch(
        `http://localhost:4000/api/groupbuy/${groupBuy._id}/join`,
        { method: 'POST' }
      );
      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message || '공동구매 참여에 실패했습니다.');
      }

      setGroupBuy(data.data); // 최신 상태로 업데이트
      setSuccessMsg('공동구매에 참여했습니다!');
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsJoining(false);
    }
  };

  if (loading) return <p style={pageStyle}>공동구매 정보를 불러오는 중입니다...</p>;
  if (error) return <p style={pageStyle}>에러: {error}</p>;
  if (!groupBuy) return <p style={pageStyle}>공동구매 정보를 찾을 수 없습니다.</p>;

  const participantCount = groupBuy.participants?.length || 0;
  const totalUnits =
    groupBuy.totalQuantity || groupBuy.maxParticipants || 1;

  const rawPercent =
    totalUnits > 0 ? (participantCount / totalUnits) * 100 : 0;
  const progressPercent = Math.min(100, Math.round(rawPercent));

  const deadline = new Date(groupBuy.deadline);
  const now = new Date();
  const diffMs = deadline.getTime() - now.getTime();
  const isClosed = diffMs <= 0 || groupBuy.status !== 'open';

  let leftText = '마감됨';
  if (!isClosed && diffMs > 0) {
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(
      (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const diffMinutes = Math.floor(
      (diffMs % (1000 * 60 * 60)) / (1000 * 60)
    );
    leftText = `${diffDays}일 ${diffHours}시간 ${diffMinutes}분 남음`;
  }

  const perPersonPrice = groupBuy.pricePerUnit || 0;

  return (
    <div style={pageStyle}>
      <button
        onClick={() => navigate(-1)}
        style={{
          border: 'none',
          background: 'none',
          color: '#6b7280',
          marginBottom: '1rem',
          cursor: 'pointer',
        }}
      >
        ← 공동구매 목록으로
      </button>

      <div style={cardStyle}>
        <h2
          style={{
            fontSize: '1.8rem',
            marginBottom: '0.4rem',
            fontWeight: '700',
          }}
        >
          {groupBuy.title}
        </h2>
        <p style={{ color: '#4b5563', marginBottom: '0.5rem' }}>
          {groupBuy.item}
        </p>
        {groupBuy.description && (
          <p
            style={{
              marginTop: '1rem',
              marginBottom: '1.5rem',
              padding: '1rem 1.25rem',
              backgroundColor: '#f9fafb',
              borderRadius: '12px',
              color: '#374151',
              lineHeight: 1.5,
            }}
          >
            {groupBuy.description}
          </p>
        )}

        {/* 진행률 */}
        <div style={{ marginTop: '1.5rem', marginBottom: '2rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              marginBottom: '0.25rem',
            }}
          >
            <span style={{ fontWeight: 600 }}>
              참여 {participantCount} / {totalUnits}
            </span>
            <span style={{ fontSize: '0.9rem', color: '#4b5563' }}>
              진행률 {progressPercent}%
            </span>
          </div>
          <div style={progressBarOuter}>
            <div
              style={{
                ...progressBarInnerBase,
                width: `${progressPercent}%`,
              }}
            />
          </div>
        </div>

        {/* 하단 정보 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          <div>
            <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
              1인 참여 금액
            </div>
            <div
              style={{ fontSize: '1.3rem', fontWeight: '700', marginTop: '0.3rem' }}
            >
              {perPersonPrice.toLocaleString()}원
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
              마감까지
            </div>
            <div
              style={{
                fontSize: '1.05rem',
                fontWeight: '600',
                marginTop: '0.3rem',
                color: isClosed ? '#ef4444' : '#111827',
              }}
            >
              {leftText}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
              상태
            </div>
            <div
              style={{
                marginTop: '0.3rem',
                display: 'inline-block',
                padding: '0.3rem 0.75rem',
                borderRadius: '999px',
                fontSize: '0.85rem',
                fontWeight: 600,
                backgroundColor: isClosed ? '#fee2e2' : '#dcfce7',
                color: isClosed ? '#b91c1c' : '#166534',
              }}
            >
              {isClosed ? '종료' : '진행 중'}
            </div>
          </div>
        </div>

        {/* 위치 / 주최자 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            marginBottom: '2rem',
            fontSize: '0.95rem',
            color: '#4b5563',
          }}
        >
          {groupBuy.location && (
            <div>
              <strong>나눔 위치 : </strong>
              {groupBuy.location}
            </div>
          )}
          {groupBuy.owner && (
            <div>
              <strong>주최자 : </strong>
              {groupBuy.owner}
            </div>
          )}
        </div>

        {/* 참여 버튼 / 메시지 */}
        {!isClosed && (
          <button
            onClick={handleJoin}
            disabled={isJoining || participantCount >= totalUnits}
            style={{
              border: 'none',
              borderRadius: '999px',
              padding: '0.9rem 2.5rem',
              fontSize: '1rem',
              fontWeight: 600,
              color: '#ffffff',
              cursor:
                isJoining || participantCount >= totalUnits
                  ? 'not-allowed'
                  : 'pointer',
              background:
                'linear-gradient(90deg, #34d399 0%, #facc15 50%, #fb923c 100%)',
              boxShadow: '0 10px 25px rgba(251, 146, 60, 0.35)',
            }}
          >
            {participantCount >= totalUnits
              ? '모집 인원 완료'
              : isJoining
              ? '참여 중...'
              : '공동구매 참여하기'}
          </button>
        )}

        {successMsg && (
          <p
            style={{
              marginTop: '1rem',
              color: '#059669',
              fontWeight: 500,
            }}
          >
            {successMsg}
          </p>
        )}
        {isClosed && (
          <p
            style={{
              marginTop: '1rem',
              color: '#ef4444',
              fontWeight: 500,
            }}
          >
            공동구매가 종료되었습니다.
          </p>
        )}
      </div>
    </div>
  );
}

export default GroupBuyDetail;