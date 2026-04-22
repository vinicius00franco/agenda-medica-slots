import { useQuery } from '@tanstack/react-query';
import { Professional } from '@/types/domain';

const API_URL = 'http://localhost:3005';

export function useProfessionals() {
  return useQuery<Professional[]>({
    queryKey: ['professionals'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/professionals`);
      return res.json();
    },
  });
}
