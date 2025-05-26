
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import Logo from './Logo';

const LoginForm: React.FC = () => {
  const { signIn, signUp, loading } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);

  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });

  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'manager' as 'evaluator' | 'manager'
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('LoginForm - Sign in attempt for:', signInData.email);
    setAuthError(null);

    if (!signInData.email || !signInData.password) {
      setAuthError('Please fill in all fields');
      return;
    }

    const { error } = await signIn(signInData.email, signInData.password);

    if (error) {
      console.error('LoginForm - Sign in error:', error);
      let errorMessage = 'Sign in failed. Please try again.';
      
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please check your credentials.';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Please check your email and confirm your account before signing in.';
      } else if (error.message.includes('Too many requests')) {
        errorMessage = 'Too many sign in attempts. Please wait a moment and try again.';
      }
      
      setAuthError(errorMessage);
      toast({
        title: "Sign In Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } else {
      console.log('LoginForm - Sign in successful');
      toast({
        title: "Welcome back!",
        description: "You have been signed in successfully."
      });
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('LoginForm - Sign up attempt for:', signUpData.email);
    setAuthError(null);

    if (!signUpData.email || !signUpData.password || !signUpData.fullName) {
      setAuthError('Please fill in all fields');
      return;
    }

    if (signUpData.password.length < 6) {
      setAuthError('Password must be at least 6 characters long');
      return;
    }

    const { error, data } = await signUp(signUpData.email, signUpData.password, signUpData.fullName, signUpData.role);

    if (error) {
      console.error('LoginForm - Sign up error:', error);
      let errorMessage = 'Sign up failed. Please try again.';
      
      if (error.message.includes('User already registered')) {
        errorMessage = 'An account with this email already exists. Please sign in instead.';
      } else if (error.message.includes('Password should be at least 6 characters')) {
        errorMessage = 'Password must be at least 6 characters long.';
      } else if (error.message.includes('Invalid email')) {
        errorMessage = 'Please enter a valid email address.';
      }
      
      setAuthError(errorMessage);
      toast({
        title: "Sign Up Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } else {
      console.log('LoginForm - Sign up successful:', data);
      if (data.user && !data.session) {
        toast({
          title: "Account Created!",
          description: "Please check your email to verify your account before signing in."
        });
      } else {
        toast({
          title: "Account Created!",
          description: "Your account has been created and you are now signed in."
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-university-lightGray px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo size="lg" showText={true} />
          <h1 className="text-2xl font-bold text-university-blue mt-4">BAU Center Management</h1>
          <p className="text-gray-600">University performance monitoring system</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Authentication</CardTitle>
            <CardDescription>
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            {authError && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="your.email@bau.edu.tr"
                      value={signInData.email}
                      onChange={(e) => setSignInData(prev => ({ ...prev, email: e.target.value }))}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      value={signInData.password}
                      onChange={(e) => setSignInData(prev => ({ ...prev, password: e.target.value }))}
                      required
                      disabled={loading}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-fullname">Full Name</Label>
                    <Input
                      id="signup-fullname"
                      type="text"
                      placeholder="Your Full Name"
                      value={signUpData.fullName}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, fullName: e.target.value }))}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your.email@bau.edu.tr"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, email: e.target.value }))}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signUpData.password}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, password: e.target.value }))}
                      required
                      minLength={6}
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-role">Role</Label>
                    <Select 
                      value={signUpData.role} 
                      onValueChange={(value: 'evaluator' | 'manager') => setSignUpData(prev => ({ ...prev, role: value }))}
                      disabled={loading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manager">Center Manager</SelectItem>
                        <SelectItem value="evaluator">University Evaluator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>For testing:</strong> If you're having issues with email confirmation, 
                you can disable it in your Supabase project settings under Authentication → Settings.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;
