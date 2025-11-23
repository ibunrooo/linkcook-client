// src/App.jsx
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Recipes from './pages/Recipes';
import Share from './pages/Share';
import GroupBuy from './pages/GroupBuy';

function App() {
  return (
    <div>
      {/* 상단 네비게이션 */}
      <header style={{ padding: '16px', borderBottom: '1px solid #eee' }}>
        <h1>LinkCook</h1>
        <nav style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <Link to="/">홈</Link>
          <Link to="/recipes">레시피</Link>
          <Link to="/share">나눔</Link>
          <Link to="/groupbuy">공동구매</Link>
        </nav>
      </header>

      {/* 페이지 영역 */}
      <main style={{ padding: '16px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/share" element={<Share />} />
          <Route path="/groupbuy" element={<GroupBuy />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
