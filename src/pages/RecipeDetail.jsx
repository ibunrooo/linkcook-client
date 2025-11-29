// src/pages/RecipeDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import apiClient from '../api/client';
import WhiteCard from '../components/common/WhiteCard';

const pageStyle = {
  maxWidth: '960px',
  margin: '0 auto',
  padding: '2rem 1.5rem 4rem',
};

function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth0();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profileNickname, setProfileNickname] = useState('');

  // 👍 좋아요 관련 상태
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/recipes/${id}`);
        const data = await res.json();

        if (!res.ok || data.success === false) {
          throw new Error(data.message || '레시피 정보를 불러오지 못했습니다.');
        }

        setRecipe(data.data);
        setLikeCount(data.data.likesCount || 0); // 서버에서 오는 좋아요 수
        // 🔸 현재는 유저별 liked 여부 정보가 없어서 기본값은 false 로 두고,
        //    버튼을 한 번 누르면 서버 응답 기준으로 liked 상태가 바뀌도록 처리.
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  useEffect(() => {
    const syncProfile = async () => {
      if (!isAuthenticated || !user?.sub) return;
      try {
        const res = await fetch('http://localhost:4000/api/users/me', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            auth0Id: user.sub,
            email: user.email,
            nickname: user.nickname || user.name,
            avatar: user.picture,
          }),
        });
        const data = await res.json();
        if (res.ok && data?.data) {
          setProfileNickname(data.data.nickname || '');
        }
      } catch (e) {
        // ignore
      }
    };
    syncProfile();
  }, [isAuthenticated, user]);

  const auth0Id = user?.sub;
  const userNickname = profileNickname || user?.nickname || user?.name;
  const isOwner =
    isAuthenticated &&
    ((recipe?.authorAuth0Id && recipe.authorAuth0Id === auth0Id) ||
      (!recipe?.authorAuth0Id &&
        recipe?.author &&
        userNickname &&
        recipe.author === userNickname));

  // 좋아요 토글 버튼 클릭
  const handleLikeClick = async () => {
    if (!isAuthenticated || !user || !recipe) return;

    try {
      const res = await apiClient.post(`/api/recipes/${recipe._id}/like`, {
        auth0Id: user.sub,
      });

      if (res.success === false) {
        throw new Error(res.message || '좋아요 처리에 실패했습니다.');
      }

      setLikeCount(res.data.likesCount);
      setLiked(res.data.liked);
    } catch (err) {
      console.error(err);
      alert(err.message || '좋아요 처리 중 오류가 발생했습니다.');
    }
  };

  const handleEdit = () => {
    navigate(`/recipes/${id}/edit`);
  };

  const handleDelete = async () => {
    if (!isOwner || !recipe) return;
    const ok = window.confirm('정말 삭제하시겠습니까?');
    if (!ok) return;
    try {
      await apiClient.delete(`/api/recipes/${recipe._id}`, {
        data: { auth0Id, nickname: userNickname },
      });
      alert('삭제되었습니다.');
      navigate('/recipes');
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  if (loading) return <p style={pageStyle}>레시피 정보를 불러오는 중입니다...</p>;
  if (error) return <p style={pageStyle}>에러: {error}</p>;
  if (!recipe) return <p style={pageStyle}>레시피 정보를 찾을 수 없습니다.</p>;

  const ingredients = recipe.ingredients || [];
  const steps = (recipe.steps || []).slice().sort((a, b) => a.order - b.order);

  return (
    <div style={pageStyle}>
      <button
        onClick={() => navigate(-1)}
        style={{
          border: 'none',
          background: 'none',
          color: '#6b7280',
          marginBottom: '1rem',
          cursor: 'pointer',
        }}
      >
        ← 레시피 목록으로
      </button>

      <WhiteCard>
        {recipe.image && (
          <div style={{ marginBottom: '1rem' }}>
            <img
              src={recipe.image}
              alt={recipe.title || '레시피 이미지'}
              style={{
                width: '100%',
                maxHeight: '360px',
                objectFit: 'cover',
                borderRadius: '14px',
                border: '1px solid #e5e7eb',
              }}
            />
          </div>
        )}

        {/* 제목 & 한 줄 소개 */}
        <h2
          style={{
            fontSize: '1.8rem',
            marginBottom: '0.4rem',
            fontWeight: '700',
          }}
        >
          {recipe.title}
        </h2>

        {isOwner && (
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <button
              type="button"
              onClick={handleEdit}
              style={{
                border: '1px solid #d1d5db',
                borderRadius: '10px',
                padding: '0.45rem 0.9rem',
                cursor: 'pointer',
                background: '#f9fafb',
              }}
            >
              수정
            </button>
            <button
              type="button"
              onClick={handleDelete}
              style={{
                border: '1px solid #fca5a5',
                borderRadius: '10px',
                padding: '0.45rem 0.9rem',
                cursor: 'pointer',
                background: '#fee2e2',
                color: '#b91c1c',
              }}
            >
              삭제
            </button>
          </div>
        )}

        {/* 👍 좋아요 버튼 */}
        <div style={{ marginBottom: '1rem' }}>
          <button
            type="button"
            onClick={handleLikeClick}
            disabled={!isAuthenticated}
            style={{
              border: 'none',
              borderRadius: '999px',
              padding: '0.35rem 0.9rem',
              fontSize: '0.9rem',
              cursor: isAuthenticated ? 'pointer' : 'not-allowed',
              backgroundColor: liked ? '#fee2e2' : '#f3f4f6',
              color: liked ? '#b91c1c' : '#374151',
            }}
          >
            {liked ? '❤️ 좋아요' : '🤍 좋아요'}
            <span style={{ marginLeft: '0.4rem' }}>{likeCount}</span>
          </button>
          {!isAuthenticated && (
            <span
              style={{
                marginLeft: '0.5rem',
                fontSize: '0.8rem',
                color: '#9ca3af',
              }}
            >
              (로그인 후 이용 가능)
            </span>
          )}
        </div>

        {recipe.description && (
          <p
            style={{
              color: '#4b5563',
              marginBottom: '1.5rem',
            }}
          >
            {recipe.description}
          </p>
        )}

        {/* 재료 */}
        <section style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.8rem' }}>
            재료
          </h3>
          {ingredients.length === 0 ? (
            <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
              등록된 재료 정보가 없습니다.
            </p>
          ) : (
            <ul
              style={{
                margin: 0,
                paddingLeft: '1.1rem',
                lineHeight: 1.6,
                color: '#374151',
              }}
            >
              {ingredients.map((ing) => (
                <li key={ing._id || ing.name}>
                  {ing.name}
                  {ing.amount ? ` - ${ing.amount}` : ''}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* 조리 순서 */}
        <section>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.8rem' }}>
            조리 순서
          </h3>
          {steps.length === 0 ? (
            <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
              등록된 조리 순서가 없습니다.
            </p>
          ) : (
            <ol
              style={{
                margin: 0,
                paddingLeft: '1.3rem',
                lineHeight: 1.7,
                color: '#374151',
              }}
            >
              {steps.map((step) => (
                <li key={step._id || step.order} style={{ marginBottom: '0.3rem' }}>
                  {step.text}
                </li>
              ))}
            </ol>
          )}
        </section>
      </WhiteCard>
    </div>
  );
}

export default RecipeDetail;
