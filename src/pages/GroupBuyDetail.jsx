// src/pages/GroupBuyDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import apiClient from '../api/client';
import WhiteCard from '../components/common/WhiteCard';

const pageStyle = {
  maxWidth: '960px',
  margin: '0 auto',
  padding: '2rem 1.5rem 4rem',
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
  const { user, isAuthenticated } = useAuth0();

  const [groupBuy, setGroupBuy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [profileNickname, setProfileNickname] = useState('');

  // 🔹 북마크 상태
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const { data } = await apiClient.get(`/api/groupbuy/${id}`);
        setGroupBuy(data);

        const bookmarks = Array.isArray(data.bookmarks) ? data.bookmarks : [];
        setBookmarkCount(bookmarks.length);
        if (user && user.sub) {
          setBookmarked(bookmarks.includes(user.sub));
        } else {
          setBookmarked(false);
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id, user]);

  useEffect(() => {
    const syncProfile = async () => {
      if (!isAuthenticated || !user?.sub) return;
      try {
        const res = await fetch('http://localhost:4000/api/users/me', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            auth0Id: user.sub,
            email: user.email,
            nickname: user.nickname || user.name,
            avatar: user.picture,
          }),
        });
        const data = await res.json();
        if (res.ok && data?.data) {
          setProfileNickname(data.data.nickname || '');
        }
      } catch (e) {
        // ignore
      }
    };
    syncProfile();
  }, [isAuthenticated, user]);

  const auth0Id = user?.sub;
  const userNickname = profileNickname || user?.nickname || user?.name;
  const isOwner =
    isAuthenticated &&
    ((groupBuy?.ownerAuth0Id && groupBuy.ownerAuth0Id === auth0Id) ||
      (!groupBuy?.ownerAuth0Id &&
        groupBuy?.owner &&
        userNickname &&
        groupBuy.owner === userNickname));

  const handleEdit = () => {
    navigate(`/groupbuy/${id}/edit`);
  };

  const handleDelete = async () => {
    if (!isOwner || !groupBuy) return;
    const ok = window.confirm('정말 삭제하시겠습니까?');
    if (!ok) return;
    try {
      await apiClient.delete(`/api/groupbuy/${groupBuy._id}`, {
        data: { auth0Id, nickname: userNickname },
      });
      alert('삭제되었습니다.');
      navigate('/groupbuy');
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleJoin = async () => {
    if (!groupBuy) return;
    setIsJoining(true);
    setError('');
    setSuccessMsg('');

    try {
      const { data } = await apiClient.post(
        `/api/groupbuy/${groupBuy._id}/join`,
        {}
      );
      setGroupBuy(data);
      setSuccessMsg('공동구매에 참여했습니다!');
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsJoining(false);
    }
  };

  const handleBookmarkClick = async () => {
    if (!user) {
      alert('로그인 후 이용할 수 있습니다.');
      return;
    }

    try {
      const { data } = await apiClient.post(`/api/groupbuy/${id}/bookmark`, {
        auth0Id: user.sub,
      });

      setBookmarked(Boolean(data.bookmarked));
      setBookmarkCount(typeof data.bookmarkCount === 'number' ? data.bookmarkCount : 0);
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
          '북마크 처리 중 오류가 발생했습니다.'
      );
    }
  };

  if (loading) return <p style={pageStyle}>공동구매 정보를 불러오는 중입니다...</p>;
  if (error) return <p style={pageStyle}>에러: {error}</p>;
  if (!groupBuy) return <p style={pageStyle}>공동구매 정보를 찾을 수 없습니다.</p>;

  const participantCount = groupBuy.participants?.length || 0;
  const totalUnits = groupBuy.totalQuantity || groupBuy.maxParticipants || 1;
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

  const perPersonPrice = Number(groupBuy.pricePerUnit) || 0;

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

      <WhiteCard>
        <h2
          style={{
            fontSize: '1.8rem',
            marginBottom: '0.4rem',
            fontWeight: '700',
          }}
        >
          {groupBuy.title}
        </h2>

        {isOwner && (
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <button
              type="button"
              onClick={handleEdit}
              style={{
                border: '1px solid #d1d5db',
                borderRadius: '10px',
                padding: '0.45rem 0.9rem',
                cursor: 'pointer',
                background: '#f9fafb',
              }}
            >
              수정
            </button>
            <button
              type="button"
              onClick={handleDelete}
              style={{
                border: '1px solid #fca5a5',
                borderRadius: '10px',
                padding: '0.45rem 0.9rem',
                cursor: 'pointer',
                background: '#fee2e2',
                color: '#b91c1c',
              }}
            >
              삭제
            </button>
          </div>
        )}

        {/* 🔹 북마크 버튼 */}
        <button
          type="button"
          onClick={handleBookmarkClick}
          style={{
            border: 'none',
            background: 'none',
            padding: 0,
            marginBottom: '0.8rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            cursor: 'pointer',
            color: bookmarked ? '#fbbf24' : '#9ca3af',
            fontSize: '0.95rem',
          }}
        >
          <span style={{ fontSize: '1.1rem' }}>
            {bookmarked ? '★' : '☆'}
          </span>
          <span>북마크 {bookmarkCount}</span>
        </button>

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
              style={{
                fontSize: '1.3rem',
                fontWeight: '700',
                marginTop: '0.3rem',
              }}
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
            <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>상태</div>
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
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={handleJoin}
              disabled={isJoining || participantCount >= totalUnits}
              style={{
                border: 'none',
                borderRadius: '999px',
                padding: '0.9rem 2.5rem',
                fontSize: '1rem',
                fontWeight: 600,
                color: '#1f2933',
                cursor:
                  isJoining || participantCount >= totalUnits
                    ? 'not-allowed'
                    : 'pointer',
                background:
                  'linear-gradient(90deg, #bbf7d0 0%, #fde68a 50%, #fed7aa 100%)',
                boxShadow: '0 10px 25px rgba(251, 146, 60, 0.25)',
                display: 'inline-block',
              }}
            >
              {participantCount >= totalUnits
                ? '모집 인원 완료'
                : isJoining
                ? '참여 중...'
                : '공동구매 참여하기'}
            </button>
          </div>
        )}

        {successMsg && (
          <p
            style={{
              marginTop: '1rem',
              color: '#059669',
              fontWeight: 500,
              textAlign: 'center',
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
              textAlign: 'center',
            }}
          >
            공동구매가 종료되었습니다.
          </p>
        )}
      </WhiteCard>
    </div>
  );
}

export default GroupBuyDetail;
