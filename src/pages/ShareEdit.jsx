// src/pages/ShareEdit.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import apiClient from '../api/client';
import WhiteCard from '../components/common/WhiteCard';

const pageStyle = {
  maxWidth: '960px',
  margin: '0 auto',
  padding: '2rem 1.5rem 4rem',
};

function ShareEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth0();

  const [form, setForm] = useState({
    item: '',
    quantity: '',
    unit: '',
    expiry: '',
    location: '',
    image: '',
    description: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await apiClient.get(`/api/share/${id}`);
        const data = res.data || res;
        setForm({
          item: data.item || '',
          quantity: data.quantity || '',
          unit: data.unit || '',
          expiry: data.expiry ? data.expiry.slice(0, 10) : '',
          location: data.location || '',
          image: data.image || '',
          description: data.description || '',
        });
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      setError('로그인 후 이용 가능합니다.');
      return;
    }
    setSaving(true);
    setError('');

    try {
      await apiClient.patch(`/api/share/${id}`, {
        ...form,
        auth0Id: user.sub,
        quantity: form.quantity ? Number(form.quantity) : undefined,
      });
      alert('수정되었습니다.');
      navigate(`/share/${id}`);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p style={pageStyle}>불러오는 중...</p>;
  if (error) return <p style={pageStyle}>에러: {error}</p>;

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
        ← 이전 페이지로
      </button>

      <WhiteCard>
        <h2 style={{ marginBottom: '1.2rem' }}>나눔 수정</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.35rem' }}>
              나눔 품목명 *
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

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.35rem' }}>
              수량 / 단위 *
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                required
                min={1}
                style={{
                  flex: '0 0 140px',
                  padding: '0.6rem 0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                }}
              />
              <input
                type="text"
                name="unit"
                value={form.unit}
                onChange={handleChange}
                placeholder="개, 봉, 팩 등"
                style={{
                  flex: 1,
                  padding: '0.6rem 0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.35rem' }}>
              소비기한 (선택)
            </label>
            <input
              type="date"
              name="expiry"
              value={form.expiry}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.35rem' }}>
              위치 (동/역 근처) *
            </label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              placeholder="예: 아주대 정문, OO아파트 101동 앞"
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
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

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.35rem' }}>
              상세 설명 (선택)
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="상태, 나눔 가능 시간, 희망 만남 장소 등을 적어주세요."
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                resize: 'vertical',
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
            {saving ? '수정 중...' : '수정하기'}
          </button>
        </form>
      </WhiteCard>
    </div>
  );
}

export default ShareEdit;
