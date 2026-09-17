import { Link } from "react-router-dom";
import PageContainer from "../components/PageContainer";
import EmptyState from "../components/EmptyState";

export default function NotFoundPage() {
  return (
    <PageContainer>
      <div className="px-4 py-16">
        <EmptyState
          title="Page not found"
          description="That page doesn't exist."
          action={
            <Link to="/" className="nu-btn nu-btn-primary px-4 py-2 text-sm">
              Back to My List
            </Link>
          }
        />
      </div>
    </PageContainer>
  );
}
