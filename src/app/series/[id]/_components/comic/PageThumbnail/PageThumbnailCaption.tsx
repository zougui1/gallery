import { cn } from '@zougui/react.ui';

export const PageThumbnailCaption = ({ className, ...rest }: PageThumbnailCaptionProps) => {
  return (
    <div
      {...rest}
      className={cn('flex', className)}
    />
  );
}

export interface PageThumbnailCaptionProps extends React.HTMLAttributes<HTMLDivElement> {

}
