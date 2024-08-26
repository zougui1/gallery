import { useEffect, useRef } from 'react'

export const useWindowEvent = <T extends keyof WindowEventMap>(type: T, listener: (event: WindowEventMap[T]) => void): void => {
  const listenerRef = useRef(listener);
  listenerRef.current = listener;

  useEffect(() => {
    const callback = (event: WindowEventMap[T]): void => {
      listenerRef.current(event);
    }

    window.addEventListener(type, callback);

    return () => {
      window.removeEventListener(type, callback);
    }
  }, [type]);
}
