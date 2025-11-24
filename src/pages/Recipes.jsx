// src/pages/Recipes.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/recipes');
        const data = await res.json();

        if (!res.ok || data.success === false) {
          throw new Error(data.message || '레시피 목록을 불러오지 못했습니다.');
        }

        setRecipes(data.data || []);
      } catch (err) {
        console.error(err);
        setError(err.message || '오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (loading) return <p>레시피를 불러오는 중입니다...</p>;
  if (error) return <p>에러: {error}</p>;

  return (
    <div>
      <header style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ marginBottom: '0.5rem' }}>레시피</h2>
        <p style={{ margin: 0, color: '#555' }}>
          요리 기록을 남기고 이웃과 아이디어를 나눠보세요.
        </p>
      </header>

      <div
        style={{
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <p style={{ margin: 0, fontSize: '0.95rem', color: '#666' }}>
          총 <strong>{recipes.length}</strong>개의 레시피가 공유되고 있어요.
        </p>
        <Link
          to="/recipes/create"
          style={{
            textDecoration: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '999px',
            backgroundColor: '#ffb347',
            color: '#412000',
            fontWeight: 600,
            boxShadow: '0 3px 10px rgba(255, 179, 71, 0.55)',
          }}
        >
          레시피 등록
        </Link>
      </div>

      {recipes.length === 0 ? (
        <p>등록된 레시피가 아직 없습니다.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.2rem',
          }}
        >
          {recipes.map((recipe) => (
            <Link
              key={recipe._id}
              to={`/recipes/${recipe._id}`}
              style={{
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <article
                style={{
                  backgroundColor: '#ffffff', // 카드 완전 흰색
                  borderRadius: '16px',
                  padding: '1rem 1.1rem',
                  boxShadow: '0 3px 12px rgba(0,0,0,0.06)',
                  border: '1px solid rgba(0,0,0,0.04)', // 살짝 테두리만
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.45rem',
                  height: '100%',
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: '1.05rem',
                  }}
                >
                  {recipe.title}
                </h3>

                {recipe.description && (
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.9rem',
                      color: '#555',
                    }}
                  >
                    {recipe.description}
                  </p>
                )}

                {/* 🔹 설명과 메타 사이 구분선 */}
                <div
                  style={{
                    margin: '0.5rem 0 0.3rem',
                    height: '1px',
                    backgroundColor: '#eee',
                  }}
                />

                <p
                  style={{
                    margin: 0,
                    fontSize: '0.85rem',
                    color: '#777',
                  }}
                >
                  재료 {recipe.ingredients?.length || 0}개 · 작성자{' '}
                  {recipe.author || '익명'}
                </p>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Recipes;
