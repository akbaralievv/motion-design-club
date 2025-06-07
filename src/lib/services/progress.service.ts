import { Query } from 'appwrite';
import { config, databases } from '@/lib/appwrite';
import type { CourseProgress, LessonProgress } from '@/lib/store/slices/progressSlice';
import { progressStatuses } from '@/lib/constants';

export const progressService = {
  // Get course progress for a user
  async getCourseProgress(userId: string, courseId: string): Promise<CourseProgress | null> {
    try {
      const response = await databases.listDocuments(
        config.databaseId,
        config.progressCollectionId,
        [
          Query.equal('userId', userId),
          Query.equal('courseId', courseId)
        ]
      );

      if (response.documents.length === 0) {
        return null;
      }

      return response.documents[0] as unknown as CourseProgress;
    } catch (error) {
      console.error('Error getting course progress:', error);
      throw error;
    }
  },

  // Get all course progress for a user
  async getAllUserProgress(userId: string): Promise<CourseProgress[]> {
    try {
      const response = await databases.listDocuments(
        config.databaseId,
        config.progressCollectionId,
        [Query.equal('userId', userId)]
      );

      return response.documents as unknown as CourseProgress[];
    } catch (error) {
      console.error('Error getting all user progress:', error);
      throw error;
    }
  },

  // Update lesson progress
  async updateLessonProgress(
    progressId: string,
    lessonId: string,
    status: string,
    watchTimePercentage: number
  ): Promise<CourseProgress> {
    try {
      // Get current progress
      const currentProgress = await databases.getDocument(
        config.databaseId,
        config.progressCollectionId,
        progressId
      ) as unknown as CourseProgress;

      // Find lesson in progress array or create new entry
      const lessonIndex = currentProgress.progress.findIndex(p => p.lessonId === lessonId);
      const updatedProgress: LessonProgress[] = [...currentProgress.progress];

      if (lessonIndex !== -1) {
        // Update existing lesson progress
        updatedProgress[lessonIndex] = {
          ...updatedProgress[lessonIndex],
          status,
          watchTimePercentage,
          ...(status === progressStatuses.COMPLETED && { completedAt: new Date().toISOString() }),
        };
      } else {
        // Add new lesson progress
        updatedProgress.push({
          lessonId,
          status,
          watchTimePercentage,
          ...(status === progressStatuses.COMPLETED && { completedAt: new Date().toISOString() }),
        });
      }

      // Update document
      const updated = await databases.updateDocument(
        config.databaseId,
        config.progressCollectionId,
        progressId,
        {
          progress: updatedProgress,
          lastAccessedAt: new Date().toISOString(),
        }
      );

      return updated as unknown as CourseProgress;
    } catch (error) {
      console.error('Error updating lesson progress:', error);
      throw error;
    }
  },

  // Mark course as completed
  async markCourseAsCompleted(progressId: string): Promise<CourseProgress> {
    try {
      const updated = await databases.updateDocument(
        config.databaseId,
        config.progressCollectionId,
        progressId,
        {
          completedAt: new Date().toISOString(),
        }
      );

      return updated as unknown as CourseProgress;
    } catch (error) {
      console.error('Error marking course as completed:', error);
      throw error;
    }
  },

  // Get completion percentage for a course
  getCompletionPercentage(progress: CourseProgress, totalLessons: number): number {
    if (!progress || !progress.progress || totalLessons === 0) {
      return 0;
    }

    const completedLessons = progress.progress.filter(
      (lesson) => lesson.status === progressStatuses.COMPLETED
    ).length;

    return Math.round((completedLessons / totalLessons) * 100);
  },

  // Check if a lesson is completed
  isLessonCompleted(progress: CourseProgress | null, lessonId: string): boolean {
    if (!progress || !progress.progress) {
      return false;
    }

    const lessonProgress = progress.progress.find((p) => p.lessonId === lessonId);
    return lessonProgress?.status === progressStatuses.COMPLETED;
  },

  // Get next lesson to watch
  getNextLesson(progress: CourseProgress | null, lessons: string[]): string | null {
    if (!progress || !progress.progress || lessons.length === 0) {
      return lessons[0];
    }

    // Create a map of completed lessons
    const completedMap = new Map();
    progress.progress.forEach((p) => {
      if (p.status === progressStatuses.COMPLETED) {
        completedMap.set(p.lessonId, true);
      }
    });

    // Find first uncompleted lesson
    for (const lessonId of lessons) {
      if (!completedMap.has(lessonId)) {
        return lessonId;
      }
    }

    // If all lessons are completed, return the last one
    return lessons[lessons.length - 1];
  },
};
