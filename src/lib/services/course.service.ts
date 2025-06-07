import { ID, Query } from 'appwrite';
import { config, databases, storage } from '@/lib/appwrite';
import { createSlug } from '@/lib/appwrite';
import type { Course, Lesson } from '@/lib/store/slices/courseSlice';
import { courseStatuses } from '@/lib/constants';
import { mockCourses, mockLessons } from '@/lib/mock-data';

export interface CourseFilters {
  category?: string;
  searchQuery?: string;
  limit?: number;
}

class CourseService {
  private readonly databaseId = 'moution-design-club_database';
  private readonly coursesCollectionId = 'courses';

  async getPublishedCourses(): Promise<Course[]> {
    try {
      const response = await databases.listDocuments(this.databaseId, this.coursesCollectionId, [
        Query.equal('status', courseStatuses.PUBLISHED),
      ]);

      return response.documents as unknown as Course[];
    } catch (error) {
      console.error('Error getting published courses:', error);
      return [];
    }
  }

  async getCourses({ category, searchQuery, limit = 12 }: CourseFilters = {}): Promise<Course[]> {
    try {
      const queries = [
        // Apply limit
        Query.limit(limit),
      ];

      // Apply category filter if specified
      if (category && category !== 'all') {
        queries.push(Query.equal('category', category));
      }

      // Apply search query if specified
      if (searchQuery) {
        // Search in both title and description using contains
        queries.push(
          Query.contains('title', searchQuery.toLowerCase()),
          Query.contains('description', searchQuery.toLowerCase()),
        );
      }

      const response = await databases.listDocuments(
        this.databaseId,
        this.coursesCollectionId,
        queries,
      );
      return response.documents as unknown as Course[];
    } catch (error) {
      console.error('Error fetching courses:', error);
      return [];
    }
  }

  async getCourseBySlug(slug: string): Promise<Course | null> {
    try {
      const response = await databases.listDocuments(this.databaseId, this.coursesCollectionId, [
        Query.equal('slug', slug),
        Query.equal('status', courseStatuses.PUBLISHED),
      ]);

      return (response.documents[0] as unknown as Course) || null;
    } catch (error) {
      console.error('Error fetching course by slug:', error);
      return null;
    }
  }

  async getCourseLessons(courseId: string) {
    try {
      const response = await databases.listDocuments(this.databaseId, 'lessons', [
        Query.equal('courseId', courseId),
        Query.orderAsc('order'),
      ]);

      return response.documents;
    } catch (error) {
      console.error('Error fetching course lessons:', error);
      return [];
    }
  }
}

export const courseService = new CourseService();
