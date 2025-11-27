// src/pages/MyPage.jsx
import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

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

function MyPage() {
  const { isAuthenticated, user, isLoading } = useAuth0();

  const [profile, setProfile] = useState(null); // 우리 서버 User
  const [nicknameInput, setNicknameInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // 🔹 Auth0 → 우리 서버 User 동기화 (항상 훅들은 위에!)
  useEffect(() => {
    const syncUser = async () => {
      if (!isAuthenticated || !user) return;

      setError('');
      setMessage('');

      try {
        const res = await fetch('http://localhost:4000/api/users/me', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            auth0Id: user.sub,
            email: user.email,
            nickname: user.nickname || user.name,
            avatar: user.picture,
          }),
        });

        const data = await res.json();

        if (!res.ok || data.success === false) {
          throw new Error(data.message || '유저 정보를 불러오지 못했습니다.');
        }

        setProfile(data.data);
        setNicknameInput(data.data.nickname || '');
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    syncUser();
  }, [isAuthenticated, user]);

  // 🔹 로딩 상태 우선 처리
  if (isLoading) {
    return (
      <div style={pageStyle}>
        <p>내 정보 불러오는 중...</p>
      </div>
    );
  }

  // 🔹 로그인 안 한 상태 처리 (훅들 *다 호출한 뒤*에)
  if (!isAuthenticated) {
    return (
      <div style={pageStyle}>
        <p>마이페이지는 로그인 후 이용할 수 있습니다.</p>
      </div>
    );
  }

  const handleNicknameSave = async (e) => {
    e.preventDefault();
    if (!profile || !nicknameInput.trim()) return;

    setSaving(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch(
        'http://localhost:4000/api/users/me/nickname',
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            auth0Id: profile.auth0Id,
            nickname: nicknameInput.trim(),
          }),
        }
      );

      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message || '닉네임 변경에 실패했습니다.');
      }

      setProfile(data.data);
      setMessage('닉네임이 저장되었습니다.');
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // 🔹 실제 화면 렌더
  return (
    <div style={pageStyle}>
      <h2 style={{ marginBottom: '1rem' }}>마이페이지</h2>

      <div style={cardStyle}>
        <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>기본 프로필</h3>

        {/* 이메일 */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ marginBottom: '0.4rem' }}>
            <strong>이메일</strong>
          </div>
          <div style={{ color: '#4b5563' }}>
            {user?.email || profile?.email || '-'}
          </div>
        </div>

        {/* 닉네임 수정 폼 */}
        <form onSubmit={handleNicknameSave} style={{ marginBottom: '1rem' }}>
          <div style={{ marginBottom: '0.4rem' }}>
            <strong>닉네임</strong>
          </div>
          <input
            type="text"
            value={nicknameInput}
            onChange={(e) => setNicknameInput(e.target.value)}
            style={{
              width: '100%',
              maxWidth: '320px',
              padding: '0.5rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              fontSize: '0.95rem',
            }}
            placeholder="닉네임을 입력하세요"
          />
          <div style={{ marginTop: '0.8rem' }}>
            <button
              type="submit"
              disabled={saving || !nicknameInput.trim()}
              style={{
                border: 'none',
                borderRadius: '999px',
                padding: '0.5rem 1.4rem',
                fontSize: '0.95rem',
                fontWeight: 600,
                color: '#1f2933',
                cursor: saving ? 'not-allowed' : 'pointer',
                background:
                  'linear-gradient(90deg, #bbf7d0 0%, #fde68a 50%, #fed7aa 100%)',
                boxShadow: '0 8px 20px rgba(251, 146, 60, 0.25)',
              }}
            >
              {saving ? '저장 중...' : '닉네임 저장'}
            </button>
          </div>
        </form>

        {message && (
          <p style={{ color: '#059669', marginTop: '0.5rem' }}>{message}</p>
        )}
        {error && (
          <p style={{ color: '#ef4444', marginTop: '0.5rem' }}>에러: {error}</p>
        )}

        <hr
          style={{
            margin: '2rem 0',
            border: 'none',
            borderTop: '1px solid #e5e7eb',
          }}
        />

        <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>
          비밀번호 변경은 Auth0 계정 관리 페이지에서 진행할 수 있습니다.
        </p>
      </div>
    </div>
  );
}

export default MyPage;