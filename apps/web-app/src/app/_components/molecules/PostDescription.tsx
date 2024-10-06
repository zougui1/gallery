import LinkParser from 'react-link-parser';

import { AppLink } from '~/app/_components/atoms/AppLink';

export const PostDescription = ({ text }: PostDescriptionProps) => {
  return (
    <LinkParser
      watchers={[
        {
          watchFor: "link",
          render: (url) => (
            <AppLink.External href={url}>
              {url}
            </AppLink.External>
          ),
        },
      ]}
    >
      {text}
    </LinkParser>
  );
}

export interface PostDescriptionProps {
  text?: string;
}
