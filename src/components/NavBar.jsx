import { Link, useNavigate } from "react-router-dom";
import { LineSquiggle } from "lucide-react";
// --- FIX: Using relative path to resolve the import error ---// Import shadcn components
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useAuthStore from "@/store/useAuthStore";

// A helper function to get initials from a name
function getInitials(name) {
  if (!name) return "??";
  const names = name.split(" ");
  if (names.length === 1) return name.substring(0, 2).toUpperCase();
  return (names[0][0] + names[names.length - 1][0]).toUpperCase();
}

export function Navbar() {
  // Get auth state and actions from the store
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const logoutUser = useAuthStore((state) => state.logoutUser);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      // On successful logout, redirect to the login page
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
      // You could show a toast error here
    }
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="flex justify-center items-center px-2 md:px-8">
        <div className="container flex h-16 items-center justify-between">
          {/* === Logo and Brand === */}
          <Link to="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-md">
              <LineSquiggle className="size-5" />
            </div>
            <span className="text-lg font-bold">Boardly</span>
          </Link>

          {/* === Nav Links === */}
          <nav className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {/* --- Logged In State --- */}
                <Button asChild variant="ghost">
                  {/* The `asChild` prop merges the Button's styles with the Link's functionality */}
                  <Link to="/dashboard">Dashboard</Link>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user?.avatar}
                          alt={user?.displayName}
                        />
                        <AvatarFallback>
                          {getInitials(user?.displayName || user?.username)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user?.displayName}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          @{user?.username}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile">Profile</Link>
                    </DropdownMenuItem>
                    {/* onSelect is used for actions, Link is for navigation */}
                    <DropdownMenuItem
                      onSelect={handleLogout}
                      className="text-destructive focus:text-destructive"
                    >
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                {/* --- Logged Out State --- */}
                <Button asChild variant="ghost">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Sign Up</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
