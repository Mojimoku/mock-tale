import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import TabsLayout from "./components/TabsLayout";
import LoginPage from "./pages/LoginPage";
import MyListPage from "./pages/MyListPage";
import DrinksPage from "./pages/DrinksPage";
import PantryPage from "./pages/PantryPage";
import RestaurantDetailPage from "./pages/RestaurantDetailPage";
import IngredientDetailPage from "./pages/IngredientDetailPage";
import SpiritDetailPage from "./pages/SpiritDetailPage";
import DrinkFormPage from "./pages/DrinkFormPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Tabbed routes: Restaurants/Drinks/Pantry plus the restaurant
            drill-in all keep the bottom tab bar. */}
        <Route
          element={
            <ProtectedRoute>
              <TabsLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<MyListPage />} />
          <Route path="/drinks" element={<DrinksPage />} />
          <Route path="/pantry" element={<PantryPage />} />
          <Route path="/restaurants/:restaurantId" element={<RestaurantDetailPage />} />
          <Route path="/ingredients/:ingredientId" element={<IngredientDetailPage />} />
          <Route path="/spirits/:spiritId" element={<SpiritDetailPage />} />
        </Route>

        {/* Modal-style flow: no tab bar. */}
        <Route
          path="/drinks/new"
          element={
            <ProtectedRoute>
              <DrinkFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drinks/:drinkId/edit"
          element={
            <ProtectedRoute>
              <DrinkFormPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}
