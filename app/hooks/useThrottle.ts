import { useCallback, useRef } from 'react';

export function useThrottle<T extends (...args: any[]) => any>(callback: T, delay: number): T {
    const lastRun = useRef(Date.now());
    const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

    return useCallback(
        (...args: Parameters<T>) => {
            const now = Date.now();
            const timeSinceLastRun = now - lastRun.current;

            if (timeSinceLastRun >= delay) {
                callback(...args);
                lastRun.current = now;
            } else {
                // 마지막 호출 보장
                clearTimeout(timeoutRef.current);
                timeoutRef.current = setTimeout(() => {
                    callback(...args);
                    lastRun.current = Date.now();
                }, delay - timeSinceLastRun);
            }
        },
        [callback, delay]
    ) as T;
}
