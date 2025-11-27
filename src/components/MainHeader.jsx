// src/components/MainHeader.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const headerStyle = {
  padding: "1.5rem 2rem 1rem",
  borderBottom: "1px solid rgba(0,0,0,0.06)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: "#fff",
};

const leftAreaStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "0.4rem",
};

const navStyle = {
  display: "flex",
  gap: "0.5rem",
  marginTop: "0.4rem",
};

const navButtonBase = {
  padding: "0.3rem 0.9rem",
  borderRadius: "999px",
  border: "1px solid #e5e7eb",
  backgroundColor: "#f9fafb",
  fontSize: "0.9rem",
  cursor: "pointer",
  textDecoration: "none",
  color: "#374151",
};

const rightAreaStyle = {
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  fontSize: "0.9rem",
};

function MainHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    isAuthenticated,
    isLoading,
    user,
    loginWithRedirect,
    logout,
  } = useAuth0();

  const currentPath = location.pathname;

  // 메뉴 버튼 생성 함수
  const navButton = (to, label) => {
    const isActive =
      (to === "/" ? currentPath === "/" : currentPath.startsWith(to)) &&
      to !== "/";

    return (
      <Link
        to={to}
        style={{
          ...navButtonBase,
          backgroundColor: isActive ? "#e0f2fe" : "#f9fafb",
          borderColor: isActive ? "#60a5fa" : "#e5e7eb",
          color: isActive ? "#1d4ed8" : "#374151",
        }}
      >
        {label}
      </Link>
    );
  };

  return (
    <header style={headerStyle}>
      {/* 왼쪽 영역: 로고 + 메뉴 */}
      <div style={leftAreaStyle}>
        <div
          style={{
            fontSize: "1.6rem",
            fontWeight: 800,
            color: "#22c55e",
          }}
        >
          LinkCook
        </div>
        <p style={{ margin: 0, fontSize: "0.9rem", color: "#6b7280" }}>
          나눔으로 채워지는 식탁, 요리로 이어지는 커뮤니티
        </p>

        <nav style={navStyle}>
          {navButton("/", "홈")}
          {navButton("/recipes", "레시피")}
          {navButton("/share", "나눔")}
          {navButton("/groupbuy", "공동구매")}
        </nav>
      </div>

      {/* 오른쪽 영역: 로그인 / 회원가입 / 마이페이지 */}
      <div style={rightAreaStyle}>
        {isLoading ? (
          <span style={{ color: "#9ca3af" }}>확인 중...</span>
        ) : isAuthenticated ? (
          <>
            <span style={{ color: "#4b5563" }}>
              <strong>{user.nickname || user.name}</strong> 님
            </span>

            <button
              onClick={() => navigate("/mypage")}
              style={{
                padding: "0.35rem 0.9rem",
                borderRadius: "999px",
                border: "1px solid #e5e7eb",
                backgroundColor: "#f3f4f6",
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
            >
              마이페이지
            </button>

            <button
              onClick={() =>
                logout({ logoutParams: { returnTo: window.location.origin } })
              }
              style={{
                padding: "0.35rem 0.9rem",
                borderRadius: "999px",
                border: "none",
                backgroundColor: "#ef4444",
                color: "white",
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => loginWithRedirect()}
              style={{
                padding: "0.35rem 0.9rem",
                borderRadius: "999px",
                border: "1px solid #e5e7eb",
                backgroundColor: "#f9fafb",
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
            >
              로그인
            </button>

            <button
              onClick={() =>
                loginWithRedirect({
                  authorizationParams: { screen_hint: "signup" },
                })
              }
              style={{
                padding: "0.35rem 0.9rem",
                borderRadius: "999px",
                border: "none",
                background:
                  "linear-gradient(90deg, #bbf7d0 0%, #fde68a 50%, #fed7aa 100%)",
                cursor: "pointer",
                fontSize: "0.85rem",
                color: "#1f2937",
              }}
            >
              회원가입
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default MainHeader;