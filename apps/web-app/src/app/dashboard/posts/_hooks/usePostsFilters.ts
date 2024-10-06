import { useQueryStates } from 'nuqs';
import { z } from 'zod';

import { postQueueStatusValues } from '~/enums';

export const usePostsFilters = () => {
  return useQueryStates({
    status: {
      parse: (query: string) => z.enum(postQueueStatusValues).parse(query),
      serialize: String,
    },
  });
}
