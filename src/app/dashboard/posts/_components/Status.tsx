import { cn } from '@zougui/react.ui';

import { type PostQueueStatus, postQueueStatusLabelMap } from '~/enums';

const colors: Partial<Record<typeof status, string>> = {
  complete: 'text-green-500',
  error: 'text-red-500',
};

export const Status = ({ status, className,...rest }: StatusProps) => {
  return (
    <span {...rest} className={cn(colors[status], className)}>
      {postQueueStatusLabelMap[status]}
    </span>
  );
}

export interface StatusProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: PostQueueStatus;
}
