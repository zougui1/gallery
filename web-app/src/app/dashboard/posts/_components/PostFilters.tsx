'use client';

import { z } from 'zod';

import { Form } from '@zougui/react.ui';

import { postQueueStatusLabelMap, postQueueStatusValues } from '~/enums';
import { useAppForm, useWatchForm } from '~/app/_hooks';

import { usePostsFilters } from '../_hooks';

const schema = z.object({
  status: z.array(z.enum(postQueueStatusValues)),
});

export const PostFilers = () => {
  const [filters, setFilters] = usePostsFilters();

  const form = useAppForm({
    schema,
    defaultValues: {
      status: filters.status ? [filters.status] : [],
    },
  });

  const handleChange = form.handleSubmit(data => {
    setFilters({
      ...data,
      status: data.status[0] ?? null,
    }).catch(() => null);
  });

  useWatchForm(form.watch, () => {
    handleChange().catch(() => null);
  });

  return (
    <div className="flex flex-col min-w-64">
      <Form.Root {...form}>
        <form onChange={() => console.log('change')}>
          <Form.Autocomplete.Root
            control={form.control}
            name="status"
            label="Status"
          >
            {postQueueStatusValues.map(status => (
              <Form.Autocomplete.Item key={status} value={status}>
                {postQueueStatusLabelMap[status]}
              </Form.Autocomplete.Item>
            ))}
          </Form.Autocomplete.Root>
        </form>
      </Form.Root>
    </div>
  );
}
