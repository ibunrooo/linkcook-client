// src/App.jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Recipes from './pages/Recipes';
import RecipeDetail from './pages/RecipeDetail';
import RecipeCreate from './pages/RecipeCreate';
import ShareList from './pages/ShareList';
import ShareCreate from './pages/ShareCreate';
import GroupBuyList from './pages/GroupBuyList';

const layoutStyles = {
  app: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #f6ffe9 0%, #fff8e6 45%, #ffffff 100%)',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, system-ui, -apple-system, "Segoe UI", sans-serif',
    color: '#222',
  },
  header: {
    padding: '1.5rem 2rem 1rem',
    borderBottom: '1px solid rgba(0,0,0,0.06)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: '1rem',
  },
  logo: {
    fontSize: '1.8rem',
    fontWeight: 800,
    letterSpacing: '0.04em',
    color: '#5d3fd3', // 포인트 보라
  },
  tagline: {
    fontSize: '0.9rem',
    color: '#555',
  },
  nav: {
    marginTop: '0.8rem',
    display: 'flex',
    gap: '0.8rem',
    fontSize: '0.95rem',
  },
  navLink: (isPrimary = false) => ({
    textDecoration: 'none',
    padding: '0.4rem 0.9rem',
    borderRadius: '999px',
    border: isPrimary ? 'none' : '1px solid rgba(0,0,0,0.08)',
    backgroundColor: isPrimary ? '#7bc96f' : 'rgba(255,255,255,0.7)',
    color: isPrimary ? '#1a2c10' : '#333',
    fontWeight: isPrimary ? 700 : 500,
    boxShadow: isPrimary
      ? '0 2px 6px rgba(123, 201, 111, 0.45)'
      : '0 1px 3px rgba(0,0,0,0.04)',
  }),
  main: {
    padding: '1.5rem 2rem 2.5rem',
    maxWidth: '960px',
    margin: '0 auto',
  },
};

function Home() {
  return (
    <main style={layoutStyles.main}>
      <section
        style={{
          backgroundColor: 'rgba(255, 246, 214, 0.9)', // 노랑/주황 계열
          borderRadius: '20px',
          padding: '1.8rem 2rem',
          boxShadow: '0 4px 18px rgba(0,0,0,0.06)',
          border: '1px solid rgba(255, 196, 80, 0.4)',
        }}
      >
        <h2 style={{ margin: 0, fontSize: '1.5rem' }}>오늘의 식탁을 나누는 기록</h2>
        <p style={{ marginTop: '0.8rem', lineHeight: 1.6 }}>
          냉장고 속 남은 재료로 만든 레시피를 기록하고,
          <br />
          이웃과 식재료를 나누고, 함께 공동구매로 알뜰하게 채워보는
          <strong> LinkCook </strong> 커뮤니티입니다.
        </p>
        <div style={{ marginTop: '1.2rem', display: 'flex', gap: '0.6rem' }}>
          <Link to="/recipes" style={layoutStyles.navLink(true)}>
            레시피 보러가기
          </Link>
          <Link
            to="/share"
            style={{
              ...layoutStyles.navLink(false),
              borderColor: 'rgba(123, 201, 111, 0.6)',
            }}
          >
            나눔 살펴보기
          </Link>
        </div>
      </section>
    </main>
  );
}

function App() {
  return (
    <div style={layoutStyles.app}>
      <BrowserRouter>
        <header style={layoutStyles.header}>
          <div style={layoutStyles.titleRow}>
            <div>
              <h1 style={layoutStyles.logo}>LinkCook</h1>
              <p style={layoutStyles.tagline}>
                나눔으로 채워지는 식탁, 요리로 이어지는 커뮤니티
              </p>
            </div>
          </div>

          <nav style={layoutStyles.nav}>
            <Link to="/" style={layoutStyles.navLink(false)}>
              홈
            </Link>
            <Link to="/recipes" style={layoutStyles.navLink(false)}>
              레시피
            </Link>
            <Link to="/share" style={layoutStyles.navLink(false)}>
              나눔
            </Link>
            <Link to="/groupbuy" style={layoutStyles.navLink(false)}>
              공동구매
            </Link>
          </nav>
        </header>

        <main style={layoutStyles.main}>
          <Routes>
            <Route path="/" element={<Home />} />

            {/* 레시피 */}
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/recipes/create" element={<RecipeCreate />} />
            <Route path="/recipes/:id" element={<RecipeDetail />} />

            {/* 나눔 */}
            <Route path="/share" element={<ShareList />} />
            <Route path="/share/create" element={<ShareCreate />} />

            {/* 공동구매 (임시 리스트) */}
            <Route path="/groupbuy" element={<GroupBuyList />} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
