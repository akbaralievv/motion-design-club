export const siteConfig = {
  name: 'Motion Design Club',
  description: 'Learn motion design fundamentals with hands-on courses and expert instruction.',
  url: 'https://motion-design-academy.com',
  ogImage: 'https://motion-design-academy.com/og.jpg',
  links: {
    twitter: 'https://twitter.com/motiondesignacademy',
    github: 'https://github.com/motiondesignacademy',
  },
};

export const courseCategories = [
  { id: 'after-effects', name: 'After Effects Kickstart' },
  { id: 'blender', name: 'Blender for 3D Artists' },
];

export const courseStatuses = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
};

export const userRoles = {
  ADMIN: 'admin',
  STUDENT: 'student',
};

export const progressStatuses = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
};
