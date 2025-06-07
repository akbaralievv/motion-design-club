'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { setUser, clearUser, setAuthLoading } from '@/lib/store/slices/authSlice';
import { authService } from '@/lib/services/auth.service';
import { useToast } from '@/hooks/use-toast';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      dispatch(setAuthLoading(true));

      try {
        const user = await authService.getCurrentUser();

        if (user) {
          dispatch(setUser(user));
        } else {
          dispatch(clearUser());
        }

      } catch (error) {
        console.error('Auth check error:', error);
        dispatch(clearUser());

        toast({
          title: 'Authentication Error',
          description: 'There was a problem checking your authentication status.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
        dispatch(setAuthLoading(false));
      }
    };

    checkAuth();
  }, [dispatch, toast]);

  if (isLoading) {
    // You can return a loader here if needed
    return null;
  }

  return <>{children}</>;
}
