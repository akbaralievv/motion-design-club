'use client';
import Link from 'next/link';
import Image from 'next/image';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { courseCategories, siteConfig } from '@/lib/constants';
import HeroReel from '@/components/hero-reel';
import { config, databases } from '@/lib/appwrite';
import { useEffect, useState } from 'react';
import { courseService } from '@/lib/services/course.service';
import { CoursesGridSkeleton } from './courses/page';
import { reviewService, type Review } from '@/lib/services/review.service';
import { ReviewForm } from '@/components/review-form';
import { ReviewCard } from '@/components/review-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ReviewFilters } from '@/lib/services/review.service';
import { VideoPlayer } from '@/components/video-player';

const brands = [
  {
    name: 'Netflix',
    logo: 'https://cdn.prod.website-files.com/67fe670fea6c0651a1f95405/67fe670fea6c0651a1f95852_Netflix.png',
  },
  {
    name: 'MGM',
    logo: 'https://cdn.prod.website-files.com/67fe670fea6c0651a1f95405/67fe670fea6c0651a1f95853_MGM.png',
  },
  {
    name: 'NBC Universal',
    logo: 'https://cdn.prod.website-files.com/67fe670fea6c0651a1f95405/67fe670fea6c0651a1f9588d_NBC%20Universal.png',
  },
  {
    name: 'Disney',
    logo: 'https://cdn.prod.website-files.com/67fe670fea6c0651a1f95405/67fe670fea6c0651a1f9585a_disney.png',
  },
  {
    name: 'Apple',
    logo: 'https://cdn.prod.website-files.com/67fe670fea6c0651a1f95405/67fe670fea6c0651a1f958e9_apple.png',
  },
  {
    name: 'Amazon',
    logo: 'https://cdn.prod.website-files.com/67fe670fea6c0651a1f95405/67fe670fea6c0651a1f958ea_amazon.png',
  },
  {
    name: 'Microsoft',
    logo: 'https://cdn.prod.website-files.com/67fe670fea6c0651a1f95405/67fe670fea6c0651a1f9587c_Microsoft.png',
  },
  {
    name: 'Google',
    logo: 'https://cdn.prod.website-files.com/67fe670fea6c0651a1f95405/67fe670fea6c0651a1f958eb_Google.png',
  },
  {
    name: 'BBC',
    logo: 'https://cdn.prod.website-files.com/67fe670fea6c0651a1f95405/67fe670fea6c0651a1f95851_bbc.png',
  },
  {
    name: 'CSS',
    logo: 'https://cdn.prod.website-files.com/67fe670fea6c0651a1f95405/67fe670fea6c0651a1f958ec_css.png',
  },
  {
    name: 'The Mill',
    logo: 'https://cdn.prod.website-files.com/67fe670fea6c0651a1f95405/67fe670fea6c0651a1f9588e_The%20Mill.png',
  },
  {
    name: 'Lockheed Martin',
    logo: 'https://cdn.prod.website-files.com/67fe670fea6c0651a1f95405/67fe670fea6c0651a1f95891_Lockheed%20Martin.png',
  },
  {
    name: 'Ford',
    logo: 'https://cdn.prod.website-files.com/67fe670fea6c0651a1f95405/67fe670fea6c0651a1f9588f_Ford.png',
  },
];

interface Course {
  $id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  lessonsCount: number;
  thumbnail?: string;
  slug: string;
}

export default function HomePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [filters, setFilters] = useState<ReviewFilters>({
    sortBy: 'newest',
    limit: 6,
  });

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await courseService.getPublishedCourses();
        setCourses(response);
      } catch (error) {
        console.error('Ошибка при получении курсов:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  useEffect(() => {
    async function fetchReviews() {
      try {
        setReviewsLoading(true);
        const response = await reviewService.getReviews(filters);
        setReviews(response);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setReviewsLoading(false);
      }
    }
    fetchReviews();
  }, [filters]);

  const handleReviewSubmitted = async () => {
    try {
      const response = await reviewService.getReviews(filters);
      setReviews(response);
    } catch (error) {
      console.error('Error refreshing reviews:', error);
    }
  };

  const handleFilterChange = (
    key: keyof ReviewFilters,
    value: ReviewFilters[keyof ReviewFilters],
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-background via-background to-background/80 overflow-hidden min-h-[600px] flex items-center justify-center">
        <div className="absolute inset-0 bg-grid-small-black/[0.2] dark:bg-grid-small-white/[0.2] bg-center [mask-image:radial-gradient(ellipse_at_center,rgba(0,0,0,0.5)_10%,transparent_70%)] z-10" />

        <div className="container relative z-20 pt-16 pb-20 md:pt-20 md:pb-24 lg:pt-32 lg:pb-40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="flex flex-col space-y-6">
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight
    text-transparent bg-clip-text bg-gradient-to-r
    from-purple-800 via-pink-500 to-sky-400
    animate-[pulseGradient_5s_ease-in-out_infinite]">
                Learn From The Best <span className="text-primary">Motion & 3D Designers</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-prose">
                Transform Your Talent with Premium Courses from the Best in 3D & Motion Design.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
                <Link href="/courses" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto">
                    Explore Courses
                  </Button>
                </Link>
                <Link href="/register" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Get Started Free
                  </Button>
                </Link>
              </div>
              <div className="text-sm text-muted-foreground">
                Join over 10,000 motion designers who've improved their skills with us
              </div>
            </div>

            <div className="relative h-[300px] md:h-[400px] lg:h-[500px] rounded-xl overflow-hidden shadow-2xl">
              <HeroReel />
            </div>
          </div>
        </div>
      </section>
      {/* Brands/Logos Section */}
      <section className="py-12 overflow-hidden bg-gradient-to-br from-rose-300/90 via-sky-300/90 to-amber-300/90 dark:bg-muted/30 dark:bg-none">
        <div className="container">
          <h2 className="text-xl font-medium text-center mb-8 text-white">
            Our students work at leading companies worldwide
          </h2>
          <div className="relative">
            <div className="flex animate-slide gap-8 md:gap-12 items-center opacity-80">
              <div className="flex gap-8 md:gap-12 items-center">
                {brands.map((brand) => (
                  <Image
                    key={brand.name}
                    src={brand.logo}
                    alt={brand.name}
                    width={150}
                    height={75}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Featured Courses Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Courses</h2>
              <p className="text-muted-foreground">
                Start your motion design journey with our most popular courses
              </p>
            </div>
            <Link href="/courses">
              <Button variant="outline">View All Courses</Button>
            </Link>
          </div>

          {/* Course Cards Grid - This would normally be fetched from your API */}
          {loading ? (
            <CoursesGridSkeleton />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                      <span className="text-sm text-muted-foreground">
                        {course.lessonsCount} lessons
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {course.description}
                    </p>
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
          )}
        </div>
      </section>
      {/* Features Section */}
      <section className="py-16 md:py-24 bg-transparent relative">
        <div className="absolute inset-0" style={{ zIndex: -1 }}>
          <VideoPlayer
            videoUrl="//fast.wistia.net/embed/iframe/3grpxpijxz"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl text-white font-bold mb-4">Why Learn With {siteConfig.name}</h2>
            <p className="text-lg text-white text-muted-foreground max-w-2xl mx-auto">
              Our platform is designed to provide you with the best possible learning experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex flex-col items-start p-6 bg-background rounded-xl shadow-sm">
              <div className="rounded-full bg-primary/10 p-3 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary">
                  <path d="M17 6H8a5 5 0 0 0 0 10h9" />
                  <path d="M17 16v-4" />
                  <path d="M13 16v-2" />
                  <path d="M9 16v-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Learn at Your Own Pace</h3>
              <p className="text-muted-foreground">
                All courses are self-paced, allowing you to learn when it's convenient for you.
                Access content anytime, anywhere.
              </p>
            </div>

            <div className="flex flex-col items-start p-6 bg-background rounded-xl shadow-sm">
              <div className="rounded-full bg-primary/10 p-3 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary">
                  <path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14" />
                  <path d="M2 20h20" />
                  <path d="M14 12v.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Instructors</h3>
              <p className="text-muted-foreground">
                Learn from industry professionals with years of experience in motion design,
                animation, and visual effects.
              </p>
            </div>

            <div className="flex flex-col items-start p-6 bg-background rounded-xl shadow-sm">
              <div className="rounded-full bg-primary/10 p-3 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary">
                  <circle cx="12" cy="12" r="10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Project-Based Learning</h3>
              <p className="text-muted-foreground">
                Apply what you learn through hands-on projects that help you build a professional
                portfolio while mastering new skills.
              </p>
            </div>

            <div className="flex flex-col items-start p-6 bg-background rounded-xl shadow-sm">
              <div className="rounded-full bg-primary/10 p-3 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary">
                  <path d="M7 10v12" />
                  <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Support</h3>
              <p className="text-muted-foreground">
                Join our community of motion designers, get feedback on your work, and connect with
                like-minded creatives.
              </p>
            </div>

            <div className="flex flex-col items-start p-6 bg-background rounded-xl shadow-sm">
              <div className="rounded-full bg-primary/10 p-3 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Lifetime Access</h3>
              <p className="text-muted-foreground">
                Purchase a course once and get lifetime access, including all future updates and
                improvements to the content.
              </p>
            </div>

            <div className="flex flex-col items-start p-6 bg-background rounded-xl shadow-sm">
              <div className="rounded-full bg-primary/10 p-3 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary">
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M8 12h8" />
                  <path d="M12 8v8" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">New Content Monthly</h3>
              <p className="text-muted-foreground">
                We regularly add new courses, tutorials, and resources to keep you updated with the
                latest trends and techniques.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Reviews Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Students Say</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hear from our community of motion designers about their learning experience
            </p>
          </div>

          <div className="flex justify-end mb-6">
            <Select
              value={filters.sortBy}
              onValueChange={(value) =>
                handleFilterChange('sortBy', value as ReviewFilters['sortBy'])
              }>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="highest">Highest Rated</SelectItem>
                <SelectItem value="lowest">Lowest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {reviewsLoading ? (
              <div className="col-span-2 text-center">Loading reviews...</div>
            ) : reviews.length === 0 ? (
              <div className="col-span-2 text-center text-muted-foreground">
                No reviews found. Be the first to share your experience!
              </div>
            ) : (
              reviews.map((review) => <ReviewCard key={review.$id} review={review} />)
            )}
          </div>

          <div className="max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-4 text-center">Share Your Experience</h3>
            <ReviewForm onReviewSubmitted={handleReviewSubmitted} />
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="bg-primary/10 rounded-2xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-small-white/5 bg-center [mask-image:radial-gradient(ellipse_at_center,rgba(0,0,0,0.8)_10%,transparent_70%)]" />

            <div className="relative z-10 max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Start Your Motion Design Journey?
              </h2>
              <p className="text-lg md:text-xl mb-8">
                Join thousands of students who are mastering motion design skills and launching
                successful careers.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/courses">
                  <Button size="lg" className="w-full">
                    Browse Courses
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="lg" variant="outline" className="w-full">
                    Create Free Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
