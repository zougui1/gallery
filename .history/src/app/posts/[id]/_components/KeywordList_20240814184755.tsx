'use client';

import { useState } from 'react';
import { CircleAlert, Loader, Plus, X } from 'lucide-react';
import { unique } from 'radash';

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
    setKeywordsStatus(({ [keyword]: changedKeyword, ...prevKeywordsStatus }) => {
      if (status === Status.success) {
        return prevKeywordsStatus;
      }

      return {
        ...prevKeywordsStatus,
        [keyword]: status,
      };
    });
  }

  const keywords = unique([...post.keywords, ...clientKeywords]);
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
          excludedKeywords={keywords}
        />
      )}

      <ul className="w-full">
        {keywords.slice().sort().map(keyword => (
          <li key={keyword} className="flex justify-between">
            <div>
              {keywordsStatus[keyword] ? keyword : (
                <AppLink.Internal href={`/search?keywords=${keyword}`}>
                  {keyword}
                </AppLink.Internal>
              )}
            </div>

            <div className="flex items-center">
              {!keywordsStatus[keyword] && (
                <IconButton size="sm">
                  <X className="w-4 h-4 text-destructive" />
                </IconButton>
              )}
              {keywordsStatus[keyword] === Status.loading && <Loader className="w-4 h-4 p-1.5" />}
              {keywordsStatus[keyword] === Status.error && <CircleAlert className="w-4 h-4 p-1.5" />}
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
