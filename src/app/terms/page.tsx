import Link from 'next/link';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';

export default function TermsPage() {
  return (
    <MainLayout>
      <div className="container py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Terms and Conditions</h1>
            <p className="text-muted-foreground">Last updated: April 1, 2025</p>
          </div>

          <div className="prose prose-zinc dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2>1. Introduction</h2>
              <p>
                Welcome to Motion Design Club. These Terms and Conditions govern your use of our
                website and services. By accessing or using our website and services, you agree to
                be bound by these Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2>2. Definitions</h2>
              <p>
                <strong>&quot;Account&quot;</strong> means a unique account created for you to
                access our service or parts of our service.
              </p>
              <p>
                <strong>&quot;Company&quot;</strong> (referred to as either &quot;the Company&quot;,
                &quot;We&quot;, &quot;Us&quot; or &quot;Our&quot; in this Agreement) refers to
                Motion Design Club.
              </p>
              <p>
                <strong>&quot;Content&quot;</strong> refers to content such as text, images, video,
                or other material that can be posted, uploaded, linked to, or otherwise made
                available on the platform.
              </p>
              <p>
                <strong>&quot;Service&quot;</strong> refers to the website, courses, and educational
                services provided by Motion Design Club.
              </p>
              <p>
                <strong>&quot;User&quot;</strong> (referred to as either &quot;the User&quot;,
                &quot;You&quot;, or &quot;Your&quot; in this Agreement) refers to the individual
                accessing or using the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2>3. Account Creation</h2>
              <p>
                To use certain features of the Service, you must register for an account. When you
                register, you must provide accurate and complete information. It is your
                responsibility to maintain the security of your account, and you are responsible for
                all activities that occur through your account.
              </p>
            </section>

            <section className="mb-8">
              <h2>4. Content and Courses</h2>
              <p>
                All courses, materials, and content provided through our Service are owned by us or
                our licensors and are protected by copyright, trademark, and other intellectual
                property laws. You may not reproduce, distribute, display, sell, or use any content
                or materials from our courses without our express permission.
              </p>
              <p>
                When you purchase a course, you are granted a limited, non-exclusive,
                non-transferable license to access and use the course materials for your personal,
                non-commercial educational purposes.
              </p>
            </section>

            <section className="mb-8">
              <h2>5. Payments and Refunds</h2>
              <p>
                Course fees are payable in advance. We accept payments via the methods indicated on
                our website. All fees are non-refundable unless otherwise specified in our Refund
                Policy.
              </p>
              <p>
                Refunds may be issued at our discretion if requested within 14 days of purchase,
                provided you have not accessed more than 20% of the course content.
              </p>
            </section>

            <section className="mb-8">
              <h2>6. User Conduct</h2>
              <p>You agree not to:</p>
              <ul>
                <li>Use the Service in any way that violates any applicable law or regulation</li>
                <li>
                  Share your account credentials with others or allow others to access your account
                </li>
                <li>Attempt to probe, scan, or test the vulnerability of our systems</li>
                <li>Copy, distribute, or share content from the courses without permission</li>
                <li>Use the Service for any harmful or illegal purposes</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2>7. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, Motion Design Club shall not be liable for
                any indirect, incidental, special, consequential, or punitive damages, or any loss
                of profits or revenue, whether incurred directly or indirectly, or any loss of data,
                use, goodwill, or other intangible losses, resulting from your access to or use of
                or inability to access or use the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2>8. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will provide notice of
                significant changes by posting a prominent notice on our Service or by sending you
                an email. Your continued use of the Service after such modifications will constitute
                your acknowledgment of the modified Terms and agreement to abide by them.
              </p>
            </section>

            <section className="mb-10">
              <h2>9. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at{' '}
                <a href="mailto:legal@motiondesignacademy.com">legal@motiondesignacademy.com</a>.
              </p>
            </section>

            <div className="flex justify-center mt-10">
              <Link href="/">
                <Button>Return to Home</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
