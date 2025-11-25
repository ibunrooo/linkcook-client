// src/pages/ShareList.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ShareList() {
  const [shares, setShares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchShares = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/share");
        const data = await res.json();

        if (!res.ok || data.success === false) {
          throw new Error(data.message || "나눔 목록을 불러오지 못했습니다.");
        }

        setShares(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShares();
  }, []);

  if (loading) return <p>나눔 목록을 불러오는 중입니다...</p>;
  if (error) return <p>에러: {error}</p>;

  return (
    <div>
      {/* 상단 헤더 – 공동구매 리스트랑 형식 맞춤 */}
      <header style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ marginBottom: "0.5rem" }}>식재료 나눔</h2>
        <p style={{ margin: 0, color: "#555", fontSize: "0.95rem" }}>
          아직 쓸 수 있는 재료를 버리는 대신, 근처 이웃에게 나눠주세요.
        </p>
      </header>

      {/* 상단 안내 + 등록 버튼 영역 */}
      <div
        style={{
          marginBottom: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p style={{ margin: 0, fontSize: "0.9rem", color: "#666" }}>
          총 <strong>{shares.length}</strong>개의 나눔이 등록되어 있습니다.
        </p>

        <Link to="/share/create">
          <button
            type="button"
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "999px",
              border: "none",
              backgroundColor: "#ffb347", // 네가 쓰던 공동구매 버튼 스타일 그대로
              color: "#3c2100",
              fontWeight: 600,
              fontSize: "0.9rem",
              cursor: "pointer",
              boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
            }}
          >
            나눔 등록
          </button>
        </Link>
      </div>

      {/* 나눔 카드 리스트 – 한 줄에 카드 1개 */}
      {shares.length === 0 ? (
        <p style={{ color: "#555", fontSize: "0.9rem" }}>
          아직 등록된 나눔이 없습니다. 첫 번째 나눔을 시작해보세요!
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "1.2rem",
          }}
        >
          {shares.map((share) => {
            const expiryDate = share.expiry
              ? share.expiry.slice(0, 10)
              : "";

            const created = share.createdAt
              ? share.createdAt.slice(0, 10)
              : "";

            const isClosed = share.status && share.status !== "open";

            return (
              <Link
                key={share._id}
                to={`/share/${share._id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <article
                  style={{
                    background: "#fff",
                    borderRadius: "16px",
                    padding: "1rem 1.1rem",
                    border: "1px solid #eee",
                    boxShadow: "0 3px 10px rgba(0,0,0,0.06)",
                    cursor: "pointer",
                  }}
                >
                  {/* 상단 제목/품목 */}
                  <h3 style={{ margin: 0, fontSize: "1.1rem" }}>
                    {share.title || share.item}
                  </h3>
                  <p
                    style={{
                      margin: "0.3rem 0",
                      color: "#666",
                      fontSize: "0.9rem",
                    }}
                  >
                    {share.item} · 나눔 수량 {share.quantity}
                    {share.unit ? share.unit : ""}
                  </p>

                  {/* 간단 설명 */}
                  {share.description && (
                    <p
                      style={{
                        margin: "0.4rem 0 0.6rem",
                        color: "#444",
                        fontSize: "0.9rem",
                      }}
                    >
                      {share.description}
                    </p>
                  )}

                  {/* 구분선 */}
                  <div
                    style={{
                      margin: "0.5rem 0",
                      height: "1px",
                      background: "#eee",
                    }}
                  />

                  {/* 하단 정보 – 위치 / 소비기한 / 상태 */}
                  <p
                    style={{
                      margin: "0.2rem 0",
                      fontSize: "0.85rem",
                      color: "#555",
                    }}
                  >
                    위치: {share.location || "위치 미정"}
                  </p>

                  {expiryDate && (
                    <p
                      style={{
                        margin: "0.2rem 0",
                        fontSize: "0.85rem",
                        color: "#555",
                      }}
                    >
                      소비기한: {expiryDate}
                    </p>
                  )}

                  <p
                    style={{
                      margin: "0.2rem 0 0",
                      fontSize: "0.8rem",
                      color: "#777",
                    }}
                  >
                    등록일: {created}
                  </p>

                  <p
                    style={{
                      margin: "0.3rem 0 0",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      color: isClosed ? "#b33" : "#15803d",
                    }}
                  >
                    {isClosed ? "나눔 종료" : "나눔 진행 중"}
                  </p>
                </article>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ShareList;