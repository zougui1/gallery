'use client';

import { useState } from 'react';

import { RadioGroup, Typography } from '@zougui/react.ui';
import { SingleSubmissionForm } from './single-form/SingleSubmissionForm';
import { StorySubmissionForm } from './StorySubmissionForm';
import { ComicSubmissionForm } from './ComicSubmissionForm';

enum SubmissionType {
  single = 'single',
  comic = 'comic',
  storySeries = 'storySeries',
}

export const UploadForm = () => {
  const [submissionType, setSubmissionType] = useState(SubmissionType.single);

  return (
    <div className="w-full flex flex-col space-y-8">
      <div className="w-full flex flex-col items-center space-y-4">
        <Typography.H4>Submission type</Typography.H4>

        <RadioGroup.Root className="flex" value={submissionType} onValueChange={value => setSubmissionType(value as SubmissionType)}>
          <label className="flex items-center">
            <RadioGroup.Item value={SubmissionType.single} />
            <span className="ml-2">Single submission</span>
          </label>

          <label className="flex items-center">
            <RadioGroup.Item value={SubmissionType.comic} />
            <span className="ml-2">Comic</span>
          </label>

          <label className="flex items-center">
            <RadioGroup.Item value={SubmissionType.storySeries} />
            <span className="ml-2">Story series</span>
          </label>
        </RadioGroup.Root>
      </div>

      <div>
        {submissionType === SubmissionType.single && (
          <SingleSubmissionForm />
        )}

        {submissionType === SubmissionType.storySeries && (
          <StorySubmissionForm />
        )}

        {submissionType === SubmissionType.comic && (
          <ComicSubmissionForm />
        )}
      </div>
    </div>
  );
}
