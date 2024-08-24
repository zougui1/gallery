'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button, Form } from '@zougui/react.ui';

import { fileUploadSchema, furaffinityUrlUploadSchema, unknownUrlUploadSchema } from '~/schemas/upload';

const formSchema = z.union([
  fileUploadSchema.omit({ createdAt: true }),
  furaffinityUrlUploadSchema.omit({ createdAt: true }),
  unknownUrlUploadSchema.omit({ createdAt: true }),
]);

export const UploadForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      keywords: [],
      title: '',
      url: '',
    },
  });

  return (
    <Form.Root {...form}>
      <form className="w-1/2 flex flex-col gap-6">
        <Form.Input
          control={form.control}
          name="url"
          label="URL"
        />

        <Form.Autocomplete.Root
          control={form.control}
          name="keywords"
          label="Keywords"
          multiple
          creatable
        >

        </Form.Autocomplete.Root>

        <Form.Input
          control={form.control}
          name="title"
          label="Title"
        />

        <Form.Textarea
          control={form.control}
          name="description"
          label="Description"
        />

        <div className="divide-x-8">
          <Button>
            Upload
          </Button>

          <Button variant="secondary">
            Cancel
          </Button>
        </div>
      </form>
    </Form.Root>
  );
}
