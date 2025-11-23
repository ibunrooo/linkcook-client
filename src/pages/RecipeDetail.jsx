// src/pages/RecipeDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export default function RecipeDetail() {
  const { id } = useParams(); // /recipes/:id 에서 id 꺼내기
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        setError('');

        const res = await fetch(`${API_BASE_URL}/api/recipes/${id}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || '레시피를 불러오지 못했습니다.');
        }

        setRecipe(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) return <p>불러오는 중...</p>;
  if (error) return <p style={{ color: 'red' }}>에러: {error}</p>;
  if (!recipe) return <p>레시피를 찾을 수 없습니다.</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <Link to="/recipes" style={{ fontSize: 14 }}>
        ← 레시피 목록으로
      </Link>

      <h1 style={{ marginTop: '1rem' }}>{recipe.title}</h1>
      {recipe.description && <p>{recipe.description}</p>}

      <h2>재료</h2>
      <ul>
        {recipe.ingredients?.map((ing) => (
          <li key={ing._id}>
            {ing.name} {ing.amount && `- ${ing.amount}`}
          </li>
        ))}
      </ul>

      <h2>조리 순서</h2>
      <ol>
        {recipe.steps?.map((step) => (
          <li key={step._id || step.order}>
            {step.text}
          </li>
        ))}
      </ol>
    </div>
  );
}
