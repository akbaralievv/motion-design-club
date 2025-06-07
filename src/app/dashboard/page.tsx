'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import type { RootState } from '@/lib/store';
import { courseService } from '@/lib/services/course.service';
import { progressService } from '@/lib/services/progress.service';
import { UserProfile } from '@/lib/store/slices/authSlice';
import { courseStatuses, progressStatuses } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';

interface EnrolledCourse {
  $id: string;
  title: string;
  description: string;
  imageUrl: string;
  progress: number;
  lastLesson?: {
    $id: string;
    title: string;
  };
}

export default function DashboardPage() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchUserCourses = async () => {
      try {
        setIsLoading(true);
        const userEnrollments = await progressService.getUserEnrollments(user?.$id || '');

        const coursesWithProgress = await Promise.all(
          userEnrollments.map(async (enrollment) => {
            const course = await courseService.getCourse(enrollment.courseId);
            const progress = await progressService.getCourseProgress(user?.$id || '', enrollment.courseId);

            // Find the last lesson the user was working on
            const lastLesson = progress.nextLesson
              ? await courseService.getLesson(progress.nextLesson)
              : undefined;

            return {
              $id: course.$id,
              title: course.title,
              description: course.description,
              imageUrl: course.imageUrl,
              progress: progress.percentComplete,
              lastLesson: lastLesson ? { $id: lastLesson.$id, title: lastLesson.title } : undefined
            };
          })
        );

        setEnrolledCourses(coursesWithProgress);
      } catch (error) {
        console.error('Error fetching user courses:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your courses. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserCourses();
  }, [isAuthenticated, router, user, toast]);

  if (!isAuthenticated) {
    // This shouldn't be visible as we redirect, but just in case
    return null;
  }

  return (
    <MainLayout>
      <div className="container py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.name}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link href="/courses">
              <Button>Browse Courses</Button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="mycourses" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="mycourses">My Courses</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="mycourses" className="space-y-8">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="aspect-video bg-muted" />
                    <CardHeader>
                      <div className="h-5 bg-muted rounded w-2/3 mb-2"></div>
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-4 bg-muted rounded w-full mb-3"></div>
                      <div className="h-4 bg-muted rounded w-5/6"></div>
                    </CardContent>
                    <CardFooter>
                      <div className="h-9 bg-muted rounded w-full"></div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : enrolledCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.map((course) => (
                  <Card key={course.$id} className="overflow-hidden">
                    <div className="relative aspect-video">
                      <Image
                        src={course.imageUrl || '/placeholder-course.jpg'}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle>{course.title}</CardTitle>
                      <CardDescription>
                        {course.progress === 100 ? 'Completed' : `${Math.round(course.progress)}% complete`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Progress value={course.progress} className="h-2 mb-4" />
                      {course.lastLesson && (
                        <p className="text-sm text-muted-foreground">
                          Continue with: <span className="font-medium">{course.lastLesson.title}</span>
                        </p>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Link href={`/courses/${course.$id}`} className="w-full">
                        <Button variant="default" className="w-full">
                          {course.progress === 0
                            ? 'Start Course'
                            : course.progress === 100
                            ? 'Review Course'
                            : 'Continue Learning'}
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">You haven't enrolled in any courses yet</h3>
                <p className="text-muted-foreground mb-6">Explore our catalog and start learning today</p>
                <Link href="/courses">
                  <Button>Browse Courses</Button>
                </Link>
              </div>
            )}
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Manage your account details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-full overflow-hidden relative bg-primary/10">
                    {user?.avatarUrl ? (
                      <Image
                        src={user.avatarUrl}
                        alt={user.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl font-bold">
                        {user?.name?.charAt(0) || '?'}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">{user?.name}</h3>
                    <p className="text-muted-foreground">{user?.email}</p>
                    <p className="text-xs mt-1 capitalize">{user?.role}</p>
                  </div>
                </div>

                <div className="grid gap-1">
                  <h4 className="font-medium">Email</h4>
                  <p>{user?.email}</p>
                </div>

                <div className="grid gap-1">
                  <h4 className="font-medium">Account ID</h4>
                  <p className="text-xs">{user?.$id}</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link href="/profile">
                  <Button variant="outline">Edit Profile</Button>
                </Link>
                <Link href="/settings">
                  <Button variant="secondary">Account Settings</Button>
                </Link>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
