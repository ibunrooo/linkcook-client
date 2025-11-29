// src/pages/ShareDetail.jsx
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

function ShareDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth0();

  const [share, setShare] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profileNickname, setProfileNickname] = useState('');

  // 🔹 북마크 상태
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const { data } = await apiClient.get(`/api/share/${id}`);
        setShare(data);

        // 북마크 초기값 세팅 (백엔드에서 bookmarks: [auth0Id] 배열이라고 가정)
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
    // user가 나중에 로딩될 수도 있어서 user도 dependency에 포함
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

  const handleBookmarkClick = async () => {
    if (!user) {
      alert('로그인 후 이용할 수 있습니다.');
      return;
    }

    try {
      const { data } = await apiClient.post(`/api/share/${id}/bookmark`, {
        auth0Id: user.sub,
      });

      // 응답이 { bookmarked, bookmarkCount } 라고 가정
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

  if (loading) return <p style={pageStyle}>나눔 정보를 불러오는 중입니다...</p>;
  if (error) return <p style={pageStyle}>에러: {error}</p>;
  if (!share) return <p style={pageStyle}>나눔 정보를 찾을 수 없습니다.</p>;

  const title = share.title || share.item || '나눔 상세';
  const quantityText = share.unit
    ? `${share.quantity}${share.unit}`
    : `${share.quantity}`;

  const expiryDate = share.expiry ? new Date(share.expiry) : null;
  const now = new Date();
  const diffMs = expiryDate ? expiryDate.getTime() - now.getTime() : 0;
  const isExpired = expiryDate && diffMs <= 0;
  const isClosed = isExpired || share.status === 'closed';

  let leftText = '소비기한 정보 없음';
  if (expiryDate) {
    if (diffMs <= 0) {
      leftText = '소비기한이 지났습니다';
    } else {
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(
        (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const diffMinutes = Math.floor(
        (diffMs % (1000 * 60 * 60)) / (1000 * 60)
      );
      leftText = `${diffDays}일 ${diffHours}시간 ${diffMinutes}분 남음`;
    }
  }

  const ownerName = share.owner || share.author || '';
  const auth0Id = user?.sub;
  const userNickname = profileNickname || user?.nickname || user?.name;
  const isOwner =
    isAuthenticated &&
    ((share?.ownerAuth0Id && share.ownerAuth0Id === auth0Id) ||
      (!share?.ownerAuth0Id &&
        share?.owner &&
        userNickname &&
        share.owner === userNickname));

  const handleEdit = () => {
    navigate(`/share/${id}/edit`);
  };

  const handleDelete = async () => {
    if (!isOwner || !share) return;
    const ok = window.confirm('정말 삭제하시겠습니까?');
    if (!ok) return;
    try {
      await apiClient.delete(`/api/share/${share._id}`, {
        data: { auth0Id, nickname: userNickname },
      });
      alert('삭제되었습니다.');
      navigate('/share');
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

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
        ← 나눔 목록으로
      </button>

      <WhiteCard>
        {share.image && (
          <div
            style={{
              marginBottom: '1.25rem',
              borderRadius: '14px',
              overflow: 'hidden',
            }}
          >
            <img
              src={share.image}
              alt={title}
              style={{ width: '100%', display: 'block', objectFit: 'cover' }}
            />
          </div>
        )}

        <h2
          style={{
            fontSize: '1.8rem',
            marginBottom: '0.4rem',
            fontWeight: 700,
          }}
        >
          {title}
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
          나눔 품목: {share.item}
        </p>

        {share.description && (
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
            {share.description}
          </p>
        )}

        {/* 정보 섹션 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          <div>
            <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>나눔 수량</div>
            <div
              style={{
                fontSize: '1.3rem',
                fontWeight: 700,
                marginTop: '0.3rem',
              }}
            >
              {quantityText}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
              소비기한 / 남은 시간
            </div>
            <div
              style={{
                fontSize: '1.05rem',
                fontWeight: 600,
                marginTop: '0.3rem',
                color: isExpired ? '#ef4444' : '#111827',
              }}
            >
              {expiryDate
                ? `${share.expiry.slice(0, 10)} · ${leftText}`
                : leftText}
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
              {isClosed ? '나눔 종료' : '나눔 진행 중'}
            </div>
          </div>
        </div>

        {/* 위치 / 제공자 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            marginBottom: '0.5rem',
            fontSize: '0.95rem',
            color: '#4b5563',
          }}
        >
          {share.location && (
            <div>
              <strong>나눔 위치 : </strong>
              {share.location}
            </div>
          )}
          {ownerName && (
            <div>
              <strong>나눔 제공자 : </strong>
              {ownerName}
            </div>
          )}
        </div>
      </WhiteCard>
    </div>
  );
}

export default ShareDetail;
