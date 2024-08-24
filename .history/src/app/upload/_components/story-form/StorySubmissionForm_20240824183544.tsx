'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { nanoid } from 'nanoid';

import { Button, Form, Typography } from '@zougui/react.ui';

import { api } from '~/trpc/react';

import { type SeriesData, SeriesTable } from './SeriesTable';

const formSchema = z.object({
  name: z.string().min(1),
  commonKeywords: z.array(z.string().min(1)),
});

export const StorySubmissionForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      commonKeywords: [],
    },
  });

  const [series, setSeries] = useState<SeriesData[]>([]);

  const [keywords] = api.post.findAllKeywords.useSuspenseQuery();
  const utils = api.useUtils();

  const creationMutation = api.postQueue.create.useMutation({
    onSuccess: async () => {
      await utils.postQueue.invalidate();
      await utils.post.invalidate();
    },
  });

  const handleSubmit = form.handleSubmit(data => {
    const now = Date.now();
    const seriesId = nanoid();

    creationMutation.mutate(series.map((submission, index) => ({
      ...submission,
      createdAt: new Date(now + (index * 1000)),
      series: {
        ...submission.series,
        name: data.name,
        id: seriesId,
      },
    })));

    form.reset();
    setSeries([]);
  });

  return (
    <Form.Root {...form}>
      <div className="space-y-8">
        <form className="w-1/2 flex flex-col gap-6">
          <Form.Input
            control={form.control}
            name="name"
            label="Series name"
          />

          <Form.Autocomplete.Root
            control={form.control}
            name="commonKeywords"
            label="Common keywords"
            multiple
            creatable
          >
            {keywords.map(keyword => (
              <Form.Autocomplete.Item key={keyword} value={keyword}>
                {keyword}
              </Form.Autocomplete.Item>
            ))}
          </Form.Autocomplete.Root>
        </form>

        <div>
          <Typography.H4 className="text-center">Chapters</Typography.H4>

          <SeriesTable
            series={series}
            onSeriesChange={setSeries}
            defaultValues={{
              keywords: form.watch('commonKeywords'),
              series: {
                chapterIndex: series.length + 1,
              },
            }}
          />
        </div>


        {creationMutation.error && (
          <Typography.Paragraph className="text-destructive">{creationMutation.error.message}</Typography.Paragraph>
        )}

        {creationMutation.isPending && (
          <Typography.Paragraph>Uploading...</Typography.Paragraph>
        )}
        <div className="h-auto flex justify-end gap-6">
          <Button
            onClick={handleSubmit}
            type="submit"
            disabled={creationMutation.isPending}
          >
            Upload
          </Button>

          <Button variant="secondary" disabled={creationMutation.isPending}>
            Cancel
          </Button>
        </div>
      </div>
    </Form.Root>
  );
}
