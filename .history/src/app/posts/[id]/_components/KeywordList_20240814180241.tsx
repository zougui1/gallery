'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';

import { IconButton, Typography } from '@zougui/react.ui';

import { AppLink } from '~/app/_components/atoms/AppLink';

export const KeywordList = ({ keywords }: KeywordListProps) => {
  const [clientKeywords, setClientKeywords] = useState([]);
  const [showInput, setShowInput] = useState(false);

  return (
    <div className="w-full flex flex-col">
      <Typography.H5 className="w-full flex justify-between items-center">
        <span>Keywords</span>

        <IconButton onClick={() => setShowInput(true)}>
          <Plus className="w-4 h-4" />
        </IconButton>
      </Typography.H5>

      <ul className="w-full">
        {keywords.slice().sort().map(keyword => (
          <li key={keyword} className="flex justify-between">
            <div>
              <AppLink.Internal href={`/search?keywords=${keyword}`}>
                {keyword}
              </AppLink.Internal>
            </div>

            <div>
              <IconButton size="sm">
                <X className="w-4 h-4 text-destructive" />
              </IconButton>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export interface KeywordListProps {
  keywords: string[];
}
