import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import useAuthStore from "@/store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export function LoginForm({ className, ...props }) {
  // Forms states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Login handler
  const loginUser = useAuthStore((state) => state.loginUser);
  const navigate = useNavigate();

  //   Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const loginPromise = loginUser({ username, password });
    toast.promise(loginPromise, {
      loading: "Logging in...",
      success: "Login successful!",
      error: "Login failed. Please try again.",
    });
    try {
      await loginPromise;
      //   on successful login, redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed try again");
    } finally {
      setPassword("");
      setIsLoading(false);
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="username">Username</FieldLabel>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
            placeholder="bobthehero"
            required
          />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            disabled={isLoading}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            required
          />
        </Field>
        <Field>
          <Button type="submit">Login</Button>
        </Field>
        <Field>
          <FieldDescription className="px-6 text-center">
            Don't have an account? <Link to="/register">Register</Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
