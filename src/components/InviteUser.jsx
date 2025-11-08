import { useState } from "react";
import toast from "react-hot-toast";
import { axioscall } from "@/lib/axios"; // Using your project's alias path

// --- ShadCN UI Components for the Invite Modal ---
import { Button } from "@/components/ui/button";
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
import { UserPlus } from "lucide-react";

export function InviteUser({ boardId }) {
  const [inviteUsername, setInviteUsername] = useState("");
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isInviting, setIsInviting] = useState(false);

  const handleInvite = async () => {
    if (!inviteUsername.trim()) {
      return toast.error("Please enter a username to invite.");
    }
    setIsInviting(true);
    // Use the API route from your backend
    const invitePromise = axioscall.put(`/space/${boardId}/invite`, {
      username: inviteUsername.trim(),
    });

    toast.promise(invitePromise, {
      loading: `Inviting ${inviteUsername}...`,
      success: (res) => {
        setIsInviting(false);
        setIsInviteOpen(false); // Close the dialog
        setInviteUsername(""); // Reset input
        return res.data.message || "User invited successfully!";
      },
      error: (err) => {
        setIsInviting(false);
        return err.response?.data?.message || "Failed to invite user.";
      },
    });
  };

return (
    <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen} className="transform -translate-x-1/2">
        <DialogTrigger asChild>
            <Button
                variant="outline"
                className="absolute top-1 right-1/2 z-50 bg-white cursor-pointer"
            >
                <UserPlus className="mr-2 h-4 w-4" />
                Invite
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Invite a User</DialogTitle>
                <DialogDescription>
                    Enter the username of the person you want to add to this space.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                        Username
                    </Label>
                    <Input
                        id="username"
                        value={inviteUsername}
                        onChange={(e) => setInviteUsername(e.target.value)}
                        placeholder="bobthehero"
                        className="col-span-3"
                        disabled={isInviting}
                    />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="ghost" disabled={isInviting}>
                        Cancel
                    </Button>
                </DialogClose>
                <Button type="submit" onClick={handleInvite} disabled={isInviting}>
                    {isInviting ? "Inviting..." : "Send Invite"}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
);
}
