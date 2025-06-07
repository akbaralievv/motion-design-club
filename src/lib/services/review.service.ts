import { config, databases } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';

export interface Review {
  $id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  courseId?: string;
  createdAt: string;
}

export interface ReviewFilters {
  rating?: number;
  courseId?: string;
  sortBy?: 'newest' | 'oldest' | 'highest' | 'lowest';
  limit?: number;
}

export const reviewService = {
  // Get reviews with filters
  async getReviews(filters: ReviewFilters = {}): Promise<Review[]> {
    try {
      const queries: string[] = [];

      // Apply rating filter
      if (filters.rating) {
        queries.push(Query.equal('rating', filters.rating));
      }

      // Apply course filter
      if (filters.courseId) {
        queries.push(Query.equal('courseId', filters.courseId));
      }

      // Apply sorting
      switch (filters.sortBy) {
        case 'oldest':
          queries.push(Query.orderAsc('$createdAt'));
          break;
        case 'highest':
          queries.push(Query.orderDesc('rating'));
          break;
        case 'lowest':
          queries.push(Query.orderAsc('rating'));
          break;
        default: // 'newest'
          queries.push(Query.orderDesc('$createdAt'));
      }

      // Apply limit
      queries.push(Query.limit(filters.limit || 10));

      const response = await databases.listDocuments(config.databaseId, 'reviews', queries);
      return response.documents as unknown as Review[];
    } catch (error) {
      console.error('Error getting reviews:', error);
      throw error;
    }
  },

  // Add a new review
  async addReview(review: Omit<Review, '$id' | 'createdAt'>): Promise<Review> {
    try {
      const response = await databases.createDocument(config.databaseId, 'reviews', ID.unique(), {
        ...review,
        createdAt: new Date().toISOString(),
      });
      return response as unknown as Review;
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  },

  // Get average rating for a course
  async getAverageRating(courseId: string): Promise<number> {
    try {
      const response = await databases.listDocuments(config.databaseId, 'reviews', [
        Query.equal('courseId', courseId),
      ]);

      const reviews = response.documents as unknown as Review[];
      if (reviews.length === 0) return 0;

      const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
      return Number((sum / reviews.length).toFixed(1));
    } catch (error) {
      console.error('Error getting average rating:', error);
      throw error;
    }
  },

  // Get rating distribution for a course
  async getRatingDistribution(courseId: string): Promise<Record<number, number>> {
    try {
      const response = await databases.listDocuments(config.databaseId, 'reviews', [
        Query.equal('courseId', courseId),
      ]);

      const reviews = response.documents as unknown as Review[];
      const distribution: Record<number, number> = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      };

      reviews.forEach((review) => {
        distribution[review.rating] = (distribution[review.rating] || 0) + 1;
      });

      return distribution;
    } catch (error) {
      console.error('Error getting rating distribution:', error);
      throw error;
    }
  },

  // Get reviews for a specific course
  async getCourseReviews(courseId: string, limit = 10): Promise<Review[]> {
    try {
      const response = await databases.listDocuments(config.databaseId, 'reviews', [
        Query.equal('courseId', courseId),
        Query.orderDesc('$createdAt'),
        Query.limit(limit),
      ]);
      return response.documents as unknown as Review[];
    } catch (error) {
      console.error('Error getting course reviews:', error);
      throw error;
    }
  },
};
