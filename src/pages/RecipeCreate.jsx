// src/pages/RecipeCreate.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:4000/api';

export default function RecipeCreate() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [image, setImage] = useState('');

  const [ingredients, setIngredients] = useState([
    { name: '', amount: '' },
  ]);

  const [steps, setSteps] = useState([
    { order: 1, text: '' },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // 재료 입력 변경
  const handleIngredientChange = (index, field, value) => {
    setIngredients(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const addIngredientRow = () => {
    setIngredients(prev => [...prev, { name: '', amount: '' }]);
  };

  const removeIngredientRow = (index) => {
    setIngredients(prev => {
      if (prev.length === 1) return prev; // 최소 1줄 유지
      const copy = [...prev];
      copy.splice(index, 1);
      return copy;
    });
  };

  // 단계 입력 변경
  const handleStepChange = (index, value) => {
    setSteps(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], text: value };
      return copy;
    });
  };

  const addStepRow = () => {
    setSteps(prev => [
      ...prev,
      { order: prev.length + 1, text: '' },
    ]);
  };

  const removeStepRow = (index) => {
    setSteps(prev => {
      if (prev.length === 1) return prev;
      const copy = [...prev];
      copy.splice(index, 1);
      // order 다시 번호 매기기
      return copy.map((s, i) => ({ ...s, order: i + 1 }));
    });
  };

  // 폼 제출
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('레시피 제목은 필수입니다.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title,
        description,
        author,
        image,
        ingredients: ingredients
          .filter(i => i.name.trim() !== '')
          .map(i => ({
            name: i.name.trim(),
            amount: i.amount.trim(),
          })),
        steps: steps
          .filter(s => s.text.trim() !== '')
          .map((s, index) => ({
            order: index + 1,
            text: s.text.trim(),
          })),
      };

      const res = await fetch(`${API_BASE}/recipes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || '레시피 등록에 실패했습니다.');
      }

      // 등록 성공 → 상세 페이지로 이동 (data.data._id 기준)
      const newId = data.data?._id;
      if (newId) {
        navigate(`/recipes/${newId}`);
      } else {
        navigate('/recipes');
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main style={{ maxWidth: '720px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1.5rem' }}>
        레시피 등록
      </h1>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
        {/* 기본 정보 */}
        <section>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '.5rem' }}>
            레시피 제목 *
          </label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="예) 김치볶음밥"
            required
            style={{ width: '100%', padding: '.6rem .8rem', borderRadius: 4, border: '1px solid #ccc' }}
          />

          <label style={{ display: 'block', fontWeight: 600, margin: '1rem 0 .5rem' }}>
            한 줄 소개
          </label>
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="남은 김치랑 밥으로 딱 좋은 레시피"
            style={{ width: '100%', padding: '.6rem .8rem', borderRadius: 4, border: '1px solid #ccc' }}
          />

          <label style={{ display: 'block', fontWeight: 600, margin: '1rem 0 .5rem' }}>
            작성자 이름
          </label>
          <input
            type="text"
            value={author}
            onChange={e => setAuthor(e.target.value)}
            placeholder="닉네임 (선택)"
            style={{ width: '100%', padding: '.6rem .8rem', borderRadius: 4, border: '1px solid #ccc' }}
          />

          <label style={{ display: 'block', fontWeight: 600, margin: '1rem 0 .5rem' }}>
            이미지 URL
          </label>
          <input
            type="text"
            value={image}
            onChange={e => setImage(e.target.value)}
            placeholder="이미지 링크 (선택)"
            style={{ width: '100%', padding: '.6rem .8rem', borderRadius: 4, border: '1px solid #ccc' }}
          />
        </section>

        {/* 재료 목록 */}
        <section>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '.5rem' }}>재료</h2>
          {ingredients.map((ingredient, index) => (
            <div
              key={index}
              style={{
                display: 'grid',
                gridTemplateColumns: '1.5fr 1fr auto',
                gap: '.5rem',
                marginBottom: '.5rem',
              }}
            >
              <input
                type="text"
                placeholder="재료 이름"
                value={ingredient.name}
                onChange={e =>
                  handleIngredientChange(index, 'name', e.target.value)
                }
                style={{ padding: '.5rem .7rem', borderRadius: 4, border: '1px solid #ccc' }}
              />
              <input
                type="text"
                placeholder="양 (예: 1컵, 200g)"
                value={ingredient.amount}
                onChange={e =>
                  handleIngredientChange(index, 'amount', e.target.value)
                }
                style={{ padding: '.5rem .7rem', borderRadius: 4, border: '1px solid #ccc' }}
              />
              <button
                type="button"
                onClick={() => removeIngredientRow(index)}
                style={{
                  padding: '.5rem .8rem',
                  borderRadius: 4,
                  border: '1px solid #ddd',
                  background: '#f5f5f5',
                  cursor: 'pointer',
                }}
              >
                삭제
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addIngredientRow}
            style={{
              marginTop: '.5rem',
              padding: '.5rem .9rem',
              borderRadius: 4,
              border: '1px dashed #aaa',
              background: '#fafafa',
              cursor: 'pointer',
            }}
          >
            + 재료 추가
          </button>
        </section>

        {/* 조리 단계 */}
        <section>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '.5rem' }}>조리 단계</h2>
          {steps.map((step, index) => (
            <div
              key={index}
              style={{ display: 'flex', alignItems: 'flex-start', gap: '.5rem', marginBottom: '.5rem' }}
            >
              <span style={{ marginTop: '.4rem', fontWeight: 600 }}>
                {index + 1}.
              </span>
              <textarea
                placeholder="조리 방법을 입력하세요"
                value={step.text}
                onChange={e => handleStepChange(index, e.target.value)}
                rows={2}
                style={{
                  flex: 1,
                  padding: '.5rem .7rem',
                  borderRadius: 4,
                  border: '1px solid #ccc',
                  resize: 'vertical',
                }}
              />
              <button
                type="button"
                onClick={() => removeStepRow(index)}
                style={{
                  padding: '.5rem .8rem',
                  borderRadius: 4,
                  border: '1px solid #ddd',
                  background: '#f5f5f5',
                  cursor: 'pointer',
                  marginTop: '.2rem',
                }}
              >
                삭제
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addStepRow}
            style={{
              marginTop: '.5rem',
              padding: '.5rem .9rem',
              borderRadius: 4,
              border: '1px dashed #aaa',
              background: '#fafafa',
              cursor: 'pointer',
            }}
          >
            + 단계 추가
          </button>
        </section>

        {/* 에러 / 버튼 */}
        {error && (
          <p style={{ color: 'crimson', fontSize: '.9rem' }}>
            {error}
          </p>
        )}

        <div style={{ display: 'flex', gap: '.75rem', marginTop: '.5rem' }}>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: '.7rem 1.4rem',
              borderRadius: 999,
              border: 'none',
              background: '#4f46e5',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            {isSubmitting ? '저장 중...' : '레시피 등록하기'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/recipes')}
            style={{
              padding: '.7rem 1.2rem',
              borderRadius: 999,
              border: '1px solid #ddd',
              background: '#fff',
              cursor: 'pointer',
            }}
          >
            취소
          </button>
        </div>
      </form>
    </main>
  );
}
