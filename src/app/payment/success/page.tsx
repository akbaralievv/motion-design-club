'use client';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Course, mockCourses } from '@/lib/mock-data';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId');
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    if (courseId) {
      // Fetch course details
      const courseResult = mockCourses.find((c) => c.$id === courseId);
      setCourse(courseResult || null);
    }
  }, [courseId]);

  return (
    <MainLayout>
      <div className="container py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green-600">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
            <p className="text-lg text-muted-foreground">
              Thank you for your purchase. You now have access to the course.
            </p>
          </div>

          {course && (
            <div className="bg-card rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
              <p className="text-muted-foreground mb-4">{course.description}</p>
              <Button asChild>
                <Link href={`/courses/${course.slug}`}>Start Learning</Link>
              </Button>
            </div>
          )}

          <div className="space-y-4">
            <Button variant="outline" asChild>
              <Link href="/courses">Browse More Courses</Link>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
