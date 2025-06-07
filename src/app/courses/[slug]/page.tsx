'use client';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CourseVideoPlayer } from '@/components/course-video-player';
import { courseService } from '@/lib/services/course.service';
import { courseCategories } from '@/lib/constants';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';

interface Course {
  $id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  thumbnail: string;
  instructorName: string;
  lessonsCount: number;
  totalDuration: number;
  updatedAt: string;
  slug: string;
  videoUrl?: string;
  status?: string;
  instructorId?: string;
  createdAt?: string;
  $collectionId?: string;
}

interface Lesson {
  $id: string;
  order: number;
  title: string;
  description: string;
  duration: number;
  videoUrl?: string;
  youtubeUrl?: string;
  resources?: string[];
}

// Helper function to format seconds to hours and minutes
function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes} min`;
}

export default function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!resolvedParams.slug) {
        notFound();
        return;
      }

      try {
        const courseData = await courseService.getCourseBySlug(resolvedParams.slug);

        if (!courseData) {
          setError('Course not found');
          setLoading(false);
          return;
        }

        const lessonsData = await courseService.getCourseLessons(courseData.slug);

        // Гарантируем, что все обязательные поля присутствуют
        const courseWithVideo: Course = {
          ...courseData,
          videoUrl: courseData.videoUrl || '',
          // если есть другие обязательные поля, добавьте их здесь с дефолтами
        };

        setCourse(courseWithVideo);
        setLessons((lessonsData as unknown as Lesson[]) ?? []);
      } catch (error) {
        console.error('Error fetching course details:', error);
        setError('Failed to load course details');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [resolvedParams.slug]);

  const handleEnroll = () => {
    if (!course) return;

    // Navigate to payment page with course details
    router.push(
      `/payment?courseId=${course.$id}&amount=${course.price}&title=${encodeURIComponent(
        course.title,
      )}`,
    );
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container py-12">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">{error}</h2>
            <Button asChild>
              <Link href="/courses">Back to Courses</Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!course) {
    return notFound();
  }

  const categoryName =
    courseCategories.find((cat) => cat.id === course.category)?.name || course.category;

  return (
    <MainLayout>
      {/* Course Header */}
      <section className="pt-16 md:pt-24 pb-12 md:pb-16 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Link
                  href={`/courses?category=${course.category}`}
                  className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-0.5 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20 hover:bg-primary/20 transition-colors">
                  {categoryName}
                </Link>
                <span className="text-sm text-muted-foreground">
                  {formatDuration(course.totalDuration)}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                {course.title}
              </h1>

              <p className="text-lg text-muted-foreground mb-6">{course.description}</p>

              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${course.instructorName}`}
                    alt={course.instructorName}
                  />
                  <AvatarFallback>{course.instructorName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{course.instructorName}</p>
                  <p className="text-sm text-muted-foreground">Instructor</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="lg" className="w-full sm:w-auto" onClick={handleEnroll}>
                  Enroll Now - {course.price} KGS
                </Button>
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Add to Wishlist
                </Button>
              </div>

              <div className="flex flex-wrap gap-6 text-sm">
                <div>
                  <p className="font-medium">Last Updated</p>
                  <p className="text-muted-foreground">
                    {new Date(course.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Lessons</p>
                  <p className="text-muted-foreground">{course.lessonsCount} lessons</p>
                </div>
                <div>
                  <p className="font-medium">Total Duration</p>
                  <p className="text-muted-foreground">{formatDuration(course.totalDuration)}</p>
                </div>
              </div>
            </div>

            <div className="relative aspect-video rounded-xl overflow-hidden shadow-xl">
              {/* <CourseVideoPlayer videoUrl={course.videoUrl || ''} title={course.title} /> */}
              <iframe
                scrolling="no"
                frameBorder="0"
                style={{ width: '100%', height: '100%' }}
                id="player"
                src={course.videoUrl}
                allowFullScreen
                allow="accelerometer; gyroscope; fullscreen; encrypted-media; picture-in-picture;"></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-12 md:py-16">
        <div className="container">
          <Tabs defaultValue="curriculum" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="details">Course Details</TabsTrigger>
            </TabsList>

            <TabsContent value="curriculum">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">Course Curriculum</h2>

                <Accordion type="single" collapsible className="w-full">
                  {lessons.length > 0 ? (
                    lessons.map((lesson) => (
                      <AccordionItem key={lesson.$id} value={lesson.$id}>
                        <AccordionTrigger className="hover:bg-muted/50 px-4 rounded-lg">
                          <div className="flex items-center gap-4 text-left">
                            <span className="text-muted-foreground">{lesson.order}.</span>
                            <span>{lesson.title}</span>
                            <span className="ml-auto text-sm text-muted-foreground">
                              {formatDuration(lesson.duration)}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pt-2">
                          <p className="text-muted-foreground mb-4">{lesson.description}</p>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/courses/${resolvedParams.slug}/lessons/${lesson.$id}`}>
                              Preview Lesson
                            </Link>
                          </Button>
                        </AccordionContent>
                      </AccordionItem>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-muted-foreground">
                        No lessons available for this course yet.
                      </p>
                    </div>
                  )}
                </Accordion>
              </div>
            </TabsContent>

            <TabsContent value="details">
              <div className="max-w-3xl mx-auto space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-4">What You'll Learn</h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <li className="flex items-start gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary shrink-0 mt-0.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Master the fundamentals of {categoryName.toLowerCase()}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary shrink-0 mt-0.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Create professional-quality motion design projects</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary shrink-0 mt-0.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Develop a portfolio of work to showcase to potential clients</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary shrink-0 mt-0.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Understand industry-standard workflows and techniques</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">Course Requirements</h2>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary shrink-0 mt-0.5">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" x2="12" y1="8" y2="16" />
                        <line x1="8" x2="16" y1="12" y2="12" />
                      </svg>
                      <span>Basic computer skills and familiarity with creative software</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary shrink-0 mt-0.5">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" x2="12" y1="8" y2="16" />
                        <line x1="8" x2="16" y1="12" y2="12" />
                      </svg>
                      <span>
                        Recommended software: Adobe After Effects, Illustrator (or equivalent)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary shrink-0 mt-0.5">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" x2="12" y1="8" y2="16" />
                        <line x1="8" x2="16" y1="12" y2="12" />
                      </svg>
                      <span>No prior motion design experience necessary for beginner courses</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">About the Instructor</h2>
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${course.instructorName}`}
                        alt={course.instructorName}
                      />
                      <AvatarFallback>{course.instructorName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-medium">{course.instructorName}</h3>
                      <p className="text-muted-foreground mb-2">Motion Design Professional</p>
                      <p className="text-sm">
                        With over 10 years of industry experience, working with top studios and
                        brands worldwide. Passionate about teaching and helping students achieve
                        their creative goals.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to start learning?</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Join thousands of students who are mastering motion design with our courses.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="w-full sm:w-auto">
                Enroll Now - ${course.price.toFixed(2)}
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto" asChild>
                <Link href="/courses">Browse More Courses</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
