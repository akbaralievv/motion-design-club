'use client';
import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { courseCategories } from '@/lib/constants';
import { courseService, type CourseFilters } from '@/lib/services/course.service';
import type { Course } from '@/lib/store/slices/courseSlice';
import { useSearchParams } from 'next/navigation';
import { useDebounce } from '@/hooks/use-debounce';

// This is a client component that displays courses
function CoursesGrid({
  category = 'all',
  searchQuery = '',
}: {
  category?: string;
  searchQuery?: string;
}) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoading(true);
        const response = await courseService.getCourses({
          category,
          searchQuery: debouncedSearchQuery,
          limit: 12,
        });
        setCourses(response);
      } catch (error) {
        console.error('Ошибка при получении курсов:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, [category, debouncedSearchQuery]);

  if (loading) return <CoursesGridSkeleton />;

  if (courses.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-medium mb-4">No courses found</h3>
        <p className="text-muted-foreground mb-6">
          {searchQuery
            ? `No courses matching "${searchQuery}" were found.`
            : 'No courses available in this category yet.'}
        </p>
        <Button asChild>
          <Link href="/courses">View all courses</Link>
        </Button>
      </div>
    );
  }

  // Determine grid columns based on number of courses
  const getGridCols = () => {
    if (courses.length === 1) return 'grid-cols-1';
    if (courses.length === 2) return 'grid-cols-1 md:grid-cols-2';
    if (courses.length === 3) return 'grid-cols-1 md:grid-cols-3';
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
  };

  return (
    <div className={`grid ${getGridCols()} gap-6 mb-20`}>
      {courses.map((course) => (
        <div
          key={course.$id}
          className="group rounded-xl max-w-[560px] mx-auto border bg-card text-card-foreground shadow overflow-hidden transition-all hover:shadow-md">
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={course.thumbnail || '/images/course-placeholder.jpg'}
              alt={course.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          </div>
          <div className="p-5">
            <div className="flex justify-between mb-2">
              <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
                {courseCategories.find((cat) => cat.id === course.category)?.name ||
                  course.category}
              </span>
              <span className="text-sm text-muted-foreground">{course.lessonsCount} lessons</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{course.description}</p>
            <div className="flex justify-between items-center">
              <span className="font-bold">{course.price} KGS</span>
              <Link href={`/courses/${course.slug}`}>
                <Button variant="secondary" size="sm">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Loading placeholder
export function CoursesGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="rounded-xl border bg-card shadow animate-pulse overflow-hidden">
          <div className="aspect-video bg-muted"></div>
          <div className="p-5 space-y-4">
            <div className="flex justify-between">
              <div className="h-6 w-24 bg-muted rounded"></div>
              <div className="h-6 w-20 bg-muted rounded"></div>
            </div>
            <div className="h-6 w-full bg-muted rounded"></div>
            <div className="h-4 w-full bg-muted rounded"></div>
            <div className="h-4 w-3/4 bg-muted rounded"></div>
            <div className="flex justify-between items-center">
              <div className="h-6 w-16 bg-muted rounded"></div>
              <div className="h-8 w-24 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// This function gets called at request time
export default function CoursesPage() {
  const [category, setCategory] = useState('all');
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    setSearchQuery(searchInput);
  };

  return (
    <MainLayout>
      {/* Hero section */}
      <section className="relative bg-gradient-to-b from-background via-background to-background/80 py-16">
        <div className="absolute inset-0 bg-grid-small-black/[0.2] dark:bg-grid-small-white/[0.2] bg-center [mask-image:radial-gradient(ellipse_at_center,rgba(0,0,0,0.5)_10%,transparent_70%)]" />
        <div className="container relative">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Our <span className="text-primary">Courses</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Discover our comprehensive range of motion design courses taught by industry-leading
              instructors
            </p>

            <div className="max-w-md mx-auto">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Search courses..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                  className="pl-4 pr-12"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-9 w-10"
                  onClick={handleSearch}>
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
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course filter and listings */}
      <section className="">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <Tabs defaultValue={category} className="w-full md:w-auto" onValueChange={setCategory}>
              <div className="overflow-x-auto">
                <TabsList className="inline-flex w-auto">
                  <TabsTrigger value="all">All Courses</TabsTrigger>
                  {courseCategories.map((cat) => (
                    <TabsTrigger key={cat.id} value={cat.id}>
                      {cat.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <TabsContent value={category}>
                <Suspense fallback={<CoursesGridSkeleton />}>
                  <CoursesGrid category={category} searchQuery={searchQuery} />
                </Suspense>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
