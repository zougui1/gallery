import Image from 'next/image';

import { AppLink } from '~/app/_components/atoms/AppLink';

export const PostAvatar = ({ src, href }: PostAvatarProps) => {
  return (
    <AppLink.External href={href}>
      <Image
        src={src}
        alt="Avatar"
        className="w-[70px] h-[70px]"
        width={70}
        height={70}
        unoptimized
      />
    </AppLink.External>
  );
}

export interface PostAvatarProps {
  href: string;
  src: string;
}
