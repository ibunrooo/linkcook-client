// src/App.jsx
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Recipes from './pages/Recipes.jsx';
import RecipeDetail from './pages/RecipeDetail.jsx';
import RecipeCreate from './pages/RecipeCreate';
import Share from './pages/Share';
import GroupBuy from './pages/GroupBuy';

function App() {
  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '40px 24px' }}>
      {/* 상단 로고 + 네비게이션 */}
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>LinkCook</h1>
        <nav style={{ display: 'flex', gap: '12px', fontSize: '14px' }}>
          <Link to="/">홈</Link>
          <Link to="/recipes">레시피</Link>
          <Link to="/share">나눔</Link>
          <Link to="/groupbuy">공동구매</Link>
        </nav>
      </header>

      {/* 실제 페이지가 바뀌는 영역 */}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/recipes/create" element={<RecipeCreate />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} />
          {/* 나중에 추가할 예정 */}
          {/* <Route path="/share" element={<Share />} /> */}
          {/* <Route path="/groupbuy" element={<GroupBuy />} /> */}
        </Routes>
      </main>
    </div>
  );
}

export default App;
