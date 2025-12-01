'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { handleEvaluateTask, type EvaluationResult } from '@/lib/ai';
import { BrainCircuit, Loader2, Star, ThumbsUp, Lightbulb } from 'lucide-react';

const evaluationFormSchema = z.object({
  taskContent: z.string().min(10, {
    message: 'Please enter at least 10 characters to evaluate.',
  }),
  aiProvider: z.enum(['OpenAI', 'Groq', 'Gemini', 'Claude', 'Ollama']),
});

type EvaluationFormValues = z.infer<typeof evaluationFormSchema>;

export default function AiEvaluationPage() {
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<EvaluationFormValues>({
    resolver: zodResolver(evaluationFormSchema),
    defaultValues: {
      taskContent: '',
      aiProvider: 'Gemini',
    },
  });

  async function onSubmit(data: EvaluationFormValues) {
    setIsLoading(true);
    setResult(null);
    const evaluationResult = await handleEvaluateTask(
      data.aiProvider,
      data.taskContent
    );
    setResult(evaluationResult);
    setIsLoading(false);
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <BrainCircuit className="h-6 w-6" />
            AI Task Evaluator
          </CardTitle>
          <CardDescription>
            Get AI-powered feedback on your task descriptions for clarity,
            completeness, and feasibility.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="taskContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'Develop a new feature that allows users to export their data as a CSV file.'"
                        className="min-h-[150px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="aiProvider"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>AI Provider</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full md:w-1/3">
                          <SelectValue placeholder="Select an AI provider" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Gemini">Gemini</SelectItem>
                        <SelectItem value="OpenAI">OpenAI</SelectItem>
                        <SelectItem value="Groq">Groq</SelectItem>
                        <SelectItem value="Claude">Claude</SelectItem>
                        <SelectItem value="Ollama">Ollama</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isLoading ? 'Evaluating...' : 'Evaluate Task'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {result && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Evaluation Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Star className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">AI Score</p>
                <p className="text-2xl font-bold">{result.aiScore} / 100</p>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="flex items-center gap-2 font-semibold">
                <ThumbsUp className="h-5 w-5 text-green-500" />
                Reasons
              </h3>
              <p className="text-muted-foreground">{result.reasons}</p>
            </div>
            <div className="space-y-2">
              <h3 className="flex items-center gap-2 font-semibold">
                <Lightbulb className="h-5 w-5 text-blue-500" />
                Suggestions
              </h3>
              <p className="text-muted-foreground">{result.suggestions}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
