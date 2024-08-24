'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Form } from '@zougui/react.ui';

import { fileUploadSchema, furaffinityUrlUploadSchema, unknownUrlUploadSchema } from '~/schemas/upload';

const furaffinityUrlSchema = z.union([
  fileUploadSchema,
  furaffinityUrlUploadSchema,
  unknownUrlUploadSchema,
]);

export const UploadTabs = () => {
  return (
    <Form.Root>

    </Form.Root>
  );
}
