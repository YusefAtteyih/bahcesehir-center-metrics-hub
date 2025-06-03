
import { useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/supabase';
import { safeParseProfile } from '@/lib/guards';

interface AuthError {
  message: string;
  code?: string;
  details?: string;
}

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  error: AuthError | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    console.log('useAuth - Initializing authentication system...');
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('useAuth - Auth state change:', { event, hasSession: !!session });
      
      // Batch all state updates together to prevent race conditions
      setAuthState(prev => ({
        ...prev,
        error: null, // Clear previous errors
        user: session?.user ?? null,
        session,
        loading: !!session?.user, // Keep loading true if we have user but need profile
      }));
      
      // Handle profile fetching after state update
      if (session?.user) {
        console.log('useAuth - Session found, fetching profile for:', session.user.id);
        // Use setTimeout to defer profile fetching and prevent callback recursion
        setTimeout(() => {
          handleUserProfile(session.user);
        }, 0);
      } else {
        console.log('useAuth - No session, clearing profile');
        setAuthState(prev => ({
          ...prev,
          profile: null,
          loading: false,
        }));
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
        setAuthState(prev => ({
          ...prev,
          error: { message: 'Failed to load session', details: error.message },
          loading: false,
        }));
        return;
      }
      
      setAuthState(prev => ({
        ...prev,
        user: session?.user ?? null,
        session,
        loading: !!session?.user,
      }));
      
      if (session?.user) {
        setTimeout(() => {
          handleUserProfile(session.user);
        }, 0);
      } else {
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    });

    return () => {
      console.log('useAuth - Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const handleUserProfile = async (user: User) => {
    console.log('useAuth - Handling user profile for:', user.id);
    
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
        
        // Validate profile data
        const profileValidation = safeParseProfile(existingProfile);
        if (!profileValidation.success) {
          console.warn('useAuth - Profile validation failed:', profileValidation.error);
          // Still use the profile but log the validation error
        }
        
        setAuthState(prev => ({
          ...prev,
          profile: existingProfile,
          loading: false,
        }));
        return;
      }

      // If no profile exists, try to create one manually
      console.log('useAuth - No profile found, attempting to create one');
      await createMissingProfile(user);
      
    } catch (error) {
      console.error('useAuth - Profile handling error:', error);
      setAuthState(prev => ({
        ...prev,
        error: { 
          message: 'Failed to load user profile', 
          details: error instanceof Error ? error.message : 'Unknown error' 
        },
        loading: false,
      }));
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
      
      // Validate new profile
      const profileValidation = safeParseProfile(newProfile);
      if (!profileValidation.success) {
        console.warn('useAuth - New profile validation failed:', profileValidation.error);
      }
      
      setAuthState(prev => ({
        ...prev,
        profile: newProfile,
        loading: false,
      }));
      
    } catch (error) {
      console.error('useAuth - Failed to create missing profile:', error);
      setAuthState(prev => ({
        ...prev,
        error: { 
          message: 'Failed to create user profile', 
          details: error instanceof Error ? error.message : 'Unknown error' 
        },
        loading: false,
      }));
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('useAuth - Attempting sign in for:', email);
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
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
      setAuthState(prev => ({ ...prev, error: authError, loading: false }));
      return { data: null, error: authError };
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: 'evaluator' | 'manager' | 'faculty_dean' | 'department_head' = 'manager') => {
    console.log('useAuth - Attempting sign up for:', email, 'with role:', role);
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
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
      setAuthState(prev => ({ ...prev, error: authError, loading: false }));
      return { data: null, error: authError };
    }
  };

  const signOut = async () => {
    console.log('useAuth - Signing out...');
    setAuthState(prev => ({ ...prev, error: null }));
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setAuthState({
        user: null,
        profile: null,
        session: null,
        loading: false,
        error: null,
      });
      console.log('useAuth - Sign out successful');
      return { error: null };
      
    } catch (error: any) {
      console.error('useAuth - Sign out error:', error);
      const authError: AuthError = {
        message: 'Sign out failed',
        details: error.message
      };
      setAuthState(prev => ({ ...prev, error: authError }));
      return { error: authError };
    }
  };

  const retryProfileCreation = async () => {
    if (!authState.user) {
      console.log('useAuth - Cannot retry profile creation: no user logged in');
      return;
    }
    
    console.log('useAuth - Retrying profile creation for user:', authState.user.id);
    setAuthState(prev => ({ ...prev, error: null }));
    await handleUserProfile(authState.user);
  };

  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  const returnState = {
    user: authState.user,
    profile: authState.profile,
    session: authState.session,
    loading: authState.loading,
    error: authState.error,
    signIn,
    signUp,
    signOut,
    retryProfileCreation,
    clearError,
    isAuthenticated: !!authState.user,
    userRole: authState.profile?.role,
    managedCenterId: authState.profile?.managed_center_id
  };

  console.log('useAuth - Current state:', {
    isAuthenticated: returnState.isAuthenticated,
    loading: returnState.loading,
    hasProfile: !!returnState.profile,
    userRole: returnState.userRole,
    hasError: !!returnState.error
  });

  return returnState;
};
