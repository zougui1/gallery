'use client';

import { Slot } from '@zougui/react.ui';


export const ImageIcon = ({ children }: ImageIconProps) => {

  return (
    <Slot className="w-5 h-5 bg-black/30 rounded-md drop-shadow-md shadow-md cursor-default">
      {children}
    </Slot>
  )
}

export interface ImageIconProps {
  children?: React.ReactNode;
}
