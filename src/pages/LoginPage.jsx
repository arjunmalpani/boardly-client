import { LoginForm } from "@/components/login-form";
import { axioscall } from "@/lib/axios";
import axios from "axios";
import { useEffect } from "react";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <div className="h-full w-full flex items-center justify-center p-10">
          <img
            src="/placeholder.svg"
            alt="Image"
            className="size-3/4 dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </div>
    </div>
  );
}
