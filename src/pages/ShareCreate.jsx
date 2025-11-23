// src/pages/ShareCreate.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ShareCreate() {
  const navigate = useNavigate();

  const [item, setItem] = useState('');          // 나눔 품목명
  const [quantity, setQuantity] = useState('');  // 수량
  const [expiry, setExpiry] = useState('');      // 소비기한 (문자열로)
  const [location, setLocation] = useState('');  // 위치
  const [image, setImage] = useState('');        // 이미지 URL
  const [description, setDescription] = useState(''); // 상세 설명

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 프론트에서도 1차 검증
    if (!item || !location) {
      setError('item(식재료명)과 location은 필수입니다.');
      return;
    }

    try {
      setLoading(true);

      const res = await fetch('http://localhost:4000/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item,
          quantity,
          expiry,
          location,
          image,
          description,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message || '나눔 등록에 실패했습니다.');
      }

      // 성공하면 나눔 목록으로 이동
      navigate('/share');
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: '2rem' }}>
      <h2>나눔 등록</h2>

      <form onSubmit={handleSubmit} style={{ maxWidth: 600 }}>
        <div style={{ marginBottom: '1rem' }}>
          <label>
            나눔 품목명 *
            <input
              type="text"
              value={item}
              onChange={(e) => setItem(e.target.value)}
              placeholder="예) 양파"
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>
            수량 / 단위
            <input
              type="text"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="예) 2개, 500g"
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>
            소비기한
            <input
              type="date"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>
            위치 (동/역 근처) *
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="예) 아주대 정문, 수원역 근처"
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>
            이미지 URL (선택)
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="있다면 사진 링크"
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>
            상세 설명 (선택)
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="상태, 나눔 가능 시간, 희망 만남 장소 등을 적어주세요."
              rows={4}
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            />
          </label>
        </div>

        {error && (
          <p style={{ color: 'red', marginBottom: '1rem' }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '0.5rem 1.5rem',
            backgroundColor: '#7c3aed',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          {loading ? '등록 중...' : '등록하기'}
        </button>
      </form>
    </main>
  );
}

export default ShareCreate;
