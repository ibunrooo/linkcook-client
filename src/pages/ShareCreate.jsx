// src/pages/ShareCreate.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const pageStyle = {
  maxWidth: '720px',
  margin: '0 auto',
  padding: '2rem 1.5rem 4rem',
};

const cardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '18px',
  boxShadow: '0 10px 24px rgba(0,0,0,0.06)',
  padding: '2rem 1.75rem',
};

const labelStyle = {
  fontSize: '0.9rem',
  fontWeight: 600,
  marginBottom: '0.35rem',
};

const inputStyle = {
  width: '100%',
  borderRadius: '10px',
  border: '1px solid #e5e7eb',
  padding: '0.7rem 0.85rem',
  fontSize: '0.95rem',
  outline: 'none',
};

const textareaStyle = {
  ...inputStyle,
  minHeight: '90px',
  resize: 'vertical',
};

const helperTextStyle = {
  fontSize: '0.8rem',
  color: '#6b7280',
  marginTop: '0.2rem',
};

const submitButtonStyle = {
  display: 'block',
  margin: '1.8rem auto 0',
  border: 'none',
  borderRadius: '999px',
  padding: '0.9rem 2.8rem',
  fontSize: '1rem',
  fontWeight: 700,
  cursor: 'pointer',
  background: 'linear-gradient(90deg, #fef9c3 0%, #fde68a 40%, #fed7aa 100%)',
  color: '#1f2933',
  boxShadow: '0 10px 24px rgba(250, 204, 21, 0.35)',
};

function ShareCreate() {
  const navigate = useNavigate();

  const [item, setItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expiry, setExpiry] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!item.trim() || !location.trim()) {
      setError('나눔 품목명과 위치는 필수입니다.');
      return;
    }

    setLoading(true);

    try {
      const body = {
        item: item.trim(),
        quantity: quantity ? Number(quantity) : 1,
        expiry: expiry || null,
        location: location.trim(),
        image: image.trim(),
        description: description.trim(),
      };

      const res = await fetch('http://localhost:4000/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message || '나눔 등록에 실패했습니다.');
      }

      setSuccessMsg('나눔이 등록되었습니다!');
      // 잠깐 보여주고 목록으로 이동
      setTimeout(() => navigate('/share'), 1000);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <button
        type="button"
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

      <div style={cardStyle}>
        <h2
          style={{
            fontSize: '1.7rem',
            fontWeight: '700',
            marginBottom: '0.4rem',
          }}
        >
          나눔 등록
        </h2>
        <p style={{ color: '#4b5563', marginBottom: '1.4rem', fontSize: '0.95rem' }}>
          남은 재료를 동네 이웃과 함께 나누고, 음식 쓰레기를 줄여보세요.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <div style={labelStyle}>나눔 품목명 *</div>
            <input
              style={inputStyle}
              placeholder="예) 양파, 우유 1L, 토마토 3개"
              value={item}
              onChange={(e) => setItem(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <div style={labelStyle}>수량 / 단위</div>
            <input
              style={inputStyle}
              placeholder="예) 2개, 1봉지, 반 통 등"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <div style={labelStyle}>소비기한</div>
            <input
              type="date"
              style={inputStyle}
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
            />
            <div style={helperTextStyle}>
              유통기한 또는 소비기한을 알고 있다면 입력해주세요.
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <div style={labelStyle}>위치 (동/역 근처) *</div>
            <input
              style={inputStyle}
              placeholder="예) 아주대 정문, 00아파트 정문, ○○역 3번 출구 앞"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <div style={labelStyle}>이미지 URL (선택)</div>
            <input
              style={inputStyle}
              placeholder="있다면 사진 링크를 입력해주세요."
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: '0.5rem' }}>
            <div style={labelStyle}>상세 설명 (선택)</div>
            <textarea
              style={textareaStyle}
              placeholder="상태, 나눔 가능 시간, 희망 만남 장소 등을 적어주세요."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {error && (
            <p
              style={{
                marginTop: '0.4rem',
                color: '#ef4444',
                fontSize: '0.9rem',
                textAlign: 'center',
              }}
            >
              {error}
            </p>
          )}
          {successMsg && (
            <p
              style={{
                marginTop: '0.4rem',
                color: '#059669',
                fontSize: '0.9rem',
                textAlign: 'center',
              }}
            >
              {successMsg}
            </p>
          )}

          <button type="submit" style={submitButtonStyle} disabled={loading}>
            {loading ? '등록 중...' : '등록하기'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ShareCreate;