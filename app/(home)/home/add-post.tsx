import GradientBackground from '@/components/ui/gradient-background';
import { Fonts } from '@/constants/theme';
import { auth, database, storage } from '@/firebase.config';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { get, push, ref, remove, set } from 'firebase/database';
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const AddPostScreen: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const captionInputRef = useRef<TextInput>(null);

  // Check for post id from database or params and load post data
  useEffect(() => {
    const loadPostForEdit = async () => {
      const user = auth.currentUser;
      if (!user) return;

      let postId: string | null = null;

      // Check URL param first
      if (id) {
        postId = id as string;
      } else {
        // Check database for selectedPostId
        try {
          const navigationStateRef = ref(database, `users/${user.uid}/navigationState/selectedPostId`);
          const snapshot = await get(navigationStateRef);
          if (snapshot.exists()) {
            postId = snapshot.val();
          }
        } catch (error) {
          console.error('Error checking navigation state:', error);
        }
      }

      if (postId) {
        setIsLoading(true);
        try {
          console.log('🟡 ADD POST: Loading post with ID:', postId);
          
          // Try to load from user's my-post first
          const userPostRef = ref(database, `users/${user.uid}/my-post`);
          const userPostSnapshot = await get(userPostRef);
          
          let postData = null;
          let foundKey = null;
          
          if (userPostSnapshot.exists()) {
            const posts = userPostSnapshot.val();
            console.log('🟡 ADD POST: Found posts in user my-post:', Object.keys(posts));
            
            // Find the post with matching id - check postId field first, then globalPostId, then the key
            const postEntry = Object.entries(posts).find(([key, post]: [string, any]) => {
              const matches = post.postId === postId || post.globalPostId === postId || key === postId;
              if (matches) {
                console.log('🟡 ADD POST: Found matching post entry:', { key, postData: post });
              }
              return matches;
            });
            
            if (postEntry) {
              foundKey = postEntry[0];
              postData = postEntry[1] as any;
              console.log('🟡 ADD POST: Raw post data:', JSON.stringify(postData, null, 2));
              console.log('🟡 ADD POST: Post data fields:', { 
                caption: postData?.caption, 
                imageUrl: postData?.imageUrl,
                hasCaption: 'caption' in postData,
                hasImageUrl: 'imageUrl' in postData,
                allKeys: Object.keys(postData || {})
              });
            }
          }

          // If we found a key but data seems incomplete, try fetching directly
          if (foundKey && (!postData?.caption && !postData?.imageUrl)) {
            console.log('🟡 ADD POST: Data incomplete, fetching directly with key:', foundKey);
            const directPostRef = ref(database, `users/${user.uid}/my-post/${foundKey}`);
            const directPostSnapshot = await get(directPostRef);
            if (directPostSnapshot.exists()) {
              postData = directPostSnapshot.val();
              console.log('🟡 ADD POST: Direct fetch result:', JSON.stringify(postData, null, 2));
            }
          }

          // Always try global Posts with the postId (this is likely where the full data is)
          console.log('🟡 ADD POST: Trying global Posts with postId:', postId);
          const globalPostRef = ref(database, `Posts/${postId}`);
          const globalPostSnapshot = await get(globalPostRef);
          if (globalPostSnapshot.exists()) {
            const globalPostData = globalPostSnapshot.val();
            console.log('🟡 ADD POST: Global post data:', JSON.stringify(globalPostData, null, 2));
            // Use global post data if it has the fields we need
            if (globalPostData.caption || globalPostData.imageUrl) {
              postData = globalPostData;
              console.log('🟡 ADD POST: Using global post data:', { caption: postData.caption, imageUrl: postData.imageUrl });
            } else if (postData) {
              // Merge global data with user post data
              postData = { ...postData, ...globalPostData };
              console.log('🟡 ADD POST: Merged post data:', { caption: postData.caption, imageUrl: postData.imageUrl });
            } else {
              postData = globalPostData;
            }
          } else {
            console.log('🟡 ADD POST: Post not found in global Posts with ID:', postId);
          }

          if (postData) {
            setEditingPostId(postId);
            setCaption(postData.caption || '');
            setSelectedImage(postData.imageUrl || null);
            console.log('🟡 ADD POST: Set form data - caption:', postData.caption, 'imageUrl:', postData.imageUrl);
          } else {
            console.log('🟡 ADD POST: No post data found for ID:', postId);
          }
        } catch (error) {
          console.error('Error loading post:', error);
        } finally {
          setIsLoading(false);
        }
      }

      // Clear navigation state after 1 second (like class-details does)
      const clearNavigationState = async () => {
        try {
          if (!user) return;
          const navigationStateRef = ref(database, `users/${user.uid}/navigationState/selectedPostId`);
          const snapshot = await get(navigationStateRef);
          if (snapshot.exists()) {
            await remove(navigationStateRef);
            console.log('🟡 ADD POST: Cleared selectedPostId from database after 1 second');
          }
        } catch (error) {
          console.error('Error clearing navigation state:', error);
        }
      };

      const timeoutId = setTimeout(() => {
        clearNavigationState();
      }, 1000);

      return () => {
        clearTimeout(timeoutId);
      };
    };

    loadPostForEdit();
  }, [id]);

  const handleBackPress = () => {
    router.back();
  };

  const handleImagePicker = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant permission to access your photos.');
        return;
      }

      // Pick image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const uploadImageToStorage = async (imageUri: string): Promise<string> => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      // Convert image to JPEG format
      const manipulatedImage = await manipulateAsync(
        imageUri,
        [],
        {
          compress: 0.8,
          format: SaveFormat.JPEG,
        }
      );

      // Fetch the converted JPEG image
      const response = await fetch(manipulatedImage.uri);
      const blob = await response.blob();

      // Create a unique filename with timestamp
      const timestamp = Date.now();
      const filename = `post_${timestamp}.jpg`;
      
      // Create storage reference
      const imageRef = storageRef(storage, `posts/${user.uid}/${filename}`);

      // Upload the image
      await uploadBytes(imageRef, blob);

      // Get the download URL
      const downloadURL = await getDownloadURL(imageRef);

      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  };

  const handlePost = async () => {
    const user = auth.currentUser;
    
    if (!user) {
      Alert.alert('Error', 'Please sign in to post');
      return;
    }

    if (!selectedImage) {
      Alert.alert('Error', 'Please select an image');
      return;
    }

    setIsUploading(true);

    try {
      // Upload image to Firebase Storage
      const imageUrl = await uploadImageToStorage(selectedImage);

      // Get user profile data
      const userProfileRef = ref(database, `users/${user.uid}/personalInfo`);
      const userSnapshot = await get(userProfileRef);
      const userProfile = userSnapshot.val();
      
      const userName = userProfile?.fullName || user.displayName || 'User';
      const userProfilePicture = userProfile?.profilePicture || userProfile?.profileImageUri || '';

      if (editingPostId) {
        // Update existing post
        const postData = {
          userId: user.uid,
          userName,
          userProfilePicture,
          imageUrl,
          caption: caption.trim(),
          updatedAt: new Date().toISOString(),
        };

        // Find the user's post entry to get the local id
        const userPostsRef = ref(database, `users/${user.uid}/my-post`);
        const userPostsSnapshot = await get(userPostsRef);
        let userPostLocalId = null;
        
        if (userPostsSnapshot.exists()) {
          const posts = userPostsSnapshot.val();
          const postEntry = Object.entries(posts).find(([key, post]: [string, any]) => 
            (post.postId || post.id || key) === editingPostId
          );
          if (postEntry) {
            userPostLocalId = postEntry[0];
          }
        }

        // Update global Posts node
        const globalPostRef = ref(database, `Posts/${editingPostId}`);
        const globalPostSnapshot = await get(globalPostRef);
        if (globalPostSnapshot.exists()) {
          const existingData = globalPostSnapshot.val();
          await set(globalPostRef, {
            ...existingData,
            ...postData,
          });
        }

        // Update user's my-post node
        if (userPostLocalId) {
          const userPostRef = ref(database, `users/${user.uid}/my-post/${userPostLocalId}`);
          const userPostSnapshot = await get(userPostRef);
          if (userPostSnapshot.exists()) {
            const existingData = userPostSnapshot.val();
            await set(userPostRef, {
              ...existingData,
              ...postData,
            });
          }
        }

        setIsUploading(false);
        Alert.alert('Success', 'Post updated successfully!', [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]);
      } else {
        // Create new post
        const postData = {
          userId: user.uid,
          userName,
          userProfilePicture,
          imageUrl,
          caption: caption.trim(),
          likes: 0,
          comments: 0,
          createdAt: new Date().toISOString(),
          timestamp: Date.now(),
        };

        // Save to global Posts node
        const globalPostsRef = ref(database, 'Posts');
        const newGlobalPostRef = push(globalPostsRef);
        const globalPostData = {
          ...postData,
          postId: newGlobalPostRef.key,
        };
        await set(newGlobalPostRef, globalPostData);

        // Save to user's my-post node
        const userPostsRef = ref(database, `users/${user.uid}/my-post`);
        const newUserPostRef = push(userPostsRef);
        const userPostData = {
          ...postData,
          postId: newGlobalPostRef.key,
          globalPostId: newGlobalPostRef.key,
        };
        await set(newUserPostRef, userPostData);

        setIsUploading(false);
        Alert.alert('Success', 'Post published successfully!', [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]);
      }
    } catch (error) {
      console.error('Error posting:', error);
      setIsUploading(false);
      Alert.alert('Error', 'Failed to publish post. Please try again.');
    }
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={handleBackPress}>
            <Image
              source={require('@/assets/images/chevron-left.png')}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </Pressable>
          <Text style={styles.headerTitle}>{editingPostId ? 'Edit Post' : 'Create Post'}</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Content */}
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#C708F7" />
              <Text style={styles.loadingText}>Loading post...</Text>
            </View>
          ) : (
          <ScrollView
            ref={scrollViewRef}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Image Picker */}
            <Pressable style={styles.imagePickerContainer} onPress={handleImagePicker}>
              {selectedImage ? (
                <Image
                  source={{ uri: selectedImage }}
                  style={styles.selectedImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Image
                    source={require('@/assets/images/upload1.png')}
                    style={styles.placeholderIcon}
                    resizeMode="contain"
                  />
                  <Text style={styles.placeholderText}>Tap to select image</Text>
                </View>
              )}
            </Pressable>

            {/* Caption Input */}
            <View style={styles.captionContainer}>
              <Text style={styles.captionLabel}>Caption</Text>
              <TextInput
                ref={captionInputRef}
                style={styles.captionInput}
                placeholder="Write a caption..."
                placeholderTextColor="#999999"
                value={caption}
                onChangeText={setCaption}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                onFocus={() => {
                  setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true });
                  }, 100);
                }}
              />
            </View>

            {/* Post Button */}
            <Pressable
              style={styles.postButtonContainer}
              onPress={handlePost}
              disabled={!selectedImage || isUploading}
            >
              <LinearGradient
                colors={(!selectedImage || isUploading) 
                  ? ['#CCCCCC', '#999999', '#CCCCCC'] 
                  : ['#F708F7', '#C708F7', '#F76B0B']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.postButton}
              >
                {isUploading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.postButtonText}>Post</Text>
                )}
              </LinearGradient>
            </Pressable>
          </ScrollView>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingBottom: -40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'transparent',
  },
  backButton: {
    width: 24,
    height: 24,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 24,
    height: 24,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom:20,
  },
  imagePickerContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    minHeight: 300,
  },
  selectedImage: {
    width: '100%',
    height: 400,
  },
  imagePlaceholder: {
    width: '100%',
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  placeholderIcon: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },
  placeholderText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: '#999999',
  },
  captionContainer: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  captionLabel: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  captionInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#000000',
    minHeight: 120,
    textAlignVertical: 'top',
  },
  postButtonContainer: {
    marginHorizontal: 20,
    marginTop: 30,
    borderRadius: 100,
    overflow: 'hidden',
  },
  postButton: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    borderRadius: 100,
  },
  postButtonText: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: '#FFFFFF',
  },
});

export default AddPostScreen;

