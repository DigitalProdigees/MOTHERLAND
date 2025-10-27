import Star from '@/assets/svg/Star';
import { Fonts } from '@/constants/theme';
import { auth, database } from '@/firebase.config';
import { get, push, ref, set } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface ReviewModalProps {
  visible: boolean;
  onClose: () => void;
  classId: string;
  className: string;
  onReviewSubmitted?: () => void;
}

export default function ReviewModal({ visible, onClose, classId, className, onReviewSubmitted }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [isCheckingReview, setIsCheckingReview] = useState(true);

  console.log('ReviewModal rendered with visible:', visible, 'className:', className);

  // Check if user has already reviewed this class
  useEffect(() => {
    const checkExistingReview = async () => {
      if (!visible || !classId) {
        setIsCheckingReview(false);
        return;
      }

      try {
        setIsCheckingReview(true);
        const user = auth.currentUser;
        if (!user) {
          setHasReviewed(false);
          setIsCheckingReview(false);
          return;
        }

        const userReviewsRef = ref(database, `users/${user.uid}/reviews`);
        const snapshot = await get(userReviewsRef);

        if (snapshot.exists()) {
          const reviews = snapshot.val();
          // Find the review for this class
          const existingReview = Object.values(reviews).find(
            (review: any) => review.classId === classId
          );

          if (existingReview) {
            const reviewData = existingReview as any;
            setHasReviewed(true);
            setRating(reviewData.rating || 0);
            setDescription(reviewData.description || '');
          } else {
            setHasReviewed(false);
            setRating(0);
            setDescription('');
          }
        } else {
          setHasReviewed(false);
          setRating(0);
          setDescription('');
        }
      } catch (error) {
        console.error('Error checking existing review:', error);
        setHasReviewed(false);
      } finally {
        setIsCheckingReview(false);
      }
    };

    checkExistingReview();
  }, [visible, classId]);

  const handleStarPress = (starIndex: number) => {
    if (!hasReviewed) {
      setRating(starIndex + 1);
    }
  };

  const handleSubmit = async () => {
    // Prevent submission if already reviewed
    if (hasReviewed) {
      Alert.alert('Already Reviewed', 'You have already submitted a review for this class.');
      return;
    }

    if (rating === 0) {
      Alert.alert('Rating Required', 'Please select a star rating before submitting your review.');
      return;
    }

    if (description.trim().length < 10) {
      Alert.alert('Description Required', 'Please write at least 10 characters for your review description.');
      return;
    }

    try {
      setIsSubmitting(true);
      const user = auth.currentUser;
      
      if (!user) {
        Alert.alert('Authentication Required', 'You must be logged in to submit a review.');
        return;
      }

      // Get user's actual name from database
      let actualUserName = 'Anonymous User';
      try {
        const userProfileRef = ref(database, `users/${user.uid}/personalInfo/fullName`);
        const userProfileSnapshot = await get(userProfileRef);
        if (userProfileSnapshot.exists()) {
          actualUserName = userProfileSnapshot.val();
          console.log('Found user name in database:', actualUserName);
        } else {
          console.log('No user name found in database, using Anonymous User');
        }
      } catch (error) {
        console.log('Could not fetch user name from database:', error);
      }

      const reviewData = {
        id: '', // Will be set by Firebase
        classId,
        className,
        userId: user.uid,
        userName: actualUserName,
        userEmail: user.email || '',
        rating,
        description: description.trim(),
        createdAt: new Date().toISOString(),
        timestamp: Date.now(),
      };

      console.log('Submitting review for classId:', classId, 'className:', className);

      // Save to global reviews
      const globalReviewsRef = ref(database, `reviews/${classId}`);
      const newReviewRef = push(globalReviewsRef);
      const reviewId = newReviewRef.key;
      
      if (reviewId) {
        reviewData.id = reviewId;
        await set(newReviewRef, reviewData);

        // Save to user's personal reviews
        const userReviewsRef = ref(database, `users/${user.uid}/reviews/${reviewId}`);
        await set(userReviewsRef, reviewData);

        // Save to instructor's personal listings if class exists there
        await saveToInstructorListings(classId, reviewData);

        // Update class rating in global listings
        await updateClassRating(classId, rating);

        Alert.alert('Success', 'Your review has been submitted successfully!');
        setHasReviewed(true);
        onClose();
        onReviewSubmitted?.();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert('Error', 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateClassRating = async (classId: string, newRating: number) => {
    try {
      // Get current class data
      const classRef = ref(database, `Listings/${classId}`);
      const classSnapshot = await get(classRef);
      
      if (classSnapshot.exists()) {
        const classData = classSnapshot.val();
        const currentRating = classData.rating || 0;
        const currentReviewCount = classData.reviewCount || 0;
        
        // Calculate new average rating based on review count (not subscriber count)
        const newAverageRating = ((currentRating * currentReviewCount) + newRating) / (currentReviewCount + 1);
        const newReviewCount = currentReviewCount + 1;
        
        // Update class rating and review count
        await set(ref(database, `Listings/${classId}/rating`), newAverageRating);
        await set(ref(database, `Listings/${classId}/reviewCount`), newReviewCount);
      }
    } catch (error) {
      console.error('Error updating class rating:', error);
    }
  };

  const saveToInstructorListings = async (classId: string, reviewData: any) => {
    try {
      console.log('Saving review to instructor listings for classId:', classId);
      
      // Get class data to find instructor ID
      const classRef = ref(database, `Listings/${classId}`);
      const classSnapshot = await get(classRef);
      
      if (classSnapshot.exists()) {
        const classData = classSnapshot.val();
        const instructorId = classData.instructorId;
        
        console.log('Found instructor ID:', instructorId);
        
        if (instructorId) {
          // First, try to find the instructor's personal listing using the global listing ID
          const instructorListingsRef = ref(database, `users/${instructorId}/Listings`);
          const instructorListingsSnapshot = await get(instructorListingsRef);
          
          if (instructorListingsSnapshot.exists()) {
            const instructorListings = instructorListingsSnapshot.val();
            
            // Find the matching listing by comparing with global listing data
            let matchingListingId = null;
            for (const [listingId, listingData] of Object.entries(instructorListings)) {
              const listing = listingData as any;
              if (listing.listingId === classId || 
                  (listing.title === classData.title && 
                   listing.instructorId === instructorId)) {
                matchingListingId = listingId;
                break;
              }
            }
            
            if (matchingListingId) {
              console.log('Found matching instructor listing:', matchingListingId);
              
              // Save review to instructor's personal listing
              const instructorReviewsRef = ref(database, `users/${instructorId}/Listings/${matchingListingId}/reviews/${reviewData.id}`);
              await set(instructorReviewsRef, reviewData);
              
              // Update rating in instructor's personal listing
              const instructorClassRef = ref(database, `users/${instructorId}/Listings/${matchingListingId}`);
              const instructorClassSnapshot = await get(instructorClassRef);
              
              if (instructorClassSnapshot.exists()) {
                const instructorClassData = instructorClassSnapshot.val();
                const currentRating = instructorClassData.rating || 0;
                const currentReviewCount = instructorClassData.reviewCount || 0;
                
                const newAverageRating = ((currentRating * currentReviewCount) + reviewData.rating) / (currentReviewCount + 1);
                const newReviewCount = currentReviewCount + 1;
                
                await set(ref(database, `users/${instructorId}/Listings/${matchingListingId}/rating`), newAverageRating);
                await set(ref(database, `users/${instructorId}/Listings/${matchingListingId}/reviewCount`), newReviewCount);
                
                console.log('Updated instructor listing rating:', newAverageRating, 'review count:', newReviewCount);
              }
            } else {
              console.log('No matching instructor listing found for classId:', classId);
            }
          }
        }
      } else {
        console.log('Global listing not found for classId:', classId);
      }
    } catch (error) {
      console.error('Error saving to instructor listings:', error);
    }
  };

  const handleClose = () => {
    setRating(0);
    setDescription('');
    setHasReviewed(false);
    setIsCheckingReview(true);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={handleClose}
    >
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Write a Review</Text>
              <Pressable style={styles.closeButton} onPress={handleClose}>
                <Image
                  source={require('@/assets/images/close.png')}
                  style={styles.closeIcon}
                  resizeMode="contain"
                />
              </Pressable>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              {/* Class Info */}
              <View style={styles.classInfo}>
                <Text style={styles.className}>{className}</Text>
                <Text style={styles.classSubtext}>How was your experience with this class?</Text>
              </View>

              {/* Star Rating */}
              <View style={styles.ratingSection}>
                <Text style={styles.ratingLabel}>Your Rating</Text>
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Pressable
                      key={star}
                      onPress={() => handleStarPress(star - 1)}
                      style={[
                        styles.starButton,
                        hasReviewed && styles.starButtonDisabled
                      ]}
                      disabled={hasReviewed}
                    >
                      <Star
                        width={40}
                        height={40}
                        filled={star <= rating}
                        color={hasReviewed ? "#CCCCCC" : "#8A53C2"}
                      />
                    </Pressable>
                  ))}
                </View>
                {rating > 0 && (
                  <Text style={styles.ratingText}>
                    {rating === 1 ? 'Poor' : 
                     rating === 2 ? 'Fair' : 
                     rating === 3 ? 'Good' : 
                     rating === 4 ? 'Very Good' : 'Excellent'}
                  </Text>
                )}
              </View>

              {/* Description */}
              <View style={styles.descriptionSection}>
                <Text style={styles.descriptionLabel}>Your Review</Text>
                <TextInput
                  style={[
                    styles.descriptionInput,
                    hasReviewed && styles.descriptionInputDisabled
                  ]}
                  placeholder="Share your experience with this class..."
                  placeholderTextColor="#999999"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  editable={!hasReviewed}
                />
                <Text style={styles.characterCount}>
                  {description.length}/500 characters
                </Text>
              </View>
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
              <Pressable
                style={[
                  styles.submitButton, 
                  (isSubmitting || hasReviewed) && styles.submitButtonDisabled
                ]}
                onPress={handleSubmit}
                disabled={isSubmitting || hasReviewed}
              >
                <Text style={styles.submitButtonText}>
                  {isSubmitting ? 'Submitting...' : 
                   hasReviewed ? 'Already Reviewed' : 'Submit Review'}
                </Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 1000,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    height:600,
    maxHeight: height * 0.8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: '#000000',
  },
  closeButton: {
    padding: 8,
  },
  closeIcon: {
    width: 24,
    height: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  classInfo: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  className: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 8,
  },
  classSubtext: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#666666',
    textAlign: 'center',
  },
  ratingSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  ratingLabel: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: '#000000',
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  starButton: {
    padding: 4,
  },
  starButtonDisabled: {
    opacity: 0.6,
  },
  ratingText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: '#8A53C2',
  },
  descriptionSection: {
    paddingVertical: 20,
  },
  descriptionLabel: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: '#000000',
    marginBottom: 12,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: '#000000',
    minHeight: 120,
    maxHeight: 200,
  },
  descriptionInputDisabled: {
    backgroundColor: '#F5F5F5',
    color: '#666666',
  },
  characterCount: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: '#666666',
    textAlign: 'right',
    marginTop: 8,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopColor: '#E5E7EB',
  },
  submitButton: {
    backgroundColor: '#8A53C2',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
  },
});
