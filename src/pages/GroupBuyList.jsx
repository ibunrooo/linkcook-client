// src/pages/GroupBuyList.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function GroupBuyList() {
  const [groupbuys, setGroupbuys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGroupBuys = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/groupbuy");
        const data = await res.json();

        if (!res.ok || data.success === false) {
          throw new Error(data.message || "공동구매 목록을 불러오지 못했습니다.");
        }

        setGroupbuys(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupBuys();
  }, []);

  if (loading) return <p>공동구매 목록을 불러오는 중입니다...</p>;
  if (error) return <p>에러: {error}</p>;

  return (
    <div>
      <header style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ marginBottom: "0.5rem" }}>공동구매</h2>
        <p style={{ margin: 0, color: "#555" }}>
          이웃과 함께 저렴하게 구매해보세요!
        </p>
      </header>

      <div
        style={{
          marginBottom: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p style={{ margin: 0 }}>
          총 <strong>{groupbuys.length}</strong>개의 공동구매가 열려있습니다.
        </p>

        <Link
          to="/groupbuy/create"
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "999px",
            backgroundColor: "#ffb347",
            color: "#3c2100",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          공동구매 등록
        </Link>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "1.2rem",
        }}
      >
        {groupbuys.map((item) => {
          const percent = Math.min(
            Math.round((item.currentCount / item.targetCount) * 100),
            100
          );
          const isClosed =
            new Date(item.deadline) < new Date() || percent >= 100;

          return (
            <Link
              key={item._id}
              to={`/groupbuy/${item._id}`}
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
                <h3 style={{ margin: 0 }}>{item.title}</h3>
                <p style={{ margin: "0.4rem 0", color: "#555" }}>
                  {item.description}
                </p>

                <div
                  style={{
                    margin: "0.6rem 0",
                    height: "1px",
                    background: "#eee",
                  }}
                />

                <p
                  style={{
                    margin: 0,
                    fontSize: "0.85rem",
                    color: isClosed ? "#b33" : "#555",
                  }}
                >
                  {isClosed
                    ? "📌 종료됨"
                    : `참여 ${item.currentCount}/${item.targetCount}명 (${percent}%)`}
                </p>

                <p style={{ margin: "0.2rem 0", fontSize: "0.85rem" }}>
                  마감일: {item.deadline?.slice(0, 10)}
                </p>

                {item.price && (
                  <p style={{ margin: 0, fontSize: "0.85rem" }}>
                    가격: {item.price.toLocaleString()}원
                  </p>
                )}
              </article>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default GroupBuyList;
