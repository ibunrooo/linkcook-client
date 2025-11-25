// src/pages/GroupBuyCreate.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function GroupBuyCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    item: '',
    totalQuantity: '',
    pricePerUnit: '',
    deadline: '',
    location: '',
    image: '',
    description: '',
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const payload = {
        ...form,
        totalQuantity: Number(form.totalQuantity),
        pricePerUnit: Number(form.pricePerUnit),
      };

      const res = await fetch('http://localhost:4000/api/groupbuy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message || '공동구매 등록에 실패했습니다.');
      }

      // 성공하면 목록으로 이동
      navigate('/groupbuy');
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: 700 }}>
        공동구매 등록
      </h2>
      <p style={{ color: '#e74c3c', marginBottom: '1.5rem' }}>
        필수 항목(<strong>title, item, totalQuantity, pricePerUnit, deadline</strong>)을
        입력해주세요.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* 제목 */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.3rem' }}>제목 *</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="예) 제주 감귤 5kg 같이 사요"
            required
            style={{ width: '100%', padding: '0.75rem', borderRadius: 8, border: '1px solid #ddd' }}
          />
        </div>

        {/* 품목 */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.3rem' }}>품목 / 수량 정보 *</label>
          <input
            type="text"
            name="item"
            value={form.item}
            onChange={handleChange}
            placeholder="예) 제주 감귤 5kg 4박스"
            required
            style={{ width: '100%', padding: '0.75rem', borderRadius: 8, border: '1px solid #ddd' }}
          />
        </div>

        {/* 설명 */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.3rem' }}>상세 설명 (선택)</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            placeholder="어디서 나눌지, 어떻게 분배할지 등 상세한 내용을 적어주세요."
            style={{ width: '100%', padding: '0.75rem', borderRadius: 8, border: '1px solid #ddd', resize: 'vertical' }}
          />
        </div>

        {/* 총 수량 */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.3rem' }}>총 수량 (참여 인원 수) *</label>
          <input
            type="number"
            name="totalQuantity"
            value={form.totalQuantity}
            onChange={handleChange}
            min="1"
            required
            placeholder="예) 4"
            style={{ width: '100%', padding: '0.75rem', borderRadius: 8, border: '1px solid #ddd' }}
          />
        </div>

        {/* 1인당 가격 */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.3rem' }}>1인당 가격 (원) *</label>
          <input
            type="number"
            name="pricePerUnit"
            value={form.pricePerUnit}
            onChange={handleChange}
            min="0"
            required
            placeholder="예) 15000"
            style={{ width: '100%', padding: '0.75rem', borderRadius: 8, border: '1px solid #ddd' }}
          />
        </div>

        {/* 마감일 */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.3rem' }}>마감 날짜 *</label>
          <input
            type="date"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.75rem', borderRadius: 8, border: '1px solid #ddd' }}
          />
        </div>

        {/* 위치 */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.3rem' }}>위치 (선택)</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="예) 아주대 정문 근처"
            style={{ width: '100%', padding: '0.75rem', borderRadius: 8, border: '1px solid #ddd' }}
          />
        </div>

        {/* 이미지 URL */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.3rem' }}>이미지 URL (선택)</label>
          <input
            type="url"
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="이미지 링크가 있으면 넣어주세요."
            style={{ width: '100%', padding: '0.75rem', borderRadius: 8, border: '1px solid #ddd' }}
          />
        </div>

        {error && (
          <p style={{ color: '#e74c3c', marginTop: '0.5rem' }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          style={{
            marginTop: '0.5rem',
            padding: '0.9rem',
            borderRadius: 999,
            border: 'none',
            background: submitting ? '#f1b258' : '#f6a623',
            color: '#fff',
            fontWeight: 600,
            fontSize: '1rem',
            cursor: submitting ? 'default' : 'pointer',
            boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
          }}
        >
          {submitting ? '등록 중...' : '등록하기'}
        </button>
      </form>
    </div>
  );
}

export default GroupBuyCreate;