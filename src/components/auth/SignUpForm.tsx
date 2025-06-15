
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface SignUpFormProps {
  onSignUp: (email: string, password: string) => Promise<void>;
  loading: boolean;
  onSwitchToSignIn: () => void;
}

export const SignUpForm = ({ onSignUp, loading, onSwitchToSignIn }: SignUpFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    onSignUp(email, password);
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
        {loading ? "Signing Up..." : "Sign Up"}
      </Button>
      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={onSwitchToSignIn}
          className="text-sm text-muted-foreground hover:text-foreground block w-full"
          disabled={loading}
        >
          Already have an account? Sign in
        </button>
      </div>
    </form>
  );
};
