import { useQuery } from '@tanstack/react-query';
import { searchUsers } from '../../api/user.api';

export const useUserSearch = (searchTerm) => {
  return useQuery({
    queryKey: ["userSearch", searchTerm],

    queryFn: () => searchUsers(searchTerm),

    enabled: !!searchTerm,
  });
};