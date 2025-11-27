// src/pages/MyPage.jsx
import { useAuth0 } from "@auth0/auth0-react";

function MyPage() {
  const { isAuthenticated, isLoading, user } = useAuth0();

  if (isLoading) return <p style={{ padding: "2rem" }}>불러오는 중...</p>;
  if (!isAuthenticated)
    return <p style={{ padding: "2rem" }}>로그인 후 이용할 수 있습니다.</p>;

  return (
    <div style={{ maxWidth: "960px", margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
      <h2 style={{ fontSize: "1.6rem", marginBottom: "1rem" }}>마이페이지</h2>
      <p style={{ marginBottom: "0.5rem" }}>
        <strong>닉네임:</strong> {user.nickname || user.name}
      </p>
      <p style={{ marginBottom: "0.5rem" }}>
        <strong>이메일:</strong> {user.email}
      </p>
      <p style={{ marginTop: "1.5rem", color: "#6b7280", fontSize: "0.9rem" }}>
        나중에 여기에서 내 레시피, 나눔/공동구매 내역, 북마크, 설정 등을 볼 수 있게
        확장하면 돼.
      </p>
    </div>
  );
}

export default MyPage;