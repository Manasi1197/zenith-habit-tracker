
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ForgotPasswordFormProps {
  onResetPassword: (email: string) => Promise<void>;
  loading: boolean;
  onBackToSignIn: () => void;
}

export const ForgotPasswordForm = ({ onResetPassword, loading, onBackToSignIn }: ForgotPasswordFormProps) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please fill in your email");
      return;
    }
    onResetPassword(email);
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
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Sending..." : "Send Reset Email"}
      </Button>
      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={onBackToSignIn}
          className="text-sm text-muted-foreground hover:text-foreground"
          disabled={loading}
        >
          Back to sign in
        </button>
      </div>
    </form>
  );
};
