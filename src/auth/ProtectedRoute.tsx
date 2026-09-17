import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./auth-context-types";
import PageContainer from "../components/PageContainer";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return (
      <PageContainer>
        <div className="flex min-h-dvh items-center justify-center">
          <div className="nu-shimmer h-10 w-40 rounded-lg" />
        </div>
      </PageContainer>
    );
  }

  if (status === "signed-out") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
