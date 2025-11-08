import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { MessageSquare, X } from "lucide-react";
import RealtimeChat from "./Chat";
// import { RealtimeChat } from "./RealtimeChat"; // The component from our previous step

export default function PopoverChat({ initialMessages }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {/* This is the floating button, which is always visible */}
        <Button
          className="fixed bottom-16 right-8 z-50 h-10 w-10 rounded-full shadow-lg"
          size="icon"
        >
          {isOpen ? (
            <X className="h-8 w-8" />
          ) : (
            <MessageSquare className="h-8 w-8" />
          )}
          <span className="sr-only">Toggle chat</span>
        </Button>
      </PopoverTrigger>

      {/* This is the chat window that pops up */}
      <PopoverContent
        side="top"
        align="end"
        sideOffset={16}
        className="flex h-[70svh] max-h-[600px] w-[calc(100vw-48px)] max-w-md flex-col p-0"
      >
        {/* We add our own header inside the Popover */}
        <div className="border-b p-4">
          <h3 className="font-medium">Board Chat</h3>
          <p className="text-sm text-muted-foreground">
            Chat with everyone in this space.
          </p>
        </div>

        {/* Our existing RealtimeChat component fits perfectly inside. */}
        <RealtimeChat initialMessages={initialMessages} />
      </PopoverContent>
    </Popover>
  );
}
