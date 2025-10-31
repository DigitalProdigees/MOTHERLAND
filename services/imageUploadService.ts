import { auth, storage } from '@/firebase.config';
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage';

/**
 * Uploads an image to Firebase Storage
 * @param imageUri - Local URI of the image to upload
 * @param path - Storage path where the image should be saved (e.g., 'users/uid/personalInfo')
 * @returns Promise<string> - Download URL of the uploaded image
 */
export const uploadImageToStorage = async (
  imageUri: string,
  path: string
): Promise<string> => {
  try {
    // Fetch the image from local URI
    const response = await fetch(imageUri);
    const blob = await response.blob();

    // Create a unique filename with timestamp
    const timestamp = Date.now();
    const fileExtension = imageUri.split('.').pop() || 'jpg';
    const filename = `profile_${timestamp}.${fileExtension}`;
    
    // Create storage reference
    const imageRef = storageRef(storage, `${path}/${filename}`);

    // Upload the image
    await uploadBytes(imageRef, blob);

    // Get the download URL
    const downloadURL = await getDownloadURL(imageRef);

    console.log('Image uploaded successfully:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image to Firebase Storage:', error);
    throw new Error('Failed to upload image');
  }
};

/**
 * Uploads a profile image for the current user
 * @param imageUri - Local URI of the profile image
 * @returns Promise<string> - Download URL of the uploaded profile image
 */
export const uploadProfileImage = async (imageUri: string): Promise<string> => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }

  const path = `users/${user.uid}/personalInfo`;
  return uploadImageToStorage(imageUri, path);
};

