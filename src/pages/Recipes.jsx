// src/pages/Recipes.jsx (핵심 부분만 예시)
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchList = async () => {
      const res = await fetch(`${API_BASE_URL}/api/recipes`);
      const data = await res.json();
      if (res.ok && data.success) {
        setRecipes(data.data);
      }
    };
    fetchList();
  }, []);

  if (!recipes.length) {
    return <p>등록된 레시피가 아직 없습니다.</p>;
  }

  return (
    <div>
      <h1>레시피 목록</h1>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe._id}>
            {/* 여기 링크 중요! */}
            <Link to={`/recipes/${recipe._id}`}>
              {recipe.title}
            </Link>{' '}
            - {recipe.description}
          </li>
        ))}
      </ul>
    </div>
  );
}
