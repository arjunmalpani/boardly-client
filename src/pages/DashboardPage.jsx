import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, LayoutDashboard, Star, Clock, FileWarning } from "lucide-react";
import toast from "react-hot-toast";
import { axioscall } from "@/lib/axios"; // Your configured axios instance

// This is the "Create New" button, extracted for reuse
function CreateNewButton({ onSelect }) {
  return (
    <Button
      onClick={onSelect}
      className="mb-4 w-full"
      aria-label="Create new board"
    >
      <Plus className="mr-2 h-4 w-4" />
      Create New Board
    </Button>
  );
}

// A loading skeleton for the board cards
function BoardCardSkeleton() {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-1/3" />
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [spaces, setSpaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSpaceName, setNewSpaceName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  // --- 1. Fetch user's spaces from the axioscall ---
  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        setIsLoading(true);
        const res = await axioscall.get("/space");
        setSpaces(res.data);
      } catch (err) {
        console.error("Failed to fetch spaces:", err);
        toast.error("Could not fetch your spaces.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSpaces();
  }, []);

  // --- 2. Handle axioscall call to create a new space ---
  const handleCreateSpace = async () => {
    if (!newSpaceName.trim()) {
      toast.error("Please enter a name for your space.");
      return;
    }

    setIsCreating(true);
    const createPromise = axioscall.post("/space/createSpace", {
      spaceName: newSpaceName,
    });

    toast.promise(createPromise, {
      loading: "Creating new space...",
      success: (res) => {
        const newSpaceId = res.data.spaceId;
        setIsCreating(false);
        setIsDialogOpen(false); // Close the dialog
        setNewSpaceName(""); // Reset the input
        navigate(`/whiteboard/${newSpaceId}`); // Redirect to the new board
        return "New space created!";
      },
      error: (err) => {
        setIsCreating(false);
        return err.response?.data?.message || "Failed to create space.";
      },
    });
  };

  // --- 3. Render the correct content based on state ---
  const renderContent = () => {
    if (isLoading) {
      // --- Loading State ---
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <BoardCardSkeleton />
          <BoardCardSkeleton />
          <BoardCardSkeleton />
        </div>
      );
    }

    if (spaces.length === 0) {
      // --- Empty State ---
      return (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
          <FileWarning className="w-12 h-12 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold">No spaces found</h2>
          <p className="mt-2 text-muted-foreground">
            Get started by creating a new space.
          </p>
          <Button onClick={() => setIsDialogOpen(true)} className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Space
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* "Create New" Card for mobile */}
        <Card className="md:hidden flex items-center justify-center border-2 border-dashed hover:border-primary">
          <Button
            onClick={() => setIsDialogOpen(true)}
            variant="outline"
            className="h-12 w-40"
          >
            <Plus className="h-6 w-6" />
            <span className="ml-2">Create New</span>
          </Button>
        </Card>

        {/* --- Real Board Cards --- */}
        {spaces.map((space) => (
          <Card key={space._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="truncate">{space.spaceName}</CardTitle>
              <CardDescription>
                <Link
                  to={`/whiteboard/${space.spaceId}`} // Use the nanoid here
                  className="text-sm text-primary hover:underline"
                  aria-label={`Open board ${space.spaceName}`}
                >
                  Open board
                </Link>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-between items-center text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>
                  Updated {new Date(space.updatedAt).toLocaleDateString()}
                </span>
              </div>
              {/* Add starred logic here if you have it */}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="flex min-h-[calc(100vh-var(--navbar-height))] mt-16">
        {/* --- Sidebar --- */}
        <aside className="w-64 border-r bg-muted/40 p-4 hidden md:block">
          <nav className="flex flex-col gap-2">
            <CreateNewButton onSelect={() => setIsDialogOpen(true)} />

            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              asChild
            >
              <Link to="/dashboard">
                <LayoutDashboard className="h-4 w-4" />
                All Boards
              </Link>
            </Button>
            {/* Future Feature */}
            {/* <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              asChild
            >
              <Link to="/dashboard/starred">
                <Star className="h-4 w-4" />
                Starred Boards
              </Link>
            </Button> */}
          </nav>
        </aside>

        <main className="flex-1 p-6 md:p-10">
          <h1 className="text-3xl font-bold mb-6">Your Boards</h1>
          {renderContent()}
        </main>
      </div>

      {/* --- Create New Space Dialog (Modal) --- */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Space</DialogTitle>
            <DialogDescription>
              Give your new space a name to get started.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newSpaceName}
                onChange={(e) => setNewSpaceName(e.target.value)}
                placeholder="My Awesome Project"
                className="col-span-3"
                disabled={isCreating}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost" disabled={isCreating}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              onClick={handleCreateSpace}
              disabled={isCreating}
            >
              {isCreating ? "Creating..." : "Create Space"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
