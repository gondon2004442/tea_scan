import { useEffect, useMemo, useState } from 'react';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening';

function resolveTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 5 && hour <= 11) return 'morning';
  if (hour >= 12 && hour <= 16) return 'afternoon';
  return 'evening';
}

export function useTimeOfDay() {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(() =>
    resolveTimeOfDay(new Date().getHours()),
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeOfDay(resolveTimeOfDay(new Date().getHours()));
    }, 1000 * 60 * 15);

    return () => clearInterval(intervalId);
  }, []);

  return useMemo(() => ({ timeOfDay }), [timeOfDay]);
}
