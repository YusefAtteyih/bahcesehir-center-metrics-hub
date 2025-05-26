
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
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

const LoginForm: React.FC = () => {
  const { signIn, signUp, loading, error, clearError } = useAuth();
  const [localError, setLocalError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });

  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'manager' as 'evaluator' | 'manager'
  });

  const validateSignInForm = () => {
    const errors: Record<string, string> = {};
    
    if (!signInData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(signInData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!signInData.password) {
      errors.password = 'Password is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateSignUpForm = () => {
    const errors: Record<string, string> = {};
    
    if (!signUpData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    } else if (signUpData.fullName.trim().length < 2) {
      errors.fullName = 'Full name must be at least 2 characters';
    }
    
    if (!signUpData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(signUpData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!signUpData.password) {
      errors.password = 'Password is required';
    } else if (signUpData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (signUpData.password !== signUpData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('LoginForm - Sign in attempt for:', signInData.email);
    
    setLocalError(null);
    clearError();
    
    if (!validateSignInForm()) {
      return;
    }

    const { error } = await signIn(signInData.email, signInData.password);

    if (error) {
      console.error('LoginForm - Sign in error:', error);
      
      let errorMessage = 'Sign in failed. Please try again.';
      
      switch (error.code) {
        case 'invalid_credentials':
          errorMessage = 'Invalid email or password. Please check your credentials.';
          break;
        case 'email_not_confirmed':
          errorMessage = 'Please check your email and confirm your account before signing in.';
          break;
        case 'too_many_requests':
          errorMessage = 'Too many sign in attempts. Please wait a moment and try again.';
          break;
        default:
          errorMessage = error.details || errorMessage;
      }
      
      setLocalError(errorMessage);
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
    
    setLocalError(null);
    clearError();
    
    if (!validateSignUpForm()) {
      return;
    }

    const { error, data } = await signUp(
      signUpData.email, 
      signUpData.password, 
      signUpData.fullName, 
      signUpData.role
    );

    if (error) {
      console.error('LoginForm - Sign up error:', error);
      
      let errorMessage = 'Sign up failed. Please try again.';
      
      switch (error.code) {
        case 'user_exists':
          errorMessage = 'An account with this email already exists. Please sign in instead.';
          break;
        case 'weak_password':
          errorMessage = 'Password is too weak. Please choose a stronger password.';
          break;
        case 'invalid_email':
          errorMessage = 'Please enter a valid email address.';
          break;
        default:
          errorMessage = error.details || errorMessage;
      }
      
      setLocalError(errorMessage);
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
      
      // Clear form on successful signup
      setSignUpData({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        role: 'manager'
      });
    }
  };

  const currentError = error || localError;

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
            {currentError && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{currentError}</AlertDescription>
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
                      onChange={(e) => {
                        setSignInData(prev => ({ ...prev, email: e.target.value }));
                        if (validationErrors.email) {
                          setValidationErrors(prev => ({ ...prev, email: '' }));
                        }
                      }}
                      disabled={loading}
                      className={validationErrors.email ? 'border-red-500' : ''}
                    />
                    {validationErrors.email && (
                      <p className="text-sm text-red-500">{validationErrors.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      value={signInData.password}
                      onChange={(e) => {
                        setSignInData(prev => ({ ...prev, password: e.target.value }));
                        if (validationErrors.password) {
                          setValidationErrors(prev => ({ ...prev, password: '' }));
                        }
                      }}
                      disabled={loading}
                      className={validationErrors.password ? 'border-red-500' : ''}
                    />
                    {validationErrors.password && (
                      <p className="text-sm text-red-500">{validationErrors.password}</p>
                    )}
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
                      onChange={(e) => {
                        setSignUpData(prev => ({ ...prev, fullName: e.target.value }));
                        if (validationErrors.fullName) {
                          setValidationErrors(prev => ({ ...prev, fullName: '' }));
                        }
                      }}
                      disabled={loading}
                      className={validationErrors.fullName ? 'border-red-500' : ''}
                    />
                    {validationErrors.fullName && (
                      <p className="text-sm text-red-500">{validationErrors.fullName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your.email@bau.edu.tr"
                      value={signUpData.email}
                      onChange={(e) => {
                        setSignUpData(prev => ({ ...prev, email: e.target.value }));
                        if (validationErrors.email) {
                          setValidationErrors(prev => ({ ...prev, email: '' }));
                        }
                      }}
                      disabled={loading}
                      className={validationErrors.email ? 'border-red-500' : ''}
                    />
                    {validationErrors.email && (
                      <p className="text-sm text-red-500">{validationErrors.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="At least 6 characters"
                      value={signUpData.password}
                      onChange={(e) => {
                        setSignUpData(prev => ({ ...prev, password: e.target.value }));
                        if (validationErrors.password) {
                          setValidationErrors(prev => ({ ...prev, password: '' }));
                        }
                      }}
                      disabled={loading}
                      className={validationErrors.password ? 'border-red-500' : ''}
                    />
                    {validationErrors.password && (
                      <p className="text-sm text-red-500">{validationErrors.password}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                    <Input
                      id="signup-confirm-password"
                      type="password"
                      placeholder="Confirm your password"
                      value={signUpData.confirmPassword}
                      onChange={(e) => {
                        setSignUpData(prev => ({ ...prev, confirmPassword: e.target.value }));
                        if (validationErrors.confirmPassword) {
                          setValidationErrors(prev => ({ ...prev, confirmPassword: '' }));
                        }
                      }}
                      disabled={loading}
                      className={validationErrors.confirmPassword ? 'border-red-500' : ''}
                    />
                    {validationErrors.confirmPassword && (
                      <p className="text-sm text-red-500">{validationErrors.confirmPassword}</p>
                    )}
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
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">For testing:</p>
                  <p>Email confirmation can be disabled in your Supabase project settings under Authentication → Settings to speed up testing.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;
