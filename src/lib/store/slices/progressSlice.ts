import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Models } from 'appwrite';
import { progressStatuses } from '@/lib/constants';

export interface LessonProgress {
  lessonId: string;
  status: string;
  completedAt?: string;
  watchTimePercentage: number;
}

export interface CourseProgress extends Models.Document {
  userId: string;
  courseId: string;
  progress: LessonProgress[];
  enrollmentStatus: string;
  startedAt: string;
  completedAt?: string;
  lastAccessedAt: string;
  certificate?: string;
}

export interface ProgressState {
  userCourseProgress: CourseProgress[];
  currentCourseProgress: CourseProgress | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProgressState = {
  userCourseProgress: [],
  currentCourseProgress: null,
  isLoading: false,
  error: null,
};

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    setProgressLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setUserCourseProgress: (state, action: PayloadAction<CourseProgress[]>) => {
      state.userCourseProgress = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setCurrentCourseProgress: (state, action: PayloadAction<CourseProgress | null>) => {
      state.currentCourseProgress = action.payload;
      state.isLoading = false;
    },
    updateLessonProgress: (state, action: PayloadAction<{ lessonId: string; status: string; watchTimePercentage: number }>) => {
      const { lessonId, status, watchTimePercentage } = action.payload;
      if (state.currentCourseProgress) {
        const lessonIndex = state.currentCourseProgress.progress.findIndex(
          (lesson) => lesson.lessonId === lessonId
        );

        if (lessonIndex !== -1) {
          state.currentCourseProgress.progress[lessonIndex] = {
            ...state.currentCourseProgress.progress[lessonIndex],
            status,
            watchTimePercentage,
            ...(status === progressStatuses.COMPLETED && { completedAt: new Date().toISOString() }),
          };
        } else {
          state.currentCourseProgress.progress.push({
            lessonId,
            status,
            watchTimePercentage,
            ...(status === progressStatuses.COMPLETED && { completedAt: new Date().toISOString() }),
          });
        }

        state.currentCourseProgress.lastAccessedAt = new Date().toISOString();
      }
    },
    setProgressError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const {
  setProgressLoading,
  setUserCourseProgress,
  setCurrentCourseProgress,
  updateLessonProgress,
  setProgressError,
} = progressSlice.actions;

export default progressSlice.reducer;
