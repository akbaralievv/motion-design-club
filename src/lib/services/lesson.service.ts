import { databases } from '@/lib/appwrite';
import { Query } from 'appwrite';
import type { Models } from 'appwrite';

export interface Lesson extends Models.Document {
  courseId: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number; // в секундах
  order: number; // порядок урока в курсе
  isFree: boolean; // бесплатный ли урок
  youtubeUrl?: string;
  resources?: string[];
}

class LessonService {
  private readonly databaseId = 'moution-design-club_database';
  private readonly lessonsCollectionId = 'lessons';

  async getLessonsByCourseId(courseId: string): Promise<Lesson[]> {
    try {
      const response = await databases.listDocuments(this.databaseId, this.lessonsCollectionId, [
        Query.equal('courseId', courseId),
        Query.orderAsc('order'),
      ]);

      return response.documents as unknown as Lesson[];
    } catch (error) {
      console.error('Error fetching lessons:', error);
      return [];
    }
  }

  async getLessonById(lessonId: string): Promise<Lesson | null> {
    try {
      const lesson = await databases.getDocument(
        this.databaseId,
        this.lessonsCollectionId,
        lessonId,
      );

      return lesson as unknown as Lesson;
    } catch (error) {
      console.error('Error fetching lesson:', error);
      return null;
    }
  }
}

export const lessonService = new LessonService();
