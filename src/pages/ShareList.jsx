// src/pages/ShareList.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function ShareList() {
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

  return (
    <section>
      <div className="page-header">
        <div>
          <h2 className="page-title">식재료 나눔</h2>
          <p className="page-subtitle">
            아직 쓸 수 있는 재료를 버리는 대신, 근처 이웃에게 나눠주세요.
          </p>
        </div>
        <Link to="/share/create" className="btn-primary">
          나눔 등록하기
        </Link>
      </div>

      {loading && <p>나눔 목록을 불러오는 중입니다...</p>}
      {error && <p style={{ color: 'var(--danger)' }}>에러: {error}</p>}

      {!loading && !error && shares.length === 0 && (
        <div className="empty-state">
          등록된 나눔이 아직 없습니다.  
          오늘 냉장고를 한 번 둘러보고, 남는 재료를 올려볼까요?
        </div>
      )}

      {!loading && !error && shares.length > 0 && (
        <div className="card-list">
          {shares.map((share) => (
            <div className="card" key={share._id}>
              <div className="card-title">{share.item}</div>
              {share.description && (
                <div className="card-meta">{share.description}</div>
              )}
              <div className="card-footer">
                <span className="badge">나눔</span>
                <span className="card-meta">
                  수량 {share.quantity || '-'} · 위치 {share.location}
                  {share.expiry && ` · 소비기한 ${share.expiry}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default ShareList;
