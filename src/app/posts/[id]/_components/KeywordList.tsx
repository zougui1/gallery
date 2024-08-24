'use client';

import { useState } from 'react';
import { CircleAlert, Loader, X } from 'lucide-react';
import { unique } from 'radash';

import { IconButton, Typography } from '@zougui/react.ui';

import { AppLink } from '~/app/_components/atoms/AppLink';
import { api } from '~/trpc/react';
import { KeywordAutocomplete } from '~/app/_components/organisms/KeywordAutocomplete';
import { type PostSchemaWithId } from '~/server/database';

enum Status {
  loading = 'loading',
  success = 'success',
  error = 'error',
}

type KeywordState = {
  status: Status;
  message?: string;
}

export const KeywordList = ({ post }: KeywordListProps) => {
  const [clientKeywords, setClientKeywords] = useState<string[]>([]);
  const [removedKeywords, setRemovedKeywords] = useState<string[]>([]);
  const [keywordsState, setKeywordsState] = useState<Record<string, KeywordState>>({});

  const changeKeywordStatus = (keyword: string, state: KeywordState): void => {
    setKeywordsState(({ [keyword]: changedKeywordState, ...prevKeywordsState }) => {
      if (state.status === Status.success) {
        return prevKeywordsState;
      }

      return {
        ...prevKeywordsState,
        [keyword]: state,
      };
    });
  }

  const keywords = unique([...post.keywords, ...clientKeywords]).filter(keyword => {
    return !removedKeywords.includes(keyword);
  });
  const addKeywordMutation = api.post.addKeyword.useMutation();
  const removeKeywordMutation = api.post.removeKeyword.useMutation();

  const addKeyword = async (keyword: string): Promise<void> => {
    setClientKeywords(prevClientKeywords => [...prevClientKeywords, keyword]);
    changeKeywordStatus(keyword, {
      status: Status.loading,
      message: 'Adding the keyword...',
    });

    try {
      await addKeywordMutation.mutateAsync({ id: post._id, keyword });
      changeKeywordStatus(keyword, { status: Status.success });
      setRemovedKeywords(prevKeywords => prevKeywords.filter(prevKeyword => prevKeyword !== keyword));
    } catch (error) {
      changeKeywordStatus(keyword, {
        status: Status.error,
        message: 'Could not add the keyword',
      });
    }
  }

  const removeKeyword = async (keyword: string): Promise<void> => {
    changeKeywordStatus(keyword, {
      status: Status.loading,
      message: 'Removing the keyword...',
    });

    try {
      await removeKeywordMutation.mutateAsync({ id: post._id, keyword });
      changeKeywordStatus(keyword, { status: Status.success });
      setRemovedKeywords(prevKeywords => [...prevKeywords, keyword]);
    } catch (error) {
      changeKeywordStatus(keyword, {
        status: Status.error,
        message: 'Could not remove the keyword',
      });
    }
  }

  return (
    <div className="w-full flex flex-col">
      <Typography.H5>Keywords</Typography.H5>

      <KeywordAutocomplete
        values={[]}
        onValuesChange={([newKeyword]) => addKeyword(String(newKeyword))}
        creatable
        excludedKeywords={keywords}
        placeholder="Add keywords"
        className="mb-4"
      />

      <ul className="w-full">
        {keywords.slice().sort().map(keyword => (
          <li key={keyword} className="flex justify-between">
            <div>
              <AppLink.Internal href={`/search?keywords=${keyword}`}>
                {keyword}
              </AppLink.Internal>
            </div>

            <div className="flex items-center" title={keywordsState[keyword]?.message}>
              {!keywordsState[keyword] && (
                <IconButton size="sm" onClick={() => removeKeyword(keyword)}>
                  <X className="w-4 h-4 text-destructive" />
                </IconButton>
              )}
              {keywordsState[keyword]?.status === Status.loading && <Loader className="w-4 h-4 m-1.5" />}
              {keywordsState[keyword]?.status === Status.error && <CircleAlert className="w-4 h-4 m-1.5" />}
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
