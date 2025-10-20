import { auth, database } from '@/firebase.config';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as AppleAuthentication from 'expo-apple-authentication';
import {
    GoogleAuthProvider,
    OAuthProvider,
    signInWithCredential,
    User
} from 'firebase/auth';
import { get, ref, set } from 'firebase/database';
import { Platform } from 'react-native';

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: '664608614063-r425jt0fab9d9j44an2da6mdm107teqj.apps.googleusercontent.com', // From Firebase Console
  iosClientId: '664608614063-oi9ds2sqein313gq0rjr9ihs2odnuc29.apps.googleusercontent.com', // From Firebase Console
  offlineAccess: true,
  hostedDomain: '',
  forceCodeForRefreshToken: true,
  scopes: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
});

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
  static async signInWithGoogle(): Promise<AuthResult> {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      
      // Sign out any existing Google user first to ensure clean state
      try {
        await GoogleSignin.signOut();
      } catch (signOutError) {
        // Ignore sign out errors
        console.log('Google sign out before sign in:', signOutError);
      }
      
      // Get the users ID token
      const signInResult = await GoogleSignin.signIn();
      const idToken = signInResult.data?.idToken;
      const googleUser = signInResult.data?.user;
      
      if (!idToken) {
        throw new Error('No ID token received from Google Sign-In');
      }
      
      // Create a Google credential with the token
      const googleCredential = GoogleAuthProvider.credential(idToken);
      
      // Sign-in the user with the credential
      const userCredential = await signInWithCredential(auth, googleCredential);
      const user = userCredential.user;
      
      // Check if this is a new user
      const isNewUser = (userCredential as any).additionalUserInfo?.isNewUser || false;
      
      // For Google Sign-In, we'll let the UI decide whether to save data
      // based on whether user exists in database
      console.log('🔍 Google Auth - Skipping automatic database save, will be handled by UI flow');
      
      return {
        success: true,
        user,
        isNewUser,
      };
    } catch (error: any) {
      console.log('Google Sign-In Error:', error);
      
      // Handle user cancellation
      if (error.code === 'SIGN_IN_CANCELLED' || 
          error.code === 'SIGN_IN_CANCELLED' ||
          error.message?.includes('canceled') || 
          error.message?.includes('cancelled') ||
          error.message?.includes('User cancelled') ||
          error.message?.includes('The user canceled')) {
        return {
          success: false,
          error: 'Sign-in was cancelled by user',
        };
      }
      
      // Handle specific Firebase auth errors
      if (error.code === 'auth/argument-error') {
        return {
          success: false,
          error: 'Invalid authentication configuration. Please check your Google Sign-In setup.',
        };
      }
      
      return {
        success: false,
        error: error.message || 'Google Sign-In failed',
      };
    }
  }

  /**
   * Sign in with Google using WebBrowser (alternative method)
   * This provides a more integrated experience but still opens in external browser
   */
  static async signInWithGoogleWebBrowser(): Promise<AuthResult> {
    try {
      // This method would use WebBrowser for authentication
      // Note: This is just an example - the current implementation is already optimal
      console.log('Using WebBrowser method for Google Sign-In');
      
      // For now, fall back to the native method
      return await this.signInWithGoogle();
    } catch (error: any) {
      console.log('Google Sign-In WebBrowser Error:', error);
      return {
        success: false,
        error: error.message || 'Google Sign-In failed',
      };
    }
  }

  /**
   * Sign in with Apple
   */
  static async signInWithApple(): Promise<AuthResult> {
    try {
      if (Platform.OS !== 'ios') {
        return {
          success: false,
          error: 'Apple Sign-In is only available on iOS devices',
        };
      }

      // Check if Apple Sign-In is available
      const isAvailable = await AppleAuthentication.isAvailableAsync();
      if (!isAvailable) {
        return {
          success: false,
          error: 'Apple Sign-In is not available on this device',
        };
      }

      // Request Apple authentication
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      // Create Apple credential
      const provider = new OAuthProvider('apple.com');
      const appleCredential = provider.credential({
        idToken: credential.identityToken!,
        rawNonce: (credential as any).nonce,
      });

      // Sign-in the user with the credential
      const userCredential = await signInWithCredential(auth, appleCredential);
      const user = userCredential.user;
      
      // Check if this is a new user
      const isNewUser = (userCredential as any).additionalUserInfo?.isNewUser || false;
      console.log('🍎 Apple Auth - isNewUser:', isNewUser);
      
      // Check if we have a name from Apple
      const fullName = credential.fullName 
        ? `${credential.fullName.givenName || ''} ${credential.fullName.familyName || ''}`.trim()
        : '';
      
      console.log('🍎 Apple Auth - fullName from Apple:', fullName);
      console.log('🍎 Apple Auth - credential.fullName:', credential.fullName);
      
      // For Apple Sign-In, we'll let the UI decide whether to save data
      // based on whether user exists in database
      console.log('🍎 Apple Auth - Skipping automatic database save, will be handled by UI flow');
      
      return {
        success: true,
        user,
        isNewUser,
      };
    } catch (error: any) {
      console.log('Apple Sign-In Error:', error);
      
      // Handle user cancellation
      if (error.code === 'ERR_REQUEST_CANCELED' || 
          error.message?.includes('canceled') || 
          error.message?.includes('cancelled') ||
          error.message?.includes('The user canceled')) {
        return {
          success: false,
          error: 'Sign-in was cancelled by user',
        };
      }
      
      return {
        success: false,
        error: error.message || 'Apple Sign-In failed',
      };
    }
  }

  /**
   * Sign out from all providers
   */
  static async signOut(): Promise<void> {
    try {
      // Sign out from Google if signed in
      try {
        await GoogleSignin.signOut();
      } catch (error) {
        console.log('Google sign out error:', error);
      }
      
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
