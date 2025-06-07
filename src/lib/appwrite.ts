import { Account, Avatars, Client, Databases, ID, Query, Storage } from 'appwrite';

// Appwrite Project Details
export const config = {
  endpoint: 'https://fra.cloud.appwrite.io/v1',
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '',
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '',
  usersCollectionId: 'users',
  coursesCollectionId: 'courses',
  lessonsCollectionId: 'lessons',
  enrollmentsCollectionId: 'enrollments',
  progressCollectionId: 'progress',
  storageId: process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID || '',
};

// Initialize the Appwrite SDK
let client: Client;
let account: Account;
let databases: Databases;
let storage: Storage;
let avatars: Avatars;

// Initialize the client on the client-side
if (typeof window !== 'undefined') {
  client = new Client().setEndpoint(config.endpoint).setProject(config.projectId);

  account = new Account(client);
  databases = new Databases(client);
  storage = new Storage(client);
  avatars = new Avatars(client);
}

// Helper function to create a unique slug
export const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

export { client, account, databases, storage, avatars, ID, Query };
