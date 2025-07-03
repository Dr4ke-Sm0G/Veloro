'use client';

import { useRouter } from 'next/navigation';
import {
  Card, CardHeader, CardContent, CardTitle,
  Button, Input, Label, Select, SelectTrigger,
  SelectItem, SelectValue, SelectContent,
  Avatar, AvatarFallback, AvatarImage,
} from '@/components/ui';

import { Skeleton } from '@/components/ui/skeleton';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { api } from '@/utils/api';
import { useEffect, useRef, useState } from 'react';

const schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  city: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),
  location: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(8),
});

type SettingsForm = z.infer<typeof schema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: user, isLoading } = api.user.getCurrent.useQuery();
  const [passwordAttempts, setPasswordAttempts] = useState(0);
const [saved, setSaved] = useState(false);

const mutation = api.user.updateUser.useMutation({
  onSuccess: () => {
    toast.success("Settings saved", {
      position: "top-center",
      description: "Your changes have been updated successfully.",
      duration: 3000,
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  },
  onError: () => {
    toast.error("Something went wrong");
  },
});


  const passwordMutation = api.user.changePassword.useMutation({
    onSuccess: () => {
      toast.success('Password successfully changed');
      setPasswordAttempts(0);
      passwordForm.reset();
    },
    onError: (error) => {
      setPasswordAttempts((prev) => prev + 1);
      if (passwordAttempts >= 2) {
        toast.error("Too many failed attempts. Try again later.");
      } else {
        toast.error(error?.message || "Incorrect current password");
      }
    }
  });

  const avatarMutation = api.user.updateAvatar.useMutation({
  onSuccess: () => {
    toast.success("Avatar Updated");
  },
  onError: () => {
    toast.error("Something went wrong");
  }
  });

  const form = useForm<SettingsForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      city: '',
      zip: '',
      country: '',
      location: '',
    },
  });

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    if (user) {
      const [firstName = '', lastName = ''] = user.name?.split(' ') || [];
      form.reset({
        firstName,
        lastName,
        city: user.city || '',
        zip: user.zip || '',
        country: user.country || '',
        location: user.location || '',
      });
    }
  }, [user, form]);

  if (isLoading || !user) return <Skeleton className="h-96 w-full rounded-2xl" />;

  const onSubmit = (data: SettingsForm) => {
    mutation.mutate(data);
  };

  const onPasswordChange = (data: PasswordForm) => {
    if (passwordAttempts >= 3) {
      toast.error("Too many attempts. Try again later.");
      return;
    }
    passwordMutation.mutate(data);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      avatarMutation.mutate({ image: base64 });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 grid gap-6 grid-cols-1 lg:grid-cols-3">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Avatar</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={user.image ?? ''} />
              <AvatarFallback>{user.name?.[0]}</AvatarFallback>
            </Avatar>
            <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleAvatarChange} />
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              Change Avatar
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Language & Timezone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label>Language</Label>
              <Select defaultValue="en">
                <SelectTrigger>
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Timezone</Label>
              <Select defaultValue="GMT+01:00">
                <SelectTrigger>
                  <SelectValue placeholder="Timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GMT+00:00">GMT+00:00</SelectItem>
                  <SelectItem value="GMT+01:00">GMT+01:00</SelectItem>
                  <SelectItem value="GMT+07:00">GMT+07:00</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>First Name</Label>
                <Input {...form.register('firstName')} />
              </div>
              <div className="space-y-1">
                <Label>Last Name</Label>
                <Input {...form.register('lastName')} />
              </div>
              <div className="space-y-1">
                <Label>Email</Label>
                <Input value={user.email} disabled />
              </div>
              <div className="space-y-1">
                <Label>Country</Label>
                <Input {...form.register('country')} />
              </div>
              <div className="space-y-1">
                <Label>City</Label>
                <Input {...form.register('city')} />
              </div>
              <div className="space-y-1">
                <Label>ZIP Code</Label>
                <Input {...form.register('zip')} />
              </div>
              <div className="space-y-1">
                <Label>Location</Label>
                <Input {...form.register('location')} />
              </div>
            </CardContent>
            <CardContent className="flex justify-end mt-4">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Save all
              </Button>
            </CardContent>
          </Card>
        </form>

        <form onSubmit={passwordForm.handleSubmit(onPasswordChange)}>
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Current Password</Label>
                <Input type="password" {...passwordForm.register('currentPassword')} />
              </div>
              <div className="space-y-1">
                <Label>New Password</Label>
                <Input type="password" {...passwordForm.register('newPassword')} />
              </div>
            </CardContent>
            <CardContent className="flex justify-end mt-4">
              <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
                Update Password
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
