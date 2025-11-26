// src/pages/Recipes.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/client';

function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await apiClient.get('/api/recipes'); // ✅ 공통 클라이언트 사용
        setRecipes(data.data || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (loading) return <p>레시피 목록을 불러오는 중입니다...</p>;
  if (error) return <p>에러: {error}</p>;

  return (
    <div>
      <header style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ marginBottom: '0.5rem' }}>레시피</h2>
        <p style={{ margin: 0, color: '#555' }}>
          나만의 레시피를 공유하고, 다른 사람의 레시피를 탐색해보세요.
        </p>
      </header>

      <div
        style={{
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <p style={{ margin: 0 }}>
          총 <strong>{recipes.length}</strong>개의 레시피가 등록되어 있습니다.
        </p>

        <Link
          to="/recipes/create"
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '999px',
            backgroundColor: '#ffb347',
            color: '#3c2100',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          레시피 등록
        </Link>
      </div>

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
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <article
              style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '1rem 1.1rem',
                border: '1px solid #eee',
                boxShadow: '0 3px 10px rgba(0,0,0,0.06)',
                cursor: 'pointer',
              }}
            >
              <h3 style={{ margin: 0 }}>{recipe.title}</h3>
              {recipe.description && (
                <p style={{ margin: '0.4rem 0', color: '#555', fontSize: '0.9rem' }}>
                  {recipe.description}
                </p>
              )}
              <div
                style={{
                  marginTop: '0.6rem',
                  fontSize: '0.8rem',
                  color: '#888',
                }}
              >
                작성자: {recipe.author || '익명'}
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Recipes;