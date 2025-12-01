import { handleLogout } from '@/lib/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { User } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function ProfilePage() {
  // Mock user data for display
  const user: User = {
    name: 'Team Member',
    email: 'team@example.com',
    avatar: PlaceHolderImages.find(img => img.id === 'avatar-user')?.imageUrl || '',
  };

  return (
    <div className="container mx-auto max-w-2xl">
      <Card className="shadow-lg">
        <CardHeader className="items-center text-center">
          <Avatar className="h-24 w-24 mb-4" data-ai-hint="person avatar">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="text-4xl">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl">{user.name}</CardTitle>
          <CardDescription>
            Manage your profile settings and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" defaultValue={user.name} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue={user.email} readOnly />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2">
          <form action={handleLogout} className="w-full sm:w-auto">
            <Button variant="outline" type="submit" className="w-full">
              Logout
            </Button>
          </form>
          <Button className="w-full sm:flex-1">Edit Profile</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
