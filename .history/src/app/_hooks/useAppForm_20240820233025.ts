import { useEffect } from 'react';

import { useForm, type UseFormProps, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type z } from 'zod';

export const useAppForm = <
  TSchema extends z.ZodObject<z.ZodRawShape>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TContext = any,
  TTransformedValues extends z.infer<TSchema> | undefined = undefined
>(options: UseAppFormOptions<TSchema, TContext>): UseFormReturn<z.infer<TSchema>, TContext, TTransformedValues> => {
  const form = useForm<z.infer<TSchema>, TContext, TTransformedValues>({
    ...options,
    resolver: zodResolver(options.schema),
  });

  useEffect(() => {
    console.log('form errors:', form.formState.errors);
  }, [form.formState.errors]);

  return form;
}

export interface UseAppFormOptions<
  TSchema extends z.ZodObject<z.ZodRawShape>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TContext = any
> extends Omit<UseFormProps<z.infer<TSchema>, TContext>, 'resolver'> {
  schema: TSchema;
}
