// src/pages/Recipes.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4000/api/recipes")
      .then((res) => res.json())
      .then((data) => {
        setRecipes(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: "20px" }}>
      {/* 제목 */}
      <h1>레시피 목록</h1>

      {/* ➕ 레시피 등록 버튼 */}
      <div style={{ marginBottom: "20px" }}>
        <Link
          to="/recipes/create"
          style={{
            display: "inline-block",
            padding: "10px 16px",
            background: "#4C67F7",
            color: "white",
            borderRadius: "8px",
            textDecoration: "none",
          }}
        >
          ➕ 레시피 등록하기
        </Link>
      </div>

      <hr />

      {/* 레시피가 없을 때 */}
      {recipes.length === 0 && <p>등록된 레시피가 아직 없습니다.</p>}

      {/* 레시피 목록 */}
      <ul>
        {recipes.map((r) => (
          <li key={r._id} style={{ marginBottom: "12px" }}>
            <Link
              to={`/recipes/${r._id}`}
              style={{ fontSize: "18px", fontWeight: "bold", color: "#333" }}
            >
              {r.title}
            </Link>
            <div style={{ fontSize: "14px", color: "#666" }}>
              {r.description}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Recipes;
