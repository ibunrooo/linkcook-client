// src/pages/GroupBuyCreate.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function GroupBuyCreate() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [targetCount, setTargetCount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:4000/api/groupbuy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: desc,
          price: Number(price),
          targetCount: Number(targetCount),
          deadline,
          image,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message || "공동구매 등록 실패");
      }

      navigate("/groupbuy");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: "1rem" }}>공동구매 등록</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          maxWidth: "480px",
        }}
      >
        <input
          type="text"
          placeholder="공동구매 제목 *"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="설명"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          rows={4}
        />

        <input
          type="number"
          placeholder="상품 가격 (원)"
          required
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          type="number"
          placeholder="목표 인원 *"
          required
          value={targetCount}
          onChange={(e) => setTargetCount(e.target.value)}
        />

        <input
          type="date"
          placeholder="마감일 *"
          required
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />

        <input
          type="text"
          placeholder="이미지 URL (선택)"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />

        <button
          type="submit"
          style={{
            padding: "0.7rem 0",
            background: "#ffb347",
            borderRadius: "8px",
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
          }}
        >
          등록하기
        </button>
      </form>
    </div>
  );
}

export default GroupBuyCreate;
