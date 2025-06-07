'use client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { courseService } from '@/lib/services/course.service';
import { lessonService, type Lesson } from '@/lib/services/lesson.service';
import { useState, useEffect, use } from 'react';
import type { Course } from '@/lib/store/slices/courseSlice';
import { VideoPlayer } from '@/components/video-player';

// Helper function to format seconds to hours and minutes
function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes} min`;
}

export default function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string }>;
}) {
  const { slug, lessonId } = use(params);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [courseLessons, setCourseLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const courseData = await courseService.getCourseBySlug(slug);
        if (!courseData) {
          setError('Course not found');
          setLoading(false);
          return;
        }
        setCourse(courseData);
        const lessonsData = await lessonService.getLessonsByCourseId(courseData.slug);
        setCourseLessons(lessonsData);
        const lessonData = await lessonService.getLessonById(lessonId);
        if (!lessonData) {
          setError('Lesson not found');
          setLoading(false);
          return;
        }
        setLesson(lessonData);
      } catch (err) {
        setError('Failed to load lesson or course');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug, lessonId]);

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

  if (error || !course || !lesson) {
    return notFound();
  }

  // Find the current lesson index
  const currentLessonIndex = courseLessons.findIndex((l) => l.$id === lessonId);

  // Determine previous and next lessons
  const prevLesson = currentLessonIndex > 0 ? courseLessons[currentLessonIndex - 1] : null;
  const nextLesson =
    currentLessonIndex < courseLessons.length - 1 ? courseLessons[currentLessonIndex + 1] : null;

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <nav className="flex items-center space-x-2 mb-6 text-sm text-muted-foreground">
              <Link href="/courses" className="hover:text-foreground">
                Courses
              </Link>
              <span>/</span>
              <Link href={`/courses/${slug}`} className="hover:text-foreground">
                {course.title}
              </Link>
              <span>/</span>
              <span className="text-foreground">Lesson {lesson.order}</span>
            </nav>

            <h1 className="text-2xl md:text-3xl font-bold mb-6">{lesson.title}</h1>

            {/* Video Player */}
            <div className="mb-8">
              <VideoPlayer
                videoUrl={lesson.videoUrl}
                youtubeUrl={lesson.youtubeUrl}
                className="rounded-lg shadow-xl"
              />
            </div>

            <Tabs defaultValue="overview" className="w-full mb-8">
              <TabsList className="grid w-full max-w-md grid-cols-2 mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="prose dark:prose-invert max-w-none">
                  <h2>About this lesson</h2>
                  <p>{lesson.description}</p>

                  <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <h3>Duration</h3>
                      <p>{formatDuration(lesson.duration)}</p>
                    </div>

                    <div className="flex-1">
                      <h3>Difficulty</h3>
                      <p>Intermediate</p>
                    </div>

                    <div className="flex-1">
                      <h3>Software Used</h3>
                      <p>Adobe After Effects</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="resources">
                <div className="prose dark:prose-invert max-w-none">
                  <h2>Additional Resources</h2>

                  {lesson.resources && lesson.resources.length > 0 ? (
                    <ul className="space-y-2">
                      {lesson.resources.map((resource: string, index: number) => (
                        <li key={index}>
                          <a
                            href={resource}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="flex-shrink-0">
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                              <polyline points="15 3 21 3 21 9" />
                              <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                            Resource {index + 1}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No additional resources available for this lesson.</p>
                  )}

                  {/* Project Files Example (optional) */}
                  {/* <h3 className="mt-6">Project Files</h3>
                  <div className="p-4 border rounded-lg bg-muted/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <svg ... />
                      <div>
                        <p className="font-medium">{lesson.title} - Project Files</p>
                        <p className="text-xs text-muted-foreground">14.2 MB • ZIP</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Download
                    </Button>
                  </div> */}
                </div>
              </TabsContent>
            </Tabs>

            {/* Lesson Navigation */}
            <div className="flex justify-between border-t pt-6 mt-8">
              {prevLesson ? (
                <Button variant="outline" asChild>
                  <Link
                    href={`/courses/${slug}/lessons/${prevLesson.$id}`}
                    className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <path d="m12 19-7-7 7-7" />
                      <path d="M19 12H5" />
                    </svg>
                    Previous Lesson
                  </Link>
                </Button>
              ) : (
                <div></div>
              )}

              {nextLesson ? (
                <Button asChild>
                  <Link
                    href={`/courses/${slug}/lessons/${nextLesson.$id}`}
                    className="flex items-center gap-2">
                    Next Lesson
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <path d="m5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </Link>
                </Button>
              ) : (
                <Button asChild>
                  <Link href={`/courses/${slug}`}>Complete Course</Link>
                </Button>
              )}
            </div>
          </div>

          {/* Sidebar - Course Curriculum */}
          <div className="lg:w-80 bg-muted/30 rounded-lg p-4">
            <h2 className="font-semibold text-lg mb-4">Course Curriculum</h2>

            <div className="space-y-1">
              {courseLessons.map((curLesson) => {
                const isCurrent = curLesson.$id === lessonId;

                return (
                  <Link
                    key={curLesson.$id}
                    href={`/courses/${slug}/lessons/${curLesson.$id}`}
                    className={`flex items-center gap-3 py-2 px-3 rounded-md transition-colors ${
                      isCurrent ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                    }`}>
                    <span className="flex-shrink-0 w-5 text-muted-foreground">
                      {curLesson.order}.
                    </span>
                    <span className="flex-1 line-clamp-1">{curLesson.title}</span>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {formatDuration(curLesson.duration)}
                    </span>
                  </Link>
                );
              })}
            </div>

            <div className="mt-6 pt-6 border-t">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/courses/${slug}`} className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M3 9h18" />
                  </svg>
                  Back to Course
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
