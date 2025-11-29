// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainHeader from "./components/MainHeader";

import Home from "./pages/Home";
import Recipes from "./pages/Recipes";
import RecipeDetail from "./pages/RecipeDetail";
import RecipeCreate from "./pages/RecipeCreate";
import RecipeEdit from "./pages/RecipeEdit";
import ShareList from "./pages/ShareList";
import ShareDetail from "./pages/ShareDetail";
import ShareCreate from "./pages/ShareCreate";
import ShareEdit from "./pages/ShareEdit";
import GroupBuyList from "./pages/GroupBuyList";
import GroupBuyDetail from "./pages/GroupBuyDetail";
import GroupBuyCreate from "./pages/GroupBuyCreate";
import GroupBuyEdit from "./pages/GroupBuyEdit";
import MyPage from "./pages/MyPage";

const layoutStyles = {
  app: {
    minHeight: "100vh",
    backgroundColor: "#fafafa",
  },
  main: {
    paddingTop: "1rem",
  },
};

function App() {
  return (
    <BrowserRouter>
      <div style={layoutStyles.app}>
        <MainHeader />

        <main style={layoutStyles.main}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/recipes/create" element={<RecipeCreate />} />
            <Route path="/recipes/:id/edit" element={<RecipeEdit />} />
            <Route path="/recipes/:id" element={<RecipeDetail />} />
            <Route path="/share" element={<ShareList />} />
            <Route path="/share/create" element={<ShareCreate />} />
            <Route path="/share/:id/edit" element={<ShareEdit />} />
            <Route path="/share/:id" element={<ShareDetail />} />
            <Route path="/groupbuy" element={<GroupBuyList />} />
            <Route path="/groupbuy/create" element={<GroupBuyCreate />} />
            <Route path="/groupbuy/:id/edit" element={<GroupBuyEdit />} />
            <Route path="/groupbuy/:id" element={<GroupBuyDetail />} />
            <Route path="/mypage" element={<MyPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
