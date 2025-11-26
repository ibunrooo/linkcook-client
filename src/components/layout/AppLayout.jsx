// src/components/layout/AppLayout.jsx
import { Link, useLocation } from "react-router-dom";

const layoutStyles = {
  app: {
    minHeight: "100vh",
    backgroundColor: "#f9fafb",
    fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, "Segoe UI", sans-serif',
    color: "#111827",
  },
  header: {
    padding: "1.5rem 2rem 1rem",
    borderBottom: "1px solid rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  brandRow: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  logo: {
    fontSize: "1.7rem",
    fontWeight: 800,
    color: "#4CAF50", // LinkCook 연두색
  },
  subtitle: {
    marginTop: "0.25rem",
    color: "#6b7280",
    fontSize: "0.9rem",
  },
  nav: {
    display: "inline-flex",
    gap: "0.5rem",
    marginTop: "0.75rem",
  },
  navButton: {
    padding: "0.4rem 0.9rem",
    borderRadius: "999px",
    border: "1px solid #e5e7eb",
    backgroundColor: "#ffffff",
    fontSize: "0.9rem",
    textDecoration: "none",
    color: "#4b5563",
  },
  navButtonActive: {
    backgroundColor: "#111827",
    color: "#f9fafb",
    borderColor: "#111827",
  },
  main: {
    maxWidth: "960px",
    margin: "0 auto",
    padding: "2rem 1.5rem 4rem",
  },
};

function AppLayout({ children }) {
  const location = useLocation();
  const current = location.pathname.split("/")[1] || "";

  const isActive = (key) => {
    if (key === "" && (current === "" || current === "home")) return true;
    return current === key;
  };

  return (
    <div style={layoutStyles.app}>
      <header style={layoutStyles.header}>
        <div style={layoutStyles.brandRow}>
          <div>
            <div style={layoutStyles.logo}>LinkCook</div>
            <p style={layoutStyles.subtitle}>
              나눔으로 채워지는 식탁, 요리로 이어지는 커뮤니티
            </p>
          </div>
          {/* 나중에 로그인/마이페이지 버튼 들어갈 자리 */}
        </div>

        <nav style={layoutStyles.nav}>
          <Link
            to="/"
            style={{
              ...layoutStyles.navButton,
              ...(isActive("") ? layoutStyles.navButtonActive : {}),
            }}
          >
            홈
          </Link>
          <Link
            to="/recipes"
            style={{
              ...layoutStyles.navButton,
              ...(isActive("recipes") ? layoutStyles.navButtonActive : {}),
            }}
          >
            레시피
          </Link>
          <Link
            to="/share"
            style={{
              ...layoutStyles.navButton,
              ...(isActive("share") ? layoutStyles.navButtonActive : {}),
            }}
          >
            나눔
          </Link>
          <Link
            to="/groupbuy"
            style={{
              ...layoutStyles.navButton,
              ...(isActive("groupbuy") ? layoutStyles.navButtonActive : {}),
            }}
          >
            공동구매
          </Link>
        </nav>
      </header>

      <main style={layoutStyles.main}>{children}</main>
    </div>
  );
}

export default AppLayout;