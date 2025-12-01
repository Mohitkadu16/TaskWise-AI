import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Check } from 'lucide-react';

const proFeatures = [
    "Unlimited tasks",
    "Advanced AI evaluations",
    "Team collaboration features",
    "Priority support",
    "Export data options",
];

export default function PaymentsPage() {
  return (
    <div className="container mx-auto max-w-2xl">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Billing & Plans</CardTitle>
          <CardDescription>
            Manage your subscription and billing details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold">Your Current Plan</h3>
            <p className="text-4xl font-bold mt-2">Free Plan</p>
            <p className="text-muted-foreground mt-1">
              Includes basic task management and limited AI evaluations.
            </p>
          </div>
          <div className="rounded-lg border bg-primary/10 p-6">
            <h3 className="text-lg font-semibold text-primary">Upgrade to Pro</h3>
            <p className="text-muted-foreground mt-1">
              Unlock powerful features to boost your productivity.
            </p>
            <ul className="mt-4 space-y-2">
                {proFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500"/>
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" size="lg">
            Upgrade to Pro
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
