
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';
import { Child } from '@/types/child';

export const useChildren = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchChildren();
    }
  }, [user]);

  const fetchChildren = async () => {
    try {
      const { data, error } = await supabase
        .from('children')
        .select('id, name, class, parent_id')
        .eq('parent_id', user?.id);

      if (error) throw error;
      setChildren(data || []);
    } catch (error) {
      console.error('Error fetching children:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data anak",
        variant: "destructive",
      });
    }
  };

  return { children };
};
