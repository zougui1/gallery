import { useRef, useEffect } from 'react';
import { type FieldValues, type UseFormReturn, type DeepPartial } from 'react-hook-form';

export const useWatchForm = <T extends FieldValues>(
  watch: UseFormReturn<T>['watch'],
  listener: (data: DeepPartial<T>) => void,
): void => {
  const listenerRef = useRef(listener);
  listenerRef.current = listener;

  useEffect(() => {
    const subscription = watch(data => {
      listenerRef.current(data);
    });

    return () => {
      subscription.unsubscribe
    }
  }, [watch]);
}
