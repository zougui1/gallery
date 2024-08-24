'use client';

import { useState, useEffect } from 'react';

import { getDurationString } from '~/app/_utils';

const formatRelativeTime = (date: Date): string => {
  const relativeTime = date.getTime() - Date.now();

  if (relativeTime === 0) {
    return 'now';
  }

  const formattedRelativeTime = getDurationString(Math.abs(relativeTime));

  // the formatted relative time could be "0 milliseconds" due
  // to the milliseconds and seconds being removed from the formatted string
  if (formattedRelativeTime === getDurationString(0)) {
    return 'now';
  }

  return relativeTime < 0
    ? `${formattedRelativeTime} ago`
    : `in ${formattedRelativeTime}`;
}

export const RelativeDate = ({ date }: RelativeDateProps) => {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate({});
    }, 1000);

    return () => {
      clearInterval(interval);
    }
  }, []);

  return formatRelativeTime(date);
}

export interface RelativeDateProps {
  date: Date;
}
