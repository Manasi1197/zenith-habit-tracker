import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isUpdatePassword, setIsUpdatePassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for password reset flow. With Supabase v2, this information is in the URL hash.
    const params = new URLSearchParams(window.location.hash.substring(1));
    const type = params.get('type');

    if (type === 'recovery') {
      // User is in password reset flow
      setIsUpdatePassword(true);
      setIsForgotPassword(false);
      setIsLogin(false);
      return;
    }

    // Normal user redirect logic (only if not in password reset flow)
    if (user && !isUpdatePassword) {
      navigate("/");
    }
  }, [user, navigate, isUpdatePassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isUpdatePassword) {
      if (!newPassword.trim() || !confirmPassword.trim()) {
        toast.error("Please fill in both password fields");
        return;
      }

      if (newPassword !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      if (newPassword.length < 6) {
        toast.error("Password must be at least 6 characters long");
        return;
      }

      setLoading(true);
      
      try {
        const { error } = await supabase.auth.updateUser({
          password: newPassword
        });

        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Password updated successfully!");
          // Clear URL parameters and redirect to main app
          window.history.replaceState({}, document.title, "/auth");
          navigate("/");
        }
      } catch (error) {
        toast.error("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!email.trim() || (!isForgotPassword && !password.trim())) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    
    try {
      if (isForgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth`,
        });

        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Password reset email sent! Check your inbox.");
          setIsForgotPassword(false);
        }
      } else {
        const { error } = isLogin 
          ? await signIn(email, password)
          : await signUp(email, password);

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast.error("Invalid email or password");
          } else if (error.message.includes("User already registered")) {
            toast.error("An account with this email already exists");
          } else {
            toast.error(error.message);
          }
        } else {
          if (isLogin) {
            toast.success("Welcome back!");
            navigate("/");
          } else {
            toast.success("Account created successfully! Welcome to Zenith Habit Tracker!");
            navigate("/");
          }
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (isUpdatePassword) return "Update Your Password";
    if (isForgotPassword) return "Reset Password";
    return isLogin ? "Sign in to your account" : "Create a new account";
  };

  const getButtonText = () => {
    if (loading) return "Loading...";
    if (isUpdatePassword) return "Update Password";
    if (isForgotPassword) return "Send Reset Email";
    return isLogin ? "Sign In" : "Sign Up";
  };

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Zenith Habit Tracker</CardTitle>
          <CardDescription>
            {getTitle()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isUpdatePassword ? (
              <>
                <div>
                  <Input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {!isForgotPassword && (
                  <div>
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                )}
              </>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {getButtonText()}
            </Button>
          </form>
          
          <div className="mt-4 text-center space-y-2">
            {isUpdatePassword ? (
              <button
                type="button"
                onClick={() => {
                  setIsUpdatePassword(false);
                  setIsLogin(true);
                  window.history.replaceState({}, document.title, "/auth");
                }}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Cancel and go to sign in
              </button>
            ) : !isForgotPassword ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-muted-foreground hover:text-foreground block w-full"
                >
                  {isLogin 
                    ? "Don't have an account? Sign up" 
                    : "Already have an account? Sign in"
                  }
                </button>
                {isLogin && (
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Forgot your password?
                  </button>
                )}
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsForgotPassword(false)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Back to sign in
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
