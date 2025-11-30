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
    region: '',
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
        totalQuantity: form.totalQuantity
          ? Number(form.totalQuantity)
          : undefined,
        pricePerUnit: form.pricePerUnit
          ? Number(form.pricePerUnit)
          : undefined,
        image: imageUrl || form.image || '',
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

          {/* 지역 선택 */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.35rem' }}>
              지역
            </label>
            <select
              name="region"
              value={form.region}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                backgroundColor: '#fff',
              }}
            >
              <option value="">전체</option>
              <option value="서울">서울</option>
              <option value="경기">경기</option>
              <option value="인천">인천</option>
              <option value="강원">강원</option>
              <option value="충청">충청</option>
              <option value="전라">전라</option>
              <option value="경상">경상</option>
              <option value="제주">제주</option>
            </select>
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
