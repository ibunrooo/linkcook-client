// src/pages/GroupBuyCreate.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import apiClient from '../api/client';
import WhiteCard from '../components/common/WhiteCard';

const pageStyle = {
  maxWidth: '960px',
  margin: '0 auto',
  padding: '2rem 1.5rem 4rem',
};

function GroupBuyCreate() {
  const navigate = useNavigate();
  const { user } = useAuth0();
  const [form, setForm] = useState({
    title: '',
    item: '',
    description: '',
    totalQuantity: '',
    pricePerUnit: '',
    deadline: '',
    location: '',
    image: '',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const payload = {
        ...form,
        totalQuantity: form.totalQuantity
          ? Number(form.totalQuantity)
          : undefined,
        pricePerUnit: form.pricePerUnit
          ? Number(form.pricePerUnit)
          : undefined,
        auth0Id: user?.sub,
        nickname: user?.nickname || user?.name || 'anonymous',
      };

      await apiClient.post('/api/groupbuy', payload);
      alert('공동구매가 등록되었습니다.');
      navigate('/groupbuy');
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setSaving(false);
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
        ← 공동구매 목록으로
      </button>

      <WhiteCard>
        <h2 style={{ marginBottom: '1.2rem' }}>공동구매 등록</h2>

        <p style={{ marginBottom: '1rem', color: '#ef4444', fontSize: '0.9rem' }}>
          필수 항목(title, item, totalQuantity, pricePerUnit, deadline)을
          입력해 주세요.
        </p>

        <form onSubmit={handleSubmit}>
          {/* 제목 */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.35rem' }}>
              제목 *
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
              }}
            />
          </div>

          {/* 품목 */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.35rem' }}>
              품목 (예: 제주 귤 5kg) *
            </label>
            <input
              type="text"
              name="item"
              value={form.item}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
              }}
            />
          </div>

          {/* 설명 */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.35rem' }}>
              상세 설명 (선택)
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                resize: 'vertical',
              }}
            />
          </div>

          {/* 총 수량 */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.35rem' }}>
              총 수량 (참여 가능 인원) *
            </label>
            <input
              type="number"
              name="totalQuantity"
              value={form.totalQuantity}
              onChange={handleChange}
              min={1}
              required
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
              }}
            />
          </div>

          {/* 1인 금액 */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.35rem' }}>
              1인 참여 금액(원) *
            </label>
            <input
              type="number"
              name="pricePerUnit"
              value={form.pricePerUnit}
              onChange={handleChange}
              min={0}
              required
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
              }}
            />
          </div>

          {/* 마감일 */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.35rem' }}>
              마감일 *
            </label>
            <input
              type="datetime-local"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
              }}
            />
          </div>

          {/* 위치 */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.35rem' }}>
              나눔 위치 (동/역 근처)
            </label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="예: 아주대 정문, OO아파트 101동 로비"
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
              }}
            />
          </div>

          {/* 이미지 */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.35rem' }}>
              이미지 URL (선택)
            </label>
            <input
              type="url"
              name="image"
              value={form.image}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
              }}
            />
          </div>

          {error && (
            <p style={{ marginBottom: '0.8rem', color: '#ef4444', fontSize: '0.9rem' }}>
              에러: {error}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            style={{
              border: 'none',
              borderRadius: '999px',
              padding: '0.8rem 2.2rem',
              fontSize: '1rem',
              fontWeight: 600,
              color: '#1f2933',
              cursor: saving ? 'not-allowed' : 'pointer',
              background:
                'linear-gradient(90deg, #bbf7d0 0%, #fde68a 50%, #fed7aa 100%)',
              boxShadow: '0 10px 25px rgba(251, 146, 60, 0.2)',
            }}
          >
            {saving ? '등록 중...' : '등록하기'}
          </button>
        </form>
      </WhiteCard>
    </div>
  );
}

export default GroupBuyCreate;
