import Link from 'next/link';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  return (
    <MainLayout>
      <div className="container flex flex-col items-center justify-center min-h-[70vh] text-center px-4 py-16">
        <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground max-w-md mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/">
            <Button size="lg">Return to Home</Button>
          </Link>
          <Link href="/courses">
            <Button variant="outline" size="lg">Browse Courses</Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
