import { Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Logo = ({
  className,
  iconOnly = false,
}: {
  className?: string;
  iconOnly?: boolean;
}) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Bot className="h-7 w-7 text-primary shrink-0" />
      {!iconOnly && <h1 className="text-xl font-bold">TaskWise AI</h1>}
    </div>
  );
};
