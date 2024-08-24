'use client';

import { useState } from 'react';
import { CircleAlert, Loader, Plus, X } from 'lucide-react';

import { Autocomplete, IconButton, Typography } from '@zougui/react.ui';

import { AppLink } from '~/app/_components/atoms/AppLink';
import { api } from '~/trpc/react';
import { KeywordAutocomplete } from './KeywordAutocomplete';
import { PostSchemaWithId } from '~/server/database';

enum Status {
  loading = 'loading',
  success = 'success',
  error = 'error',
}

export const KeywordList = ({ post }: KeywordListProps) => {
  const [clientKeywords, setClientKeywords] = useState<string[]>([]);
  const [tempKeywords, setTempKeywords] = useState<string[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [keywordsStatus, setKeywordsStatus] = useState<Record<string, Status>>({});

  const changeKeywordStatus = (keyword: string, status: Status): void => {
    setKeywordsStatus(prevKeywordsStatus => {
      return {
        ...prevKeywordsStatus,
        [keyword]: status,
      };
    });
  }

  const addKeywordMutation = api.post.addKeyword.useMutation();

  const addKeyword = async (keyword: string): Promise<void> => {
    setClientKeywords(prevClientKeywords => [...prevClientKeywords, keyword]);
    changeKeywordStatus(keyword, Status.loading);

    try {
      await addKeywordMutation.mutateAsync({ id: post._id, keyword });
      changeKeywordStatus(keyword, Status.success);
    } catch (error) {
      changeKeywordStatus(keyword, Status.error);
    }
  }

  return (
    <div className="w-full flex flex-col">
      <Typography.H5 className="w-full flex justify-between items-center">
        <span>Keywords</span>

        <IconButton onClick={() => setShowInput(true)}>
          <Plus className="w-4 h-4" />
        </IconButton>
      </Typography.H5>

      {showInput && (
        <KeywordAutocomplete
          values={tempKeywords}
          onValuesChange={([newKeyword]) => addKeyword(String(newKeyword))}
          creatable
          excludedKeywords={post.keywords}
        />
      )}

      <ul className="w-full">
        {clientKeywords.map(keyword => (
          <li key={keyword} className="flex justify-between">
            <div>
              {keyword}
            </div>

            <div>
              {keywordsStatus[keyword] === Status.loading && <Loader className="w-4 h-4" />}
              {keywordsStatus[keyword] === Status.error && <CircleAlert className="w-4 h-4" />}
            </div>
          </li>
        ))}

        {post.keywords.slice().sort().map(keyword => (
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
  post: PostSchemaWithId;
}
