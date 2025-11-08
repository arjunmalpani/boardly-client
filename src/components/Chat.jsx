import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { socket } from "../lib/socket";
import useAuthStore from "../store/useAuthStore";

export default function RealtimeChat({ initialMessages = [] }) {
  const { id: boardId } = useParams();
  const currentUser = useAuthStore((state) => state.user);

  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const handleReceive = (msg) => setMessages((prev) => [...prev, msg]);
    socket.on("receive-message", handleReceive);
    return () => socket.off("receive-message", handleReceive);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    const message = {
      id: crypto.randomUUID(),
      text: newMessage,
      senderId: currentUser._id,
      senderName: currentUser.displayName,
      timestamp: new Date(),
    };

    socket.emit("send-message", { boardId, message });
    setNewMessage("");
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex flex-col gap-4">
          {messages.map((msg) => (
            <MessageItem
              key={msg.id}
              message={msg}
              currentUserId={currentUser?._id}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t p-4">
        <form
          onSubmit={handleSubmit}
          className="flex w-full items-center gap-2"
        >
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </>
  );
}

function MessageItem({ message, currentUserId }) {
  const isUser = message.senderId === currentUserId;

  return (
    <div
      className={cn(
        "flex items-start gap-3",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback>
            {message.senderName?.charAt(0) || "S"}
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "max-w-[75%] rounded-lg p-3 text-sm",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted"
        )}
      >
        {!isUser && (
          <p className="text-xs font-bold mb-1">{message.senderName}</p>
        )}
        <p>{message.text}</p>
        <time className="mt-1 block text-xs opacity-60">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </time>
      </div>

      {isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback>You</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
