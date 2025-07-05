
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useUserRole = () => {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchUserRole();
    } else {
      setRole(null);
      setLoading(false);
    }
  }, [user]);

  const fetchUserRole = async () => {
    try {
      console.log('Fetching user role for:', user?.id);
      
      // First try to get from user_roles table
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user?.id)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        
        // If user is admin@admin.com, set as admin by default
        if (user?.email === 'admin@admin.com') {
          console.log('Setting admin role for admin@admin.com');
          setRole('admin');
        } else {
          setRole('parent'); // Default to parent if error
        }
      } else {
        console.log('User role fetched successfully:', data?.role);
        setRole(data?.role || 'parent');
      }
    } catch (error) {
      console.error('Exception while fetching user role:', error);
      
      // Fallback: check email for admin
      if (user?.email === 'admin@admin.com') {
        setRole('admin');
      } else {
        setRole('parent');
      }
    } finally {
      setLoading(false);
    }
  };

  return { role, loading, isAdmin: role === 'admin' };
};
