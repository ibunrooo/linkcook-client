// src/pages/RecipeEdit.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import apiClient from '../api/client';

function RecipeEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth0();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredientsText, setIngredientsText] = useState('');
  const [stepsText, setStepsText] = useState('');
  const [author, setAuthor] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiClient.get(`/api/recipes/${id}`);
        const data = res.data || res;
        setTitle(data.title || '');
        setDescription(data.description || '');
        setIngredientsText(
          Array.isArray(data.ingredients)
            ? data.ingredients.map((i) => i.name || '').join('\n')
            : ''
        );
        setStepsText(
          Array.isArray(data.steps)
            ? data.steps
                .sort((a, b) => a.order - b.order)
                .map((s) => s.text || '')
                .join('\n')
            : ''
        );
        setAuthor(data.author || '');
        setImage(data.image || '');
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      setError('로그인 후 이용 가능합니다.');
      return;
    }
    setSubmitting(true);
    setError('');
    const ingredients = ingredientsText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => ({ name: line, amount: '' }));

    const steps = stepsText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((text, idx) => ({ order: idx + 1, text }));

    try {
      await apiClient.patch(`/api/recipes/${id}`, {
        auth0Id: user.sub,
        title,
        description,
        ingredients,
        steps,
        image,
      });
      alert('수정되었습니다.');
      navigate(`/recipes/${id}`);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p style={{ padding: '2rem' }}>불러오는 중...</p>;
  if (error) return <p style={{ padding: '2rem' }}>에러: {error}</p>;

  return (
    <div
      style={{
        maxWidth: '720px',
        margin: '0 auto',
        padding: '2rem 1.5rem 4rem',
      }}
    >
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
        ← 이전 페이지로
      </button>

      <h2 style={{ marginBottom: '1rem' }}>레시피 수정</h2>

      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 8px 20px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>
            제목
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>
            한 줄 설명 (선택)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>
            썸네일 이미지 URL (선택)
          </label>
          <input
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>
            재료 (줄바꿈으로 구분)
          </label>
          <textarea
            value={ingredientsText}
            onChange={(e) => setIngredientsText(e.target.value)}
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

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>
            조리 순서 (줄바꿈으로 구분)
          </label>
          <textarea
            value={stepsText}
            onChange={(e) => setStepsText(e.target.value)}
            rows={5}
            style={{
              width: '100%',
              padding: '0.6rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              resize: 'vertical',
            }}
          />
        </div>

        <div style={{ marginBottom: '1.2rem' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>
            작성자 이름 (선택)
          </label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="닉네임 또는 이름"
            style={{
              width: '100%',
              padding: '0.6rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
            }}
          />
        </div>

        {error && <p style={{ color: '#dc2626', marginBottom: '0.8rem' }}>{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          style={{
            border: 'none',
            borderRadius: '999px',
            padding: '0.7rem 1.6rem',
            fontSize: '0.95rem',
            fontWeight: 600,
            color: '#1f2933',
            cursor: submitting ? 'not-allowed' : 'pointer',
            background:
              'linear-gradient(90deg, #bbf7d0 0%, #fde68a 50%, #fed7aa 100%)',
            boxShadow: '0 8px 18px rgba(251, 146, 60, 0.25)',
          }}
        >
          {submitting ? '수정 중...' : '수정하기'}
        </button>
      </form>
    </div>
  );
}

export default RecipeEdit;
