
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { UpdatePasswordForm } from "@/components/auth/UpdatePasswordForm";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isUpdatePassword, setIsUpdatePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.substring(1));
    const type = params.get('type');

    if (type === 'recovery') {
      setIsUpdatePassword(true);
      setIsForgotPassword(false);
      setIsLogin(false);
      return;
    }

    if (user && !isUpdatePassword) {
      navigate("/");
    }
  }, [user, navigate, isUpdatePassword]);

  const handleSignIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Invalid email or password");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success("Welcome back!");
        navigate("/");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await signUp(email, password);
      if (error) {
        if (error.message.includes("User already registered")) {
          toast.error("An account with this email already exists");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success("Account created successfully! Welcome to Zenith Habit Tracker!");
        navigate("/");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (email: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Password reset email sent! Check your inbox.");
        setIsForgotPassword(false);
        setIsLogin(true);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (newPassword: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Password updated successfully!");
        window.history.replaceState({}, document.title, "/auth");
        navigate("/");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const resetToLogin = () => {
    setIsUpdatePassword(false);
    setIsForgotPassword(false);
    setIsLogin(true);
    window.history.replaceState({}, document.title, "/auth");
  };

  const getTitle = () => {
    if (isUpdatePassword) return "Update Your Password";
    if (isForgotPassword) return "Reset Password";
    return isLogin ? "Sign in to your account" : "Create a new account";
  };

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Zenith Habit Tracker</CardTitle>
          <CardDescription>{getTitle()}</CardDescription>
        </CardHeader>
        <CardContent>
          {isUpdatePassword ? (
            <UpdatePasswordForm
              onUpdatePassword={handleUpdatePassword}
              loading={loading}
              onCancel={resetToLogin}
            />
          ) : isForgotPassword ? (
            <ForgotPasswordForm
              onResetPassword={handleResetPassword}
              loading={loading}
              onBackToSignIn={() => {
                setIsForgotPassword(false);
                setIsLogin(true);
              }}
            />
          ) : isLogin ? (
            <LoginForm
              onSignIn={handleSignIn}
              loading={loading}
              onSwitchToSignUp={() => setIsLogin(false)}
              onForgotPassword={() => {
                setIsLogin(false);
                setIsForgotPassword(true);
              }}
            />
          ) : (
            <SignUpForm
              onSignUp={handleSignUp}
              loading={loading}
              onSwitchToSignIn={() => setIsLogin(true)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
