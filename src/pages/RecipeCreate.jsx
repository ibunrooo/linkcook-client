// src/pages/RecipeCreate.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import apiClient from '../api/client';

function RecipeCreate() {
  const navigate = useNavigate();
  const { user } = useAuth0();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredientsText, setIngredientsText] = useState(''); // 줄바꿈으로 재료 입력
  const [stepsText, setStepsText] = useState(''); // 줄바꿈으로 순서 입력
  const [author, setAuthor] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccessMsg('');

    // 간단 파싱: "양파 1개" → { name: '양파 1개', amount: '' } 처럼 일단 name만
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
      const body = {
        title,
        description,
        ingredients,
        steps,
        author: author || 'anonymous',
        auth0Id: user?.sub,
        nickname: user?.nickname || user?.name || 'anonymous',
      };

      const data = await apiClient.post('/api/recipes', body);

      setSuccessMsg('레시피가 등록되었습니다.');
      // data.data 에 새 레시피가 있다고 가정
      const newId = data.data?._id;
      if (newId) {
        setTimeout(() => {
          navigate(`/recipes/${newId}`);
        }, 700);
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

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
        ← 레시피 목록으로
      </button>

      <h2 style={{ marginBottom: '1rem' }}>레시피 등록</h2>
      <p style={{ marginTop: 0, marginBottom: '1.5rem', color: '#4b5563' }}>
        나만의 레시피를 공유해보세요.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 8px 20px rgba(0,0,0,0.04)',
        }}
      >
        {/* 제목 */}
        <div style={{ marginBottom: '1rem' }}>
          <label
            htmlFor="title"
            style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}
          >
            제목
          </label>
          <input
            id="title"
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

        {/* 한 줄 설명 */}
        <div style={{ marginBottom: '1rem' }}>
          <label
            htmlFor="description"
            style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}
          >
            한 줄 설명 (선택)
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="예: 초간단 새벽 야식용 김치볶음밥"
            style={{
              width: '100%',
              padding: '0.6rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
            }}
          />
        </div>

        {/* 재료 */}
        <div style={{ marginBottom: '1rem' }}>
          <label
            htmlFor="ingredients"
            style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}
          >
            재료 (줄바꿈으로 구분)
          </label>
          <textarea
            id="ingredients"
            value={ingredientsText}
            onChange={(e) => setIngredientsText(e.target.value)}
            rows={4}
            placeholder={'예)\n김치 1컵\n밥 1공기\n대파 조금'}
            style={{
              width: '100%',
              padding: '0.6rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              resize: 'vertical',
            }}
          />
        </div>

        {/* 조리 순서 */}
        <div style={{ marginBottom: '1rem' }}>
          <label
            htmlFor="steps"
            style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}
          >
            조리 순서 (줄바꿈으로 구분)
          </label>
          <textarea
            id="steps"
            value={stepsText}
            onChange={(e) => setStepsText(e.target.value)}
            rows={5}
            placeholder={'예)\n팬에 기름을 두르고 파를 볶는다.\n김치를 넣고 함께 볶는다.\n밥을 넣고 골고루 섞어준다.'}
            style={{
              width: '100%',
              padding: '0.6rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              resize: 'vertical',
            }}
          />
        </div>

        {/* 작성자 */}
        <div style={{ marginBottom: '1.2rem' }}>
          <label
            htmlFor="author"
            style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}
          >
            작성자 이름 (선택)
          </label>
          <input
            id="author"
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

        {error && (
          <p style={{ color: '#dc2626', marginBottom: '0.8rem' }}>{error}</p>
        )}
        {successMsg && (
          <p style={{ color: '#16a34a', marginBottom: '0.8rem' }}>{successMsg}</p>
        )}

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
          {submitting ? '등록 중...' : '레시피 등록하기'}
        </button>
      </form>
    </div>
  );
}

export default RecipeCreate;
