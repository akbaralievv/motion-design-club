import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Models } from 'appwrite';

export interface Lesson extends Models.Document {
  title: string;
  description: string;
  courseId: string;
  order: number;
  videoUrl?: string;
  duration: number; // in seconds
  thumbnail?: string;
  resources?: string[]; // Links to supplementary materials
}

export interface Course extends Models.Document {
  title: string;
  slug: string;
  description: string;
  price: number;
  thumbnail: string;
  category: string;
  status: string;
  instructorId: string;
  instructorName: string;
  lessonsCount: number;
  totalDuration: number; // in seconds
  createdAt: string;
  updatedAt: string;
}

export interface CoursesState {
  courses: Course[];
  featuredCourses: Course[];
  currentCourse: Course | null;
  courseLessons: Lesson[];
  currentLesson: Lesson | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CoursesState = {
  courses: [],
  featuredCourses: [],
  currentCourse: null,
  courseLessons: [],
  currentLesson: null,
  isLoading: false,
  error: null,
};

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    setCoursesLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setCourses: (state, action: PayloadAction<Course[]>) => {
      state.courses = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setFeaturedCourses: (state, action: PayloadAction<Course[]>) => {
      state.featuredCourses = action.payload;
    },
    setCurrentCourse: (state, action: PayloadAction<Course | null>) => {
      state.currentCourse = action.payload;
    },
    setCourseLessons: (state, action: PayloadAction<Lesson[]>) => {
      state.courseLessons = action.payload;
    },
    setCurrentLesson: (state, action: PayloadAction<Lesson | null>) => {
      state.currentLesson = action.payload;
    },
    setCourseError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    addCourse: (state, action: PayloadAction<Course>) => {
      state.courses.push(action.payload);
    },
    updateCourse: (state, action: PayloadAction<Course>) => {
      const index = state.courses.findIndex((course) => course.$id === action.payload.$id);
      if (index !== -1) {
        state.courses[index] = action.payload;
      }
      if (state.currentCourse && state.currentCourse.$id === action.payload.$id) {
        state.currentCourse = action.payload;
      }
    },
    deleteCourse: (state, action: PayloadAction<string>) => {
      state.courses = state.courses.filter((course) => course.$id !== action.payload);
      if (state.currentCourse && state.currentCourse.$id === action.payload) {
        state.currentCourse = null;
      }
    },
  },
});

export const {
  setCoursesLoading,
  setCourses,
  setFeaturedCourses,
  setCurrentCourse,
  setCourseLessons,
  setCurrentLesson,
  setCourseError,
  addCourse,
  updateCourse,
  deleteCourse,
} = courseSlice.actions;

export default courseSlice.reducer;
