import { useEffect, useRef } from 'react'

export const useDocumentEvent = <T extends keyof DocumentEventMap>(type: T, listener: (event: DocumentEventMap[T]) => void): void => {
  const listenerRef = useRef(listener);
  listenerRef.current = listener;

  useEffect(() => {
    const callback = (event: DocumentEventMap[T]): void => {
      listenerRef.current(event);
    }

    document.addEventListener(type, callback);

    return () => {
      document.removeEventListener(type, callback);
    }
  }, [type]);
}
