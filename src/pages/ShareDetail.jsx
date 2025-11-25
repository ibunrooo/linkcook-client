// src/pages/ShareDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const pageStyle = {
  maxWidth: "960px",
  margin: "0 auto",
  padding: "2rem 1.5rem 4rem",
};

const cardStyle = {
  backgroundColor: "#ffffff",
  borderRadius: "18px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.04)",
  padding: "2rem",
};

function ShareDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [share, setShare] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/share/${id}`);
        const data = await res.json();

        if (!res.ok || data.success === false) {
          throw new Error(data.message || "나눔 정보를 불러오지 못했습니다.");
        }

        setShare(data.data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) return <p style={pageStyle}>나눔 정보를 불러오는 중입니다...</p>;
  if (error) return <p style={pageStyle}>에러: {error}</p>;
  if (!share) return <p style={pageStyle}>나눔 정보를 찾을 수 없습니다.</p>;

  const title = share.title || share.item || "나눔 상세";
  const quantityText = share.unit
    ? `${share.quantity}${share.unit}`
    : `${share.quantity}`;

  const expiryDate = share.expiry ? new Date(share.expiry) : null;
  const now = new Date();
  const diffMs = expiryDate ? expiryDate.getTime() - now.getTime() : 0;
  const isExpired = expiryDate && diffMs <= 0;
  const isClosed = isExpired || share.status === "closed";

  let leftText = "소비기한 정보 없음";
  if (expiryDate) {
    if (diffMs <= 0) {
      leftText = "소비기한이 지났습니다";
    } else {
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(
        (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const diffMinutes = Math.floor(
        (diffMs % (1000 * 60 * 60)) / (1000 * 60)
      );
      leftText = `${diffDays}일 ${diffHours}시간 ${diffMinutes}분 남음`;
    }
  }

  const ownerName = share.owner || share.author || "";

  return (
    <div style={pageStyle}>
      <button
        onClick={() => navigate(-1)}
        style={{
          border: "none",
          background: "none",
          color: "#6b7280",
          marginBottom: "1rem",
          cursor: "pointer",
        }}
      >
        ← 나눔 목록으로
      </button>

      <div style={cardStyle}>
        {/* 이미지가 있다면 상단에 표시 (선택) */}
        {share.image && (
          <div
            style={{
              marginBottom: "1.25rem",
              borderRadius: "14px",
              overflow: "hidden",
            }}
          >
            <img
              src={share.image}
              alt={title}
              style={{ width: "100%", display: "block", objectFit: "cover" }}
            />
          </div>
        )}

        <h2
          style={{
            fontSize: "1.8rem",
            marginBottom: "0.4rem",
            fontWeight: 700,
          }}
        >
          {title}
        </h2>

        <p style={{ color: "#4b5563", marginBottom: "0.5rem" }}>
          나눔 품목: {share.item}
        </p>

        {share.description && (
          <p
            style={{
              marginTop: "1rem",
              marginBottom: "1.5rem",
              padding: "1rem 1.25rem",
              backgroundColor: "#f9fafb",
              borderRadius: "12px",
              color: "#374151",
              lineHeight: 1.5,
            }}
          >
            {share.description}
          </p>
        )}

        {/* 정보 섹션 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          <div>
            <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>나눔 수량</div>
            <div
              style={{
                fontSize: "1.3rem",
                fontWeight: 700,
                marginTop: "0.3rem",
              }}
            >
              {quantityText}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>
              소비기한 / 남은 시간
            </div>
            <div
              style={{
                fontSize: "1.05rem",
                fontWeight: 600,
                marginTop: "0.3rem",
                color: isExpired ? "#ef4444" : "#111827",
              }}
            >
              {expiryDate
                ? `${share.expiry.slice(0, 10)} · ${leftText}`
                : leftText}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>상태</div>
            <div
              style={{
                marginTop: "0.3rem",
                display: "inline-block",
                padding: "0.3rem 0.75rem",
                borderRadius: "999px",
                fontSize: "0.85rem",
                fontWeight: 600,
                backgroundColor: isClosed ? "#fee2e2" : "#dcfce7",
                color: isClosed ? "#b91c1c" : "#166534",
              }}
            >
              {isClosed ? "나눔 종료" : "나눔 진행 중"}
            </div>
          </div>
        </div>

        {/* 위치 / 주최자 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            marginBottom: "0.5rem",
            fontSize: "0.95rem",
            color: "#4b5563",
          }}
        >
          {share.location && (
            <div>
              <strong>나눔 위치 : </strong>
              {share.location}
            </div>
          )}
          {ownerName && (
            <div>
              <strong>나눔 제공자 : </strong>
              {ownerName}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShareDetail;