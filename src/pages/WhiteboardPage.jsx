import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
// --- Fix: Switched to relative path ---
import { axioscall } from "../lib/axios";
import { Frown, Home, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Whiteboard from "@/components/Whiteboard";
import PopoverChat from "@/components/PopoverChat";

export default function WhiteboardPage() {
  const { id: boardId } = useParams();
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [boardData, setBoardData] = useState(null);
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const checkAuthAndLoad = async () => {
      try {
        setLoading(true);
        const res = await axioscall.get(`/space/${boardId}`);
        console.log(res);

        setMessages(res.data.messages || []);
        setBoardData(res.data.boardState);
      } catch (err) {
        if (err.response) {
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
  //   Handle Auth Error State
  if (authError) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center mt-16 text-center p-4">
        <Frown className="w-16 h-16 text-destructive" />
        <h1 className="mt-4 text-2xl font-bold">{authError}</h1>
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
  return (
    <>
      <Whiteboard boardState={boardData} />
      <PopoverChat initialMessages={messages} />
    </>
  );
}
