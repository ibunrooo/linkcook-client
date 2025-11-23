// src/App.jsx
import { Link, Outlet } from 'react-router-dom';

function App() {
  return (
    <div>
      <header
        style={{
          padding: '1rem 2rem',
          borderBottom: '1px solid #eee',
          marginBottom: '1rem',
        }}
      >
        <h1 style={{ margin: 0 }}>LinkCook</h1>
        <nav style={{ marginTop: '0.5rem' }}>
          <Link to="/" style={{ marginRight: '1rem' }}>
            홈
          </Link>
          <Link to="/recipes" style={{ marginRight: '1rem' }}>
            레시피
          </Link>
          <Link to="/share" style={{ marginRight: '1rem' }}>
            나눔
          </Link>
          <Link to="/groupbuy">공동구매</Link>
        </nav>
      </header>

      <main style={{ padding: '0 2rem 2rem' }}>
        {/* 여기로 자식 페이지들이 렌더링 됨 */}
        <Outlet />
      </main>
    </div>
  );
}

export default App;
