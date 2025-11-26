// src/components/common/WhiteCard.jsx
function WhiteCard({ children, style }) {
  return (
    <section
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "18px",
        boxShadow: "0 12px 30px rgba(15, 23, 42, 0.06)",
        padding: "2rem",
        marginBottom: "2rem",
        ...style,
      }}
    >
      {children}
    </section>
  );
}

export default WhiteCard;