
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type UserProfile = Database['public']['Tables']['profiles']['Row'];

interface AuthError {
  message: string;
  code?: string;
  details?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  useEffect(() => {
    console.log('useAuth - Initializing authentication system...');
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('useAuth - Auth state change:', { event, hasSession: !!session });
      
      setError(null); // Clear previous errors
      setUser(session?.user ?? null);
      
      if (session?.user) {
        console.log('useAuth - Session found, fetching profile for:', session.user.id);
        await handleUserProfile(session.user);
      } else {
        console.log('useAuth - No session, clearing profile');
        setProfile(null);
        setLoading(false);
      }
    });

    // Then get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('useAuth - Initial session check:', { 
        hasSession: !!session, 
        hasUser: !!session?.user,
        error: error?.message 
      });
      
      if (error) {
        console.error('useAuth - Session error:', error);
        setError({ message: 'Failed to load session', details: error.message });
        setLoading(false);
        return;
      }
      
      setUser(session?.user ?? null);
      if (session?.user) {
        handleUserProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    return () => {
      console.log('useAuth - Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const handleUserProfile = async (user: User) => {
    console.log('useAuth - Handling user profile for:', user.id);
    setLoading(true);
    
    try {
      // First, try to fetch existing profile
      console.log('useAuth - Attempting to fetch profile...');
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      console.log('useAuth - Profile fetch result:', { 
        hasProfile: !!existingProfile, 
        error: fetchError?.message 
      });

      if (fetchError) {
        console.error('useAuth - Error fetching profile:', fetchError);
        throw new Error(`Failed to fetch profile: ${fetchError.message}`);
      }

      if (existingProfile) {
        console.log('useAuth - Profile found:', existingProfile);
        setProfile(existingProfile);
        setLoading(false);
        return;
      }

      // If no profile exists, try to create one manually
      console.log('useAuth - No profile found, attempting to create one');
      await createMissingProfile(user);
      
    } catch (error) {
      console.error('useAuth - Profile handling error:', error);
      setError({ 
        message: 'Failed to load user profile', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      });
      setLoading(false);
    }
  };

  const createMissingProfile = async (user: User) => {
    console.log('useAuth - Creating missing profile for user:', user.id);
    
    try {
      // Use the manual profile creation function as fallback
      console.log('useAuth - Calling create_user_profile function...');
      const { data, error } = await supabase.rpc('create_user_profile', {
        user_id: user.id,
        user_email: user.email || '',
        user_full_name: user.user_metadata?.full_name || 'New User',
        user_role: (user.user_metadata?.role as 'evaluator' | 'manager' | 'faculty_dean' | 'department_head') || 'manager'
      });

      console.log('useAuth - Profile creation result:', { success: data, error: error?.message });

      if (error) {
        console.error('useAuth - Manual profile creation failed:', error);
        throw new Error(`Profile creation failed: ${error.message}`);
      }

      if (!data) {
        throw new Error('Profile creation returned false');
      }

      // Fetch the newly created profile
      console.log('useAuth - Fetching newly created profile...');
      const { data: newProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      console.log('useAuth - New profile fetch result:', { 
        hasProfile: !!newProfile, 
        error: fetchError?.message 
      });

      if (fetchError || !newProfile) {
        console.error('useAuth - Failed to fetch newly created profile:', fetchError);
        throw new Error('Profile was created but could not be retrieved');
      }

      console.log('useAuth - Profile created and retrieved successfully:', newProfile);
      setProfile(newProfile);
      setLoading(false);
      
    } catch (error) {
      console.error('useAuth - Failed to create missing profile:', error);
      setError({ 
        message: 'Failed to create user profile', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      });
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('useAuth - Attempting sign in for:', email);
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      console.log('useAuth - Sign in result:', { 
        success: !error, 
        hasUser: !!data.user,
        error: error?.message 
      });
      
      if (error) {
        throw error;
      }
      
      return { data, error: null };
      
    } catch (error: any) {
      console.error('useAuth - Sign in error:', error);
      const authError: AuthError = {
        message: 'Sign in failed',
        code: error.message?.includes('Invalid login credentials') ? 'invalid_credentials' : 'sign_in_error',
        details: error.message
      };
      setError(authError);
      setLoading(false);
      return { data: null, error: authError };
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: 'evaluator' | 'manager' | 'faculty_dean' | 'department_head' = 'manager') => {
    console.log('useAuth - Attempting sign up for:', email, 'with role:', role);
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role
          }
        }
      });
      
      console.log('useAuth - Sign up result:', { 
        success: !error, 
        hasUser: !!data.user,
        needsConfirmation: !data.session && !error,
        error: error?.message 
      });
      
      if (error) {
        throw error;
      }
      
      return { data, error: null };
      
    } catch (error: any) {
      console.error('useAuth - Sign up error:', error);
      const authError: AuthError = {
        message: 'Sign up failed',
        code: error.message?.includes('User already registered') ? 'user_exists' : 'sign_up_error',
        details: error.message
      };
      setError(authError);
      setLoading(false);
      return { data: null, error: authError };
    }
  };

  const signOut = async () => {
    console.log('useAuth - Signing out...');
    setError(null);
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setUser(null);
      setProfile(null);
      console.log('useAuth - Sign out successful');
      return { error: null };
      
    } catch (error: any) {
      console.error('useAuth - Sign out error:', error);
      const authError: AuthError = {
        message: 'Sign out failed',
        details: error.message
      };
      setError(authError);
      return { error: authError };
    }
  };

  const retryProfileCreation = async () => {
    if (!user) {
      console.log('useAuth - Cannot retry profile creation: no user logged in');
      return;
    }
    
    console.log('useAuth - Retrying profile creation for user:', user.id);
    setError(null);
    await handleUserProfile(user);
  };

  const clearError = () => {
    setError(null);
  };

  const authState = {
    user,
    profile,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    retryProfileCreation,
    clearError,
    isAuthenticated: !!user,
    userRole: profile?.role,
    managedCenterId: profile?.managed_center_id
  };

  console.log('useAuth - Current state:', {
    isAuthenticated: authState.isAuthenticated,
    loading: authState.loading,
    hasProfile: !!authState.profile,
    userRole: authState.userRole,
    hasError: !!authState.error
  });

  return authState;
};
