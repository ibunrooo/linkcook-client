// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Recipes from './pages/Recipes';
import RecipeDetail from './pages/RecipeDetail';
import RecipeCreate from './pages/RecipeCreate';
import ShareList from './pages/ShareList';
import ShareCreate from './pages/ShareCreate';
// TODO: 나중에 GroupBuy 페이지도 추가 가능

function Home() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>LinkCook</h1>
      <p>나의 레시피를 공유하고, 이웃과 식재료를 나누는 커뮤니티</p>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* App은 레이아웃 역할, Outlet 위치에 아래 자식들이 들어감 */}
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />

          {/* 레시피 */}
          <Route path="recipes" element={<Recipes />} />
          <Route path="recipes/create" element={<RecipeCreate />} />
          <Route path="recipes/:id" element={<RecipeDetail />} />

          {/* 나눔 */}
          <Route path="share" element={<ShareList />} />
          <Route path="share/create" element={<ShareCreate />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
