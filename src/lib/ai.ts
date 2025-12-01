'use server';

import {
  evaluateTaskContent as evaluateTaskContentFlow,
  type EvaluateTaskContentInput,
  type EvaluateTaskContentOutput,
} from '@/ai/flows/evaluate-task-content';
import { z } from 'zod';

const EvaluationResultSchema = z.object({
  aiScore: z.number(),
  reasons: z.string(),
  suggestions: z.string(),
});

export type EvaluationResult = z.infer<typeof EvaluationResultSchema>;

export async function handleEvaluateTask(
  provider: EvaluateTaskContentInput['aiProvider'],
  content: string
): Promise<EvaluationResult> {
  console.log(`Evaluating task with ${provider}...`);

  if (!content.trim()) {
    return {
      aiScore: 0,
      reasons: 'Content is empty.',
      suggestions: 'Please provide some content to evaluate.',
    };
  }

  try {
    const result: EvaluateTaskContentOutput = await evaluateTaskContentFlow({
      aiProvider: provider,
      taskContent: content,
    });
    return result;
  } catch (error) {
    console.error('AI evaluation failed:', error);
    // In a real app, you might want to throw a more specific error
    // or return a more detailed error object.
    return {
      aiScore: 0,
      reasons: 'An error occurred during evaluation.',
      suggestions: 'Please check the console for details and try again later.',
    };
  }
}
