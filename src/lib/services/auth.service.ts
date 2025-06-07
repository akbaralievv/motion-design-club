import { ID, Query } from 'appwrite';
import { account, avatars, config, databases } from '@/lib/appwrite';
import { userRoles } from '@/lib/constants';
import type { UserProfile } from '@/lib/store/slices/authSlice';

export const authService = {
  // Create a new user account
  async createAccount(email: string, password: string, name: string): Promise<UserProfile> {
    try {
      // Attempt to exit the current session, if there is one
      try {
        await account.deleteSession('current');
      } catch (e) {
        console.warn('No active session to delete (this is okay).');
      }
      // Create account in Appwrite authentication
      const newAccount = await account.create(ID.unique(), email, password, name);

      await account.createEmailPasswordSession(email, password);

      // Generate avatar URL
      const avatarUrl = avatars.getInitials(name);

      // Create user profile in database
      const newUser = await databases.createDocument(
        config.databaseId,
        config.usersCollectionId,
        ID.unique(),
        {
          email,
          name,
          role: userRoles.STUDENT,
          avatarUrl,
          userId: newAccount.$id,
        },
      );

      return newUser as unknown as UserProfile;
    } catch (error) {
      console.error('Error creating account:', error);
      throw error;
    }
  },

  // Login with email and password
  async login(email: string, password: string): Promise<void> {
    try {
      await account.createEmailPasswordSession(email, password);
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  // Logout user
  async logout(): Promise<void> {
    try {
      await account.deleteSession('current');
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  },

  // Get current user session
  async getCurrentUser(): Promise<UserProfile | null> {
    try {
      // Get session info
      const session = await account.get();
      // If user is logged in, get user profile from database
      if (session) {
        const users = await databases.listDocuments(config.databaseId, config.usersCollectionId, [
          Query.equal('email', session.email),
        ]);

        if (users.documents.length > 0) {
          return users.documents[0] as unknown as UserProfile;
        }
      }

      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  // Update user profile
  async updateProfile(userId: string, data: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const updatedUser = await databases.updateDocument(
        config.databaseId,
        config.usersCollectionId,
        userId,
        data,
      );

      return updatedUser as unknown as UserProfile;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  // Send password reset email
  async resetPassword(email: string): Promise<void> {
    try {
      await account.createRecovery(email, 'https://motiondesignacademy.com/reset-password');
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  },

  // Verify email
  async verifyEmail(): Promise<void> {
    try {
      const session = await account.get();
      await account.createVerification('https://motiondesignacademy.com/verify-email');
    } catch (error) {
      console.error('Error verifying email:', error);
      throw error;
    }
  },

  // Update user password
  async updatePassword(password: string, oldPassword: string): Promise<void> {
    try {
      await account.updatePassword(password, oldPassword);
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  },
};
