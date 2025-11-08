import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
// --- Fix: Switched to relative path ---
import { axioscall } from "../lib/axios";
import { Frown, Home, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * This "Protective Wrapper" fetches the space data, checks for auth,
 * and handles loading/error states.
 * It passes the loaded data to its child component.
 */
export function SpaceAuthWrapper({ children }) {
  const { id: boardId } = useParams();
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [boardData, setBoardData] = useState(null);

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      try {
        setLoading(true);
        const res = await axioscall.get(`/space/${boardId}`);
        setBoardData(res.data); // On success, save the data
      } catch (err) {
        if (err.response) {
          // 403 Forbidden or 404 Not Found
          setAuthError(
            err.response.data.message || "You don't have access to this page."
          );
        } else {
          setAuthError("Could not connect to the server.");
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndLoad();
  }, [boardId]);

  // --- Loading State ---
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center mt-16">
        <p>Loading your whiteboard...</p>
      </div>
    );
  }

  // --- Error State (Your CTA) ---
  if (authError) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center mt-16 text-center p-4">
        <Frown className="w-16 h-16 text-destructive" />
        <h1 className="mt-4 text-2xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground">{authError}</p>
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Button className="mt-6" onClick={() => window.location.reload()}>
            <RefreshCcw className="h-4 w-4" />
            Refresh Page
          </Button>
          <Button asChild className="mt-6">
            <Link to="/dashboard">
              <Home className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // --- Success State ---
  // Render the child (WhiteboardPage) and pass the data as a prop
  return <>{children(boardData)}</>;
}
