
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface LoginFormProps {
  onSignIn: (email: string, password: string) => Promise<void>;
  loading: boolean;
  onSwitchToSignUp: () => void;
  onForgotPassword: () => void;
}

export const LoginForm = ({ onSignIn, loading, onSwitchToSignUp, onForgotPassword }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    onSignIn(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
      </div>
      <div>
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          disabled={loading}
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Signing In..." : "Sign In"}
      </Button>
      <div className="mt-4 text-center space-y-2">
        <button
          type="button"
          onClick={onSwitchToSignUp}
          className="text-sm text-muted-foreground hover:text-foreground block w-full"
          disabled={loading}
        >
          Don't have an account? Sign up
        </button>
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm text-muted-foreground hover:text-foreground"
          disabled={loading}
        >
          Forgot your password?
        </button>
      </div>
    </form>
  );
};
