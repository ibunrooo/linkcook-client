// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";

import Home from "./pages/Home";
import Recipes from "./pages/Recipes";
import RecipeDetail from "./pages/RecipeDetail";
import RecipeCreate from "./pages/RecipeCreate";

import ShareList from "./pages/ShareList";
import ShareCreate from "./pages/ShareCreate";
import ShareDetail from "./pages/ShareDetail";

import GroupBuyList from "./pages/GroupBuyList";
import GroupBuyCreate from "./pages/GroupBuyCreate";
import GroupBuyDetail from "./pages/GroupBuyDetail";

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Home />} />

          {/* 레시피 */}
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/recipes/create" element={<RecipeCreate />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} />

          {/* 나눔 */}
          <Route path="/share" element={<ShareList />} />
          <Route path="/share/create" element={<ShareCreate />} />
          <Route path="/share/:id" element={<ShareDetail />} />

          {/* 공동구매 */}
          <Route path="/groupbuy" element={<GroupBuyList />} />
          <Route path="/groupbuy/create" element={<GroupBuyCreate />} />
          <Route path="/groupbuy/:id" element={<GroupBuyDetail />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;