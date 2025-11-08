// src/App.jsx
import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";

import useAuthStore from "./store/useAuthStore";

// Importing pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import WhiteboardPage from "./pages/WhiteboardPage";
import DashboardPage from "./pages/DashboardPage";

import ProtectedRoute from "./components/ProtectedRoute";

import LoadingScreen from "./components/LoadingScreen";
import { Toaster } from "react-hot-toast";
import { HeaderLayout } from "./components/HeaderLayout";
import { SpaceAuthWrapper } from "./components/SpaceAuthWrapper";
function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return <LoadingScreen />;
  }
  return (
    <>
      <Routes>
        <Route element={<HeaderLayout />}>
          <Route
            path="/"
            element={
              !isAuthenticated ? (
                <Navigate to={"/login"} />
              ) : (
                <Navigate to={"dashboard"} />
              )
            }
          />
          <Route
            path="/login"
            element={
              !isAuthenticated ? <LoginPage /> : <Navigate to={"/dashboard"} />
            }
          />
          <Route
            path="/register"
            element={
              !isAuthenticated ? (
                <RegisterPage />
              ) : (
                <Navigate to={"/dashboard"} />
              )
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/whiteboard/:id"
            element={
              <ProtectedRoute>
                <SpaceAuthWrapper>
                  {(boardData) => <WhiteboardPage boardData={boardData} />}
                </SpaceAuthWrapper>
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

export default App;
