// src/pages/ShareCreate.jsx
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

function ShareCreate() {
  const navigate = useNavigate();
  const { user } = useAuth0();
  const [form, setForm] = useState({
    item: '',
    quantity: '',
    unit: '',
    expiry: '',
    location: '',
    image: '',
    description: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError('');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await apiClient.post('/api/uploads', formData);
      const url = res.url || res.data?.url || '';
      setImageFile(file);
      setImageUrl(url);
    } catch (err) {
      console.error(err);
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const payload = {
        ...form,
        quantity: form.quantity ? Number(form.quantity) : undefined,
        image: imageUrl || form.image || '',
        auth0Id: user?.sub,
        nickname: user?.nickname || user?.name || 'anonymous',
      };

      await apiClient.post('/api/share', payload);
      alert('나눔이 등록되었습니다.');
      navigate('/share');
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
        ← 나눔 목록으로
      </button>

      <WhiteCard>
        <h2 style={{ marginBottom: '1.2rem' }}>나눔 등록</h2>

        <p style={{ marginBottom: '1rem', color: '#ef4444', fontSize: '0.9rem' }}>
          필수 항목(품목명, 수량, 위치)을 입력해 주세요.
        </p>

        <form onSubmit={handleSubmit}>
          {/* 품목명 */}
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

          {/* 수량 */}
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

          {/* 소비기한 */}
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

          {/* 위치 */}
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

          {/* 이미지 업로드 */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>
              썸네일 이미지 (선택)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ marginBottom: '0.5rem' }}
            />
            {uploading && <p style={{ fontSize: '0.85rem' }}>이미지 업로드 중...</p>}
            {uploadError && (
              <p style={{ fontSize: '0.85rem', color: '#ef4444' }}>에러: {uploadError}</p>
            )}
            {imageUrl && (
              <div style={{ marginTop: '0.5rem' }}>
                <img
                  src={imageUrl}
                  alt="업로드 미리보기"
                  style={{
                    width: '200px',
                    height: 'auto',
                    borderRadius: '12px',
                    objectFit: 'cover',
                    border: '1px solid #e5e7eb',
                  }}
                />
              </div>
            )}
          </div>

          {/* 이미지 URL */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.35rem' }}>
              이미지 URL (선택)
            </label>
            <input
              type="url"
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="있다면 사진 링크를 붙여주세요."
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
              }}
            />
          </div>

          {/* 상세 설명 */}
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
            {saving ? '등록 중...' : '등록하기'}
          </button>
        </form>
      </WhiteCard>
    </div>
  );
}

export default ShareCreate;
