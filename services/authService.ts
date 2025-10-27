import { auth, database } from '@/firebase.config';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';
// import * as AppleAuthentication from 'expo-apple-authentication';
import {
  // GoogleAuthProvider,
  // OAuthProvider,
  // signInWithCredential,
  User
} from 'firebase/auth';
import { get, ref, set } from 'firebase/database';
// import { Platform } from 'react-native';

// Configure Google Sign-In - COMMENTED OUT FOR EXPO GO
// GoogleSignin.configure({
//   webClientId: '664608614063-r425jt0fab9d9j44an2da6mdm107teqj.apps.googleusercontent.com', // From Firebase Console
//   iosClientId: '664608614063-oi9ds2sqein313gq0rjr9ihs2odnuc29.apps.googleusercontent.com', // From Firebase Console
//   offlineAccess: true,
//   hostedDomain: '',
//   forceCodeForRefreshToken: true,
//   scopes: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
// });

// Configure WebBrowser for better integration
// Note: This method may not be available in all versions
// The external browser behavior is intentional and secure

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
  isNewUser?: boolean;
}

export class AuthService {
  /**
   * Sign in with Google using native Google Sign-In
   */
  // COMMENTED OUT FOR EXPO GO - Google Sign-In not supported
  // static async signInWithGoogle(): Promise<AuthResult> {
  //   return {
  //     success: false,
  //     error: 'Google Sign-In is not available in Expo Go. Please use email/password authentication.',
  //   };
  // }

  /**
   * Sign in with Google using WebBrowser (alternative method) - COMMENTED OUT FOR EXPO GO
   */
  // static async signInWithGoogleWebBrowser(): Promise<AuthResult> {
  //   return {
  //     success: false,
  //     error: 'Google Sign-In is not available in Expo Go. Please use email/password authentication.',
  //   };
  // }

  /**
   * Sign in with Apple
   */
  // COMMENTED OUT FOR EXPO GO - Apple Sign-In not supported
  // static async signInWithApple(): Promise<AuthResult> {
  //   return {
  //     success: false,
  //     error: 'Apple Sign-In is not available in Expo Go. Please use email/password authentication.',
  //   };
  // }

  /**
   * Sign out from all providers
   */
  static async signOut(): Promise<void> {
    try {
      // Sign out from Google if signed in - COMMENTED OUT FOR EXPO GO
      // try {
      //   await GoogleSignin.signOut();
      // } catch (error) {
      //   console.log('Google sign out error:', error);
      // }
      
      // Sign out from Firebase
      await auth.signOut();
    } catch (error) {
      console.log('Sign out error:', error);
      throw error;
    }
  }

  /**
   * Save user information to Firebase Realtime Database
   */
  static async saveUserToDatabase(
    user: User, 
    additionalInfo: {
      fullName: string;
      email: string;
      profilePicture: string;
    }
  ): Promise<void> {
    try {
      const userRef = ref(database, `users/${user.uid}/personalInfo`);
      
      // Check if user already exists in database
      const snapshot = await get(userRef);
      const existingData = snapshot.val();
      
      if (existingData) {
        // Update existing user data, preserving important fields
        await set(userRef, {
          ...existingData, // Keep existing data
          fullName: additionalInfo.fullName,
          email: additionalInfo.email.toLowerCase().trim(),
          profilePicture: additionalInfo.profilePicture,
          uid: user.uid,
          provider: user.providerData[0]?.providerId || 'unknown',
          lastSignIn: new Date().toISOString(), // Track last sign-in
        });
      } else {
        // Create new user data
        await set(userRef, {
          fullName: additionalInfo.fullName,
          email: additionalInfo.email.toLowerCase().trim(),
          profilePicture: additionalInfo.profilePicture,
          createdAt: new Date().toISOString(),
          uid: user.uid,
          userType: 'dancer', // Default to dancer, can be changed later
          provider: user.providerData[0]?.providerId || 'unknown',
          lastSignIn: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.log('Error saving user to database:', error);
      throw error;
    }
  }

  /**
   * Check if user exists in database
   */
  static async userExistsInDatabase(uid: string): Promise<boolean> {
    try {
      console.log('🍎 Checking if user exists for UID:', uid);
      const userRef = ref(database, `users/${uid}`);
      const snapshot = await get(userRef);
      const userData = snapshot.val();
      const exists = userData !== null;
      console.log('🍎 User exists in database:', exists);
      if (exists) {
        console.log('🍎 User data found:', userData);
      }
      return exists;
    } catch (error) {
      console.log('🍎 Error checking if user exists:', error);
      return false;
    }
  }

  /**
   * Get user type from database
   */
  static async getUserType(uid: string): Promise<string | null> {
    try {
      console.log('🍎 Getting user type for UID:', uid);
      const userRef = ref(database, `users/${uid}/personalInfo/userType`);
      const snapshot = await get(userRef);
      const userType = snapshot.val();
      console.log('🍎 User type from database:', userType);
      return userType;
    } catch (error) {
      console.log('🍎 Error getting user type:', error);
      return null;
    }
  }

  /**
   * Get navigation route based on user type
   * @param uid - User ID
   * @returns Navigation route based on user type (admin, instructor, or dancer/home)
   */
  static async getNavigationRouteForUser(uid: string): Promise<string> {
    try {
      const userType = await this.getUserType(uid);
      
      console.log('📍 Determining navigation route for user type:', userType);
      
      // Route based on user type
      if (userType === 'Admin') {
        return '/(admin)';
      } else if (userType === 'instructor') {
        return '/(instructor)/home';
      } else {
        // Default to dancer/home for any other type (including 'dancer', null, or undefined)
        return '/(home)/home';
      }
    } catch (error) {
      console.log('📍 Error determining navigation route, falling back to home:', error);
      // Fallback to home on error
      return '/(home)/home';
    }
  }

  /**
   * Get user data from database
   */
  static async getUserDataFromDatabase(uid: string): Promise<any | null> {
    try {
      console.log('🔍 Getting user data for UID:', uid);
      const userRef = ref(database, `users/${uid}/personalInfo`);
      const snapshot = await get(userRef);
      const userData = snapshot.val();
      console.log('🔍 User data from database:', userData);
      return userData;
    } catch (error) {
      console.log('🔍 Error getting user data:', error);
      return null;
    }
  }

  /**
   * Delete user data from database (for testing purposes)
   */
  static async deleteUserData(uid: string): Promise<void> {
    try {
      console.log('🍎 Deleting user data for UID:', uid);
      const userRef = ref(database, `users/${uid}`);
      await set(userRef, null);
      console.log('🍎 User data deleted successfully');
    } catch (error) {
      console.log('🍎 Error deleting user data:', error);
      throw error;
    }
  }
}
