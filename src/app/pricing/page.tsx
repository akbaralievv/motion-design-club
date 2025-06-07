import Link from 'next/link';
import { CheckIcon } from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const tiers = [
  {
    name: 'Free',
    id: 'free',
    price: { monthly: '$0', annually: '$0' },
    description: 'Access to free lessons and introductory content',
    features: [
      'Access to all free courses',
      'Join community discussions',
      'Limited resource downloads',
      'Basic portfolio review',
      'Monthly live Q&A sessions',
    ],
    cta: 'Get Started',
    highlight: false,
  },
  {
    name: 'Pro',
    id: 'pro',
    price: { monthly: '$29', annually: '$290' },
    description: 'Complete access to all courses and premium features',
    features: [
      'All free tier features',
      'Unlimited access to all courses',
      'Downloadable project files',
      'Certificate of completion',
      'Advanced portfolio review',
      'Priority support',
      'Weekly live workshops',
    ],
    cta: 'Subscribe Now',
    highlight: true,
  },
  {
    name: 'Team',
    id: 'team',
    price: { monthly: '$79', annually: '$790' },
    description: 'For teams and studios with multiple members',
    features: [
      'All Pro tier features',
      'Up to 5 team members',
      'Team analytics dashboard',
      'Dedicated account manager',
      'Custom learning paths',
      'Private team workshops',
      'Branded certificates',
    ],
    cta: 'Contact Sales',
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <MainLayout>
      <div className="container py-12 md:py-16 lg:py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose the plan that's right for you with no hidden fees or long-term commitments
          </p>
        </div>

        {/* Pricing toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-muted rounded-lg p-1 inline-flex">
            <button
              type="button"
              className="relative rounded-md px-4 py-2 text-sm font-medium bg-background text-foreground shadow-sm">
              Monthly
            </button>
            <button
              type="button"
              className="relative rounded-md px-4 py-2 text-sm font-medium text-muted-foreground">
              Annually
              <span className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded text-xs bg-primary text-primary-foreground">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <Card
              key={tier.id}
              className={`flex flex-col ${
                tier.highlight ? 'border-primary ring-1 ring-primary/20' : ''
              }`}>
              <CardHeader>
                <CardTitle>{tier.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{tier.price.monthly}</span>
                  <span className="text-muted-foreground ml-2">/month</span>
                </div>
                <CardDescription className="mt-1">{tier.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3 text-sm">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckIcon className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Link href={tier.id === 'team' ? '/contact' : '/register'} className="w-full">
                  <Button className="w-full" variant={tier.highlight ? 'default' : 'outline'}>
                    {tier.cta}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Can I cancel my subscription at any time?
                </h3>
                <p className="text-muted-foreground">
                  Yes, you can cancel your subscription at any time from your account settings.
                  You'll continue to have access until the end of your billing period.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Do you offer a student discount?</h3>
                <p className="text-muted-foreground">
                  Yes, we offer a 50% discount for eligible students. Please contact our support
                  team with your student ID for verification.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  How many courses can I access with the Pro plan?
                </h3>
                <p className="text-muted-foreground">
                  The Pro plan gives you unlimited access to our entire course library, including
                  all future courses we release during your subscription.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Do I get a certificate after completing a course?
                </h3>
                <p className="text-muted-foreground">
                  Yes, Pro and Team subscribers receive a certificate of completion for each course
                  they finish, which can be shared on your portfolio or LinkedIn profile.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Can I download course materials for offline use?
                </h3>
                <p className="text-muted-foreground">
                  Pro and Team subscribers can download project files, exercise files, and resources
                  for offline use. Free tier users have limited download access.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  What happens if I need to add more team members?
                </h3>
                <p className="text-muted-foreground">
                  You can add additional team members beyond the included 5 for $15 per member per
                  month. Contact our sales team for custom enterprise solutions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-primary/10 rounded-2xl p-8 md:p-12 text-center mt-16">
          <h2 className="text-3xl font-bold mb-4">Ready to Elevate Your Motion Design Skills?</h2>
          <p className="text-lg max-w-2xl mx-auto mb-8">
            Join thousands of creative professionals who have transformed their careers with Motion
            Design Club.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses">
              <Button size="lg">Browse Our Courses</Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="lg">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
