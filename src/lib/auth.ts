import { supabase } from './supabase'

export interface AuthError {
  message: string
  status?: number
}

export interface UserProfile {
  id: string
  email: string
  name?: string
  phone?: string
  business_name?: string
  avatar_url?: string
}

// Helper to check if Supabase is available
const ensureSupabase = () => {
  if (!supabase) {
    throw new Error('Supabase client not initialized')
  }
  return supabase
}

// Google OAuth Sign In
export const signInWithGoogle = async (): Promise<{ user: UserProfile | null; error: AuthError | null }> => {
  try {
    const client = ensureSupabase()
    const { data, error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    if (error) {
      return { user: null, error: { message: error.message } }
    }

    return { user: null, error: null }
  } catch (error) {
    return { 
      user: null, 
      error: { message: 'An unexpected error occurred during Google sign in' } 
    }
  }
}

// Apple OAuth Sign In
export const signInWithApple = async (): Promise<{ user: UserProfile | null; error: AuthError | null }> => {
  try {
    const client = ensureSupabase()
    const { data, error } = await client.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      return { user: null, error: { message: error.message } }
    }

    return { user: null, error: null }
  } catch (error) {
    return { 
      user: null, 
      error: { message: 'An unexpected error occurred during Apple sign in' } 
    }
  }
}

// Email/Password Sign Up
export const signUpWithEmail = async (
  email: string, 
  password: string, 
  userData: {
    business_name: string
    owner_name: string
    phone: string
  }
): Promise<{ user: UserProfile | null; error: AuthError | null }> => {
  try {
    const client = ensureSupabase()
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: {
          business_name: userData.business_name,
          owner_name: userData.owner_name,
          phone: userData.phone,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      return { user: null, error: { message: error.message } }
    }

    if (data.user) {
      return {
        user: {
          id: data.user.id,
          email: data.user.email!,
          name: userData.owner_name,
          phone: userData.phone,
          business_name: userData.business_name,
          avatar_url: data.user.user_metadata?.avatar_url,
        },
        error: null,
      }
    }

    return { user: null, error: null }
  } catch (error) {
    return { 
      user: null, 
      error: { message: 'An unexpected error occurred during sign up' } 
    }
  }
}

// Email/Password Sign In
export const signInWithEmail = async (
  email: string, 
  password: string
): Promise<{ user: UserProfile | null; error: AuthError | null }> => {
  try {
    const client = ensureSupabase()
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { user: null, error: { message: error.message } }
    }

    if (data.user) {
      return {
        user: {
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata?.owner_name || data.user.user_metadata?.name,
          phone: data.user.user_metadata?.phone,
          business_name: data.user.user_metadata?.business_name,
          avatar_url: data.user.user_metadata?.avatar_url,
        },
        error: null,
      }
    }

    return { user: null, error: null }
  } catch (error) {
    return { 
      user: null, 
      error: { message: 'An unexpected error occurred during sign in' } 
    }
  }
}

// Sign Out
export const signOut = async (): Promise<{ error: AuthError | null }> => {
  try {
    const client = ensureSupabase()
    const { error } = await client.auth.signOut()
    
    if (error) {
      return { error: { message: error.message } }
    }

    return { error: null }
  } catch (error) {
    return { error: { message: 'An unexpected error occurred during sign out' } }
  }
}

// Get Current User
export const getCurrentUser = async (): Promise<{ user: UserProfile | null; error: AuthError | null }> => {
  try {
    const client = ensureSupabase()
    const { data: { user }, error } = await client.auth.getUser()
    
    if (error) {
      return { user: null, error: { message: error.message } }
    }

    if (user) {
      return {
        user: {
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.owner_name || user.user_metadata?.name,
          phone: user.user_metadata?.phone,
          business_name: user.user_metadata?.business_name,
          avatar_url: user.user_metadata?.avatar_url,
        },
        error: null,
      }
    }

    return { user: null, error: null }
  } catch (error) {
    return { 
      user: null, 
      error: { message: 'An unexpected error occurred while getting user' } 
    }
  }
}

// Listen to auth state changes
export const onAuthStateChange = (callback: (user: UserProfile | null) => void) => {
  if (!supabase) return { data: { subscription: null }, error: null }
  return supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      const user: UserProfile = {
        id: session.user.id,
        email: session.user.email!,
        name: session.user.user_metadata?.owner_name || session.user.user_metadata?.name,
        phone: session.user.user_metadata?.phone,
        business_name: session.user.user_metadata?.business_name,
        avatar_url: session.user.user_metadata?.avatar_url,
      }
      callback(user)
    } else if (event === 'SIGNED_OUT') {
      callback(null)
    }
  })
}

// Server-side auth helper for API routes
export const auth = async () => {
  const { createServerClient } = await import('./supabase')
  const supabaseServer = createServerClient()
  
  try {
    const { data: { user }, error } = await supabaseServer.auth.getUser()
    
    if (error || !user) {
      return null
    }
    
    return {
      user: {
        id: user.id,
        email: user.email!,
        name: user.user_metadata?.owner_name || user.user_metadata?.name,
        phone: user.user_metadata?.phone,
        business_name: user.user_metadata?.business_name,
        avatar_url: user.user_metadata?.avatar_url,
      }
    }
  } catch (error) {
    console.error('Auth error:', error)
    return null
  }
}
