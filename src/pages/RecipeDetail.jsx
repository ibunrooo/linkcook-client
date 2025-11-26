// src/pages/RecipeDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import WhiteCard from '../components/common/WhiteCard'; 

const pageStyle = {
  maxWidth: '960px',
  margin: '0 auto',
  padding: '2rem 1.5rem 4rem',
};

// cardStyle는 WhiteCard로 대체하므로 더 이상 필요 없음 (지워도 됨)
// const cardStyle = { ... };

function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/recipes/${id}`);
      const data = await res.json();

        if (!res.ok || data.success === false) {
          throw new Error(data.message || '레시피 정보를 불러오지 못했습니다.');
        }

        setRecipe(data.data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) return <p style={pageStyle}>레시피 정보를 불러오는 중입니다...</p>;
  if (error) return <p style={pageStyle}>에러: {error}</p>;
  if (!recipe) return <p style={pageStyle}>레시피 정보를 찾을 수 없습니다.</p>;

  const ingredients = recipe.ingredients || [];
  const steps = (recipe.steps || []).slice().sort((a, b) => a.order - b.order);

  return (
    <div style={pageStyle}>
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

      {/* ✅ 공통 카드 컴포넌트로 교체 */}
      <WhiteCard>
        {/* 제목 & 한 줄 소개 */}
        <h2
          style={{
            fontSize: '1.8rem',
            marginBottom: '0.4rem',
            fontWeight: '700',
          }}
        >
          {recipe.title}
        </h2>
        {recipe.description && (
          <p
            style={{
              color: '#4b5563',
              marginBottom: '1.5rem',
            }}
          >
            {recipe.description}
          </p>
        )}

        {/* 재료 */}
        <section style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.8rem' }}>
            재료
          </h3>
          {ingredients.length === 0 ? (
            <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
              등록된 재료 정보가 없습니다.
            </p>
          ) : (
            <ul
              style={{
                margin: 0,
                paddingLeft: '1.1rem',
                lineHeight: 1.6,
                color: '#374151',
              }}
            >
              {ingredients.map((ing) => (
                <li key={ing._id || ing.name}>
                  {ing.name}
                  {ing.amount ? ` - ${ing.amount}` : ''}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* 조리 순서 */}
        <section>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.8rem' }}>
            조리 순서
          </h3>
          {steps.length === 0 ? (
            <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
              등록된 조리 순서가 없습니다.
            </p>
          ) : (
            <ol
              style={{
                margin: 0,
                paddingLeft: '1.3rem',
                lineHeight: 1.7,
                color: '#374151',
              }}
            >
              {steps.map((step) => (
                <li key={step._id || step.order} style={{ marginBottom: '0.3rem' }}>
                  {step.text}
                </li>
              ))}
            </ol>
          )}
        </section>
      </WhiteCard>
    </div>
  );
}

export default RecipeDetail;