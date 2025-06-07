import { ID, Query } from 'appwrite';
import { config, databases } from '@/lib/appwrite';
import type { Course } from '@/lib/store/slices/courseSlice';
import { progressStatuses } from '@/lib/constants';

export interface Enrollment {
  $id: string;
  userId: string;
  courseId: string;
  paymentId?: string;
  amount: number;
  status: string;
  enrolledAt: string;
  expiresAt?: string;
}

export const paymentService = {
  // Create a new enrollment
  async createEnrollment(userId: string, courseId: string, paymentId?: string): Promise<Enrollment> {
    try {
      const course = await databases.getDocument(
        config.databaseId,
        config.coursesCollectionId,
        courseId
      ) as unknown as Course;

      const enrollment = await databases.createDocument(
        config.databaseId,
        config.enrollmentsCollectionId,
        ID.unique(),
        {
          userId,
          courseId,
          paymentId,
          amount: course.price,
          status: 'active',
          enrolledAt: new Date().toISOString(),
        }
      );

      // Create initial progress record
      await databases.createDocument(
        config.databaseId,
        config.progressCollectionId,
        ID.unique(),
        {
          userId,
          courseId,
          progress: [],
          enrollmentStatus: 'active',
          startedAt: new Date().toISOString(),
          lastAccessedAt: new Date().toISOString(),
        }
      );

      return enrollment as unknown as Enrollment;
    } catch (error) {
      console.error('Error creating enrollment:', error);
      throw error;
    }
  },

  // Check if user is enrolled in a course
  async isUserEnrolled(userId: string, courseId: string): Promise<boolean> {
    try {
      const response = await databases.listDocuments(
        config.databaseId,
        config.enrollmentsCollectionId,
        [
          Query.equal('userId', userId),
          Query.equal('courseId', courseId),
          Query.equal('status', 'active')
        ]
      );

      return response.total > 0;
    } catch (error) {
      console.error('Error checking enrollment:', error);
      throw error;
    }
  },

  // Get all user enrollments
  async getUserEnrollments(userId: string): Promise<Enrollment[]> {
    try {
      const response = await databases.listDocuments(
        config.databaseId,
        config.enrollmentsCollectionId,
        [Query.equal('userId', userId)]
      );

      return response.documents as unknown as Enrollment[];
    } catch (error) {
      console.error('Error getting user enrollments:', error);
      throw error;
    }
  },

  // Create a Stripe checkout session
  async createStripeCheckoutSession(courseId: string, userId: string): Promise<{ sessionId: string, url: string }> {
    try {
      // This would typically be an API call to your backend
      // For demo purposes, we're mocking the response
      return {
        sessionId: 'demo_session_id',
        url: `/checkout/success?courseId=${courseId}`,
      };

      /* In a real implementation:
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId,
          userId,
        }),
      });

      const { sessionId, url } = await response.json();
      return { sessionId, url };
      */
    } catch (error) {
      console.error('Error creating Stripe checkout session:', error);
      throw error;
    }
  },

  // Verify a payment (typically called by webhook)
  async verifyPayment(paymentId: string, status: 'succeeded' | 'failed'): Promise<void> {
    try {
      // Find the enrollment with this payment ID
      const response = await databases.listDocuments(
        config.databaseId,
        config.enrollmentsCollectionId,
        [Query.equal('paymentId', paymentId)]
      );

      if (response.documents.length > 0) {
        const enrollment = response.documents[0] as unknown as Enrollment;

        // Update enrollment status
        await databases.updateDocument(
          config.databaseId,
          config.enrollmentsCollectionId,
          enrollment.$id,
          {
            status: status === 'succeeded' ? 'active' : 'failed',
          }
        );
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  },

  // Apply promo code to get discount
  async applyPromoCode(code: string, courseId: string): Promise<{ valid: boolean; discountPercent?: number }> {
    try {
      // In a real application, you would have a promo_codes collection
      // Here we're hard-coding a few codes for demo purposes
      const promoCodes = {
        'WELCOME10': { valid: true, discountPercent: 10 },
        'MOTION25': { valid: true, discountPercent: 25 },
        'DESIGN50': { valid: true, discountPercent: 50 },
      };

      return promoCodes[code as keyof typeof promoCodes] || { valid: false };
    } catch (error) {
      console.error('Error applying promo code:', error);
      throw error;
    }
  },
};
