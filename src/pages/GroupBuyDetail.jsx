// src/pages/GroupBuyDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function GroupBuyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [groupbuy, setGroupbuy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [joining, setJoining] = useState(false);
  const [message, setMessage] = useState("");

  const fetchDetail = async () => {
    try {
      setError("");
      const res = await fetch(`http://localhost:4000/api/groupbuy/${id}`);
      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message || "공동구매 정보를 불러올 수 없습니다.");
      }

      setGroupbuy(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <p>공동구매 정보를 불러오는 중입니다...</p>;
  if (error) return <p>에러: {error}</p>;
  if (!groupbuy) return <p>공동구매 정보를 찾을 수 없습니다.</p>;

  const {
    title,
    description,
    price,
    targetCount,
    currentCount,
    deadline,
    image,
    location,
    host,
  } = groupbuy;

  const percent = targetCount
    ? Math.min(Math.round((currentCount / targetCount) * 100), 100)
    : 0;

  const now = new Date();
  const deadlineDate = deadline ? new Date(deadline) : null;
  const diffMs = deadlineDate ? deadlineDate - now : null;
  const isDeadlinePassed = diffMs !== null && diffMs <= 0;
  const isFull = targetCount && currentCount >= targetCount;
  const isClosed = isDeadlinePassed || isFull;

  let remainText = "마감일 미정";
  if (deadlineDate) {
    if (isDeadlinePassed) {
      remainText = "마감된 공동구매입니다.";
    } else {
      const d = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const h = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
      if (d > 0) remainText = `${d}일 ${h}시간 남음`;
      else remainText = `${h}시간 이내 마감`;
    }
  }

  const handleJoin = async () => {
    if (isClosed) return;

    try {
      setJoining(true);
      setMessage("");
      setError("");

      const res = await fetch(
        `http://localhost:4000/api/groupbuy/${id}/join`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // 백엔드에서 body 안 써도 상관없게, 기본 count 1로 보냄
          body: JSON.stringify({ count: 1 }),
        }
      );

      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message || "참여에 실패했습니다.");
      }

      setMessage("공동구매에 참여했습니다!");
      // 최신 상태 다시 불러오기
      fetchDetail();
    } catch (err) {
      setError(err.message);
    } finally {
      setJoining(false);
    }
  };

  return (
    <div style={{ maxWidth: "720px" }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: "1rem",
          padding: "0.3rem 0.8rem",
          borderRadius: "999px",
          border: "1px solid #ddd",
          background: "#fff",
          cursor: "pointer",
          fontSize: "0.85rem",
        }}
      >
        ← 목록으로
      </button>

      <section
        style={{
          display: "flex",
          gap: "1.5rem",
          alignItems: "flex-start",
          marginBottom: "1.5rem",
        }}
      >
        {image && (
          <img
            src={image}
            alt={title}
            style={{
              width: "220px",
              height: "220px",
              objectFit: "cover",
              borderRadius: "16px",
              border: "1px solid #eee",
            }}
          />
        )}

        <div style={{ flex: 1 }}>
          <h2 style={{ marginTop: 0 }}>{title}</h2>
          {host && (
            <p style={{ margin: "0 0 0.4rem", fontSize: "0.9rem" }}>
              주최자: {host}
            </p>
          )}
          <p style={{ margin: "0 0 0.6rem", color: "#555" }}>{description}</p>

          {location && (
            <p style={{ margin: "0 0 0.4rem", fontSize: "0.9rem" }}>
              📍 수령 위치: {location}
            </p>
          )}

          {price && (
            <p style={{ margin: "0 0 0.4rem", fontSize: "0.9rem" }}>
              💰 가격: <strong>{price.toLocaleString()}원</strong>
            </p>
          )}

          <p style={{ margin: "0 0 0.4rem", fontSize: "0.9rem" }}>
            👥 참여 인원: {currentCount}/{targetCount}명
          </p>

          <p style={{ margin: "0 0 0.4rem", fontSize: "0.9rem" }}>
            ⏰ 마감일: {deadlineDate ? deadlineDate.toISOString().slice(0, 10) : "미정"}
            {" · "}
            <span
              style={{
                color: isClosed ? "#b33" : "#2f7b2f",
                fontWeight: 600,
              }}
            >
              {remainText}
            </span>
          </p>

          {/* 진행률 바 */}
          <div style={{ marginTop: "0.8rem" }}>
            <div
              style={{
                height: "10px",
                borderRadius: "999px",
                background: "#f2f2f2",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${percent}%`,
                  transition: "width 0.3s ease",
                  background: isClosed ? "#ccc" : "#9adf70",
                }}
              />
            </div>
            <p
              style={{
                marginTop: "0.3rem",
                fontSize: "0.85rem",
                color: "#555",
              }}
            >
              진행률: {percent}%{" "}
              {isFull && <span style={{ color: "#b33" }}>· 정원 마감</span>}
              {isDeadlinePassed && (
                <span style={{ color: "#b33" }}> · 마감 시간 초과</span>
              )}
            </p>
          </div>

          {/* 참여 버튼 & 상태 메시지 */}
          <div style={{ marginTop: "1rem" }}>
            {isClosed ? (
              <p style={{ color: "#b33", fontWeight: 600 }}>
                이 공동구매는 종료되었습니다.
              </p>
            ) : (
              <button
                type="button"
                onClick={handleJoin}
                disabled={joining}
                style={{
                  padding: "0.6rem 1.4rem",
                  borderRadius: "999px",
                  border: "none",
                  background: "#ffb347",
                  color: "#3c2100",
                  fontWeight: 600,
                  cursor: joining ? "wait" : "pointer",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                }}
              >
                {joining ? "참여 중..." : "공동구매 참여하기"}
              </button>
            )}

            {message && (
              <p style={{ marginTop: "0.5rem", color: "#2f7b2f" }}>{message}</p>
            )}
            {error && (
              <p style={{ marginTop: "0.5rem", color: "#b33" }}>{error}</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default GroupBuyDetail;
