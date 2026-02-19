import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { signInWithGoogle } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Admin credentials
  const ADMIN_EMAIL = "admin@biosentinel.co.za";
  const ADMIN_PASSWORD = "1234";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    // Validate admin credentials
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Set authentication state
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userName', 'Admin User');
      
      toast({
        title: "Login successful",
        description: "Welcome back to BioSentinel!",
      });
      
      navigate("/dashboard");
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGoogleSignIn = async () => {
    // Disabled - do nothing
    toast({
      title: "Feature Disabled",
      description: "Google Sign-In is currently disabled. Please use admin credentials.",
      variant: "destructive",
    });
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = Object.fromEntries(formData);
    
    // For demo purposes, just log in
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userEmail', data.email as string);
    localStorage.setItem('userName', data.name as string);
    
    toast({
      title: "Account created",
      description: "Welcome to BioSentinel!",
    });
    
    navigate("/dashboard");
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#1a1a1a] px-4 py-12 md:px-8 md:pt-24">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-transparent to-gray-800/30" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 mx-auto flex w-full flex-col gap-8 sm:max-w-[400px]"
      >
        {/* Header */}
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="relative">
            {/* Background pattern */}
            <div className="absolute top-1/2 left-1/2 z-0 h-32 w-32 -translate-x-1/2 -translate-y-1/2 opacity-20">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-600 via-gray-700/50 to-transparent" />
            </div>
                 {/* Logo */}
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center relative z-10 mx-auto">
          <Shield className="h-6 w-6 text-white" />
        </div>
          </div>
          
          <div className="z-10 flex flex-col gap-2 md:gap-3">
            <h1 className="text-3xl font-semibold text-foreground md:text-4xl">Log in to your account</h1>
            <p className="text-sm text-muted-foreground md:text-base">Welcome back! Please enter your details.</p>
          </div>
          
          {/* Admin Credentials Display */}
          <div className="z-10 w-full rounded-lg border border-border bg-muted/30 p-3">
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-muted-foreground mt-0.5" strokeWidth={1.5} />
              <div className="flex-1">
                <h3 className="text-xs font-normal text-muted-foreground mb-2">Demo Credentials</h3>
                <div className="space-y-1 text-xs text-muted-foreground/80">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground/60">Email:</span>
                    <code className="rounded bg-muted/50 px-1.5 py-0.5 text-muted-foreground font-mono text-[10px]">admin@biosentinel.co.za</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground/60">Password:</span>
                    <code className="rounded bg-muted/50 px-1.5 py-0.5 text-muted-foreground font-mono text-[10px]">1234</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <Tabs defaultValue="login" className="z-10 w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted/50">
              <TabsTrigger value="signup" className="text-sm">Sign up</TabsTrigger>
              <TabsTrigger value="login" className="text-sm">Log in</TabsTrigger>
            </TabsList>
            
            {/* Login Form */}
            <TabsContent value="login" className="mt-6">
              <form onSubmit={handleLogin} className="flex flex-col gap-6">
                <div className="flex flex-col gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      required
                      className="h-11"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      required
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <label
                      htmlFor="remember"
                      className="text-sm text-foreground cursor-pointer"
                    >
                      Remember for 30 days
                    </label>
                  </div>

                  <Button
                    type="button"
                    variant="link"
                    className="h-auto p-0 text-sm text-primary hover:text-primary/80"
                  >
                    Forgot password
                  </Button>
                </div>

                <div className="flex flex-col gap-4">
                  <Button type="submit" size="lg" className="w-full h-12">
                    Sign in
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="w-full h-12 gap-2 opacity-50 cursor-not-allowed"
                    onClick={handleGoogleSignIn}
                    disabled={true}
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Sign in with Google (Disabled)
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            {/* Signup Form */}
            <TabsContent value="signup" className="mt-6">
              <form onSubmit={handleSignup} className="flex flex-col gap-6">
                <div className="flex flex-col gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-sm font-medium">
                      Full Name
                    </Label>
                    <Input
                      id="signup-name"
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      required
                      className="h-11"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-sm font-medium">
                      Email
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      required
                      className="h-11"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-sm font-medium">
                      Password
                    </Label>
                    <Input
                      id="signup-password"
                      type="password"
                      name="password"
                      placeholder="Create a password"
                      required
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <Button type="submit" size="lg" className="w-full h-12">
                    Create account
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="w-full h-12 gap-2"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                        </svg>
                        Sign up with Google
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="z-10 flex justify-center gap-1 text-center">
          <span className="text-sm text-muted-foreground">Don't have an account?</span>
          <Button
            variant="link"
            className="h-auto p-0 text-sm text-primary hover:text-primary/80"
          >
            Sign up
          </Button>
        </div>
      </motion.div>
    </section>
  );
};

export default Login;
