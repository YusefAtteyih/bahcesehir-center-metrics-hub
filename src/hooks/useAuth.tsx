
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type UserProfile = Database['public']['Tables']['profiles']['Row'];

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('useAuth - Initializing authentication...');
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('useAuth - Initial session check:', { 
        hasSession: !!session, 
        hasUser: !!session?.user,
        error: error?.message 
      });
      
      setUser(session?.user ?? null);
      if (session?.user) {
        console.log('useAuth - User found, fetching profile for:', session.user.id);
        fetchProfile(session.user.id);
      } else {
        console.log('useAuth - No session found, setting loading to false');
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('useAuth - Auth state change:', { event, hasSession: !!session });
      
      setUser(session?.user ?? null);
      if (session?.user) {
        console.log('useAuth - New session, fetching profile for:', session.user.id);
        await fetchProfile(session.user.id);
      } else {
        console.log('useAuth - Session ended, clearing profile');
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      console.log('useAuth - Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    console.log('useAuth - Fetching profile for user:', userId);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('useAuth - Error fetching profile:', error);
        if (error.code === 'PGRST116') {
          console.log('useAuth - Profile not found, this might be a new user');
        }
      } else {
        console.log('useAuth - Profile fetched successfully:', data);
        setProfile(data);
      }
    } catch (error) {
      console.error('useAuth - Exception while fetching profile:', error);
    } finally {
      console.log('useAuth - Setting loading to false');
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('useAuth - Attempting sign in for:', email);
    setLoading(true);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    console.log('useAuth - Sign in result:', { 
      success: !error, 
      hasUser: !!data.user,
      error: error?.message 
    });
    
    setLoading(false);
    return { data, error };
  };

  const signUp = async (email: string, password: string, fullName: string, role: 'evaluator' | 'manager' = 'manager') => {
    console.log('useAuth - Attempting sign up for:', email, 'with role:', role);
    setLoading(true);
    
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
    
    setLoading(false);
    return { data, error };
  };

  const signOut = async () => {
    console.log('useAuth - Signing out...');
    const { error } = await supabase.auth.signOut();
    
    if (!error) {
      setUser(null);
      setProfile(null);
      console.log('useAuth - Sign out successful');
    } else {
      console.error('useAuth - Sign out error:', error);
    }
    
    return { error };
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      console.log('useAuth - Cannot update profile: no user logged in');
      return { error: 'No user logged in' };
    }

    console.log('useAuth - Updating profile for user:', user.id);
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (!error && data) {
      console.log('useAuth - Profile updated successfully:', data);
      setProfile(data);
    } else {
      console.error('useAuth - Profile update error:', error);
    }

    return { data, error };
  };

  const authState = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    isAuthenticated: !!user,
    userRole: profile?.role,
    managedCenterId: profile?.managed_center_id
  };

  console.log('useAuth - Current state:', {
    isAuthenticated: authState.isAuthenticated,
    loading: authState.loading,
    hasProfile: !!authState.profile,
    userRole: authState.userRole
  });

  return authState;
};
