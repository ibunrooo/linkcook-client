// src/pages/Share.jsx
import { useEffect, useState } from 'react';

function Share() {
  const [shares, setShares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchShares = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/share');
        const data = await res.json();

        if (!res.ok || data.success === false) {
          throw new Error(data.message || '나눔 목록을 불러오지 못했습니다.');
        }

        setShares(data.data || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShares();
  }, []);

  if (loading) return <p>나눔 목록을 불러오는 중입니다...</p>;
  if (error) return <p>에러: {error}</p>;
  if (shares.length === 0) return <p>등록된 나눔이 아직 없습니다.</p>;

  return (
    <div>
      <h2>식재료 나눔 목록</h2>
      <ul>
        {shares.map((share) => (
          <li key={share._id}>
            <strong>{share.item}</strong> - 수량: {share.quantity} / 위치: {share.location}
            {share.expiry && ` / 소비기한: ${share.expiry}`}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Share;
