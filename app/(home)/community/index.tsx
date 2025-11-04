import CommentsModal from '@/components/ui/comments-modal';
import GradientBackground from '@/components/ui/gradient-background';
import { Fonts } from '@/constants/theme';
import { auth, database } from '@/firebase.config';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import { get, onValue, push, ref, set } from 'firebase/database';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface Post {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userProfilePicture: string;
  imageUrl: string;
  caption: string;
  likes: number;
  comments: number;
  createdAt: string;
  timestamp: number;
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userProfilePicture: string;
  text: string;
  createdAt: string;
  timestamp: number;
}

const CommunityIndexScreen: React.FC = () => {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState('Newest');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});
  const [comments, setComments] = useState<{ [postId: string]: Comment[] }>({});
  const [sendingComment, setSendingComment] = useState<{ [postId: string]: boolean }>({});
  const [showFilterBottomSheet, setShowFilterBottomSheet] = useState(false);
  const [selectedPostForComments, setSelectedPostForComments] = useState<Post | null>(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const filterBottomSheetRef = useRef<BottomSheet>(null);

  const filterOptions = [
    { id: 'relevance', label: 'Relevance' },
    { id: 'newest', label: 'Newest' },
    { id: 'oldest', label: 'Oldest' },
  ];

  const filterSnapPoints = useMemo(() => ['40%'], []);

  // Handle opening and closing the filter bottom sheet based on showFilterBottomSheet state
  useEffect(() => {
    if (showFilterBottomSheet) {
      filterBottomSheetRef.current?.expand();
    } else {
      filterBottomSheetRef.current?.close();
    }
  }, [showFilterBottomSheet]);

  // Listen to keyboard events
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleFilterPress = () => {
    setShowFilterBottomSheet(true);
  };

  const handleFilterClose = useCallback(() => {
    setShowFilterBottomSheet(false);
  }, []);

  const handleFilterSelect = (filterId: string) => {
    const filter = filterOptions.find(f => f.id === filterId);
    if (filter) {
      setSelectedFilter(filter.label);
    }
    handleFilterClose();
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  // Fetch all posts from global Posts node
  useEffect(() => {
    const postsRef = ref(database, 'Posts');
    
    const unsubscribe = onValue(postsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        
        const postsArray: Post[] = Object.entries(data)
          .map(([id, post]: [string, any]) => {
            if (!post) {
              return null;
            }
            return {
              id,
              postId: id,
              ...post,
            };
          })
          .filter((post): post is Post => post !== null);
        
        setPosts(postsArray);
      } else {
        setPosts([]);
      }
      setLoading(false);
    }, (error) => {
      console.error('Error in real-time listener:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sort posts based on selected filter
  const sortedPosts = useMemo(() => {
    const sorted = [...posts];
    
    switch (selectedFilter) {
      case 'Newest':
        return sorted.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      case 'Oldest':
        return sorted.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
      case 'Relevance':
        // Sort by likes + comments
        return sorted.sort((a, b) => {
          const aScore = (a.likes || 0) + (a.comments || 0);
          const bScore = (b.likes || 0) + (b.comments || 0);
          return bScore - aScore;
        });
      default:
        return sorted;
    }
  }, [posts, selectedFilter]);

  // Format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    } catch {
      return '';
    }
  };

  // Format time ago
  const formatTimeAgo = (dateString: string | undefined) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'just now';
      if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
      if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
      if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
      return formatDate(dateString);
    } catch {
      return '';
    }
  };

  // Fetch comments for posts
  useEffect(() => {
    if (posts.length === 0) return;

    const unsubscribeFunctions: Array<() => void> = [];

    posts.forEach((post) => {
      const postId = post.postId || post.id;
      
      // Fetch from global Posts commentList
      const globalCommentsRef = ref(database, `Posts/${postId}/commentList`);
      const unsubscribe = onValue(globalCommentsRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const commentsArray: Comment[] = Object.entries(data).map(([id, comment]: [string, any]) => ({
            id,
            ...comment,
          }));
          // Sort by timestamp (newest first)
          commentsArray.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
          
          console.log('🟢 COMMUNITY: Comments for post', postId, ':', commentsArray.map(c => ({
            userName: c.userName,
            hasProfilePicture: !!c.userProfilePicture,
            profilePicture: c.userProfilePicture
          })));
          
          setComments((prev) => ({
            ...prev,
            [postId]: commentsArray,
          }));
        } else {
          setComments((prev) => ({
            ...prev,
            [postId]: [],
          }));
        }
      });

      unsubscribeFunctions.push(unsubscribe);
    });

    return () => {
      unsubscribeFunctions.forEach((unsubscribe) => unsubscribe());
    };
  }, [posts]);

  // Send comment
  const handleSendComment = async (postId: string, post: Post) => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'Please sign in to comment');
      return;
    }

    const commentText = commentInputs[postId]?.trim();
    if (!commentText) {
      return;
    }

    setSendingComment((prev) => ({ ...prev, [postId]: true }));

    try {
      // Get user profile data
      const userProfileRef = ref(database, `users/${user.uid}/personalInfo`);
      const userSnapshot = await get(userProfileRef);
      const userProfile = userSnapshot.val();
      
      const userName = userProfile?.fullName || user.displayName || 'User';
      const userProfilePicture = userProfile?.profileImageUrl || userProfile?.profilePicture || userProfile?.profileImageUri || '';

      const globalPostId = post.postId || postId;

      // Create comment data
      const commentData = {
        userId: user.uid,
        userName,
        userProfilePicture,
        text: commentText,
        createdAt: new Date().toISOString(),
        timestamp: Date.now(),
      };

      // Save to global Posts/postId/commentList (object of comments)
      const globalCommentsRef = ref(database, `Posts/${globalPostId}/commentList`);
      const newCommentRef = push(globalCommentsRef);
      const commentId = newCommentRef.key;
      
      if (commentId) {
        await set(newCommentRef, {
          ...commentData,
          id: commentId,
        });

        // Update comment count in global Posts location
        const globalPostRef = ref(database, `Posts/${globalPostId}`);
        const globalPostSnapshot = await get(globalPostRef);
        if (globalPostSnapshot.exists()) {
          const currentData = globalPostSnapshot.val();
          const newCommentCount = (currentData.comments || 0) + 1;
          await set(ref(database, `Posts/${globalPostId}/comments`), newCommentCount);
        }

        // Clear input
        setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
      }
    } catch (error) {
      console.error('Error sending comment:', error);
      Alert.alert('Error', 'Failed to send comment. Please try again.');
    } finally {
      setSendingComment((prev) => ({ ...prev, [postId]: false }));
    }
  };

  // Handle view all comments
  const handleViewAllComments = (post: Post) => {
    setSelectedPostForComments(post);
  };

  // Handle close comments bottom sheet
  const handleCloseCommentsSheet = useCallback(() => {
    setSelectedPostForComments(null);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GradientBackground>
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.placeholder} />
            <Text style={styles.headerTitle}>Community</Text>
            <Pressable style={styles.filterButton} onPress={handleFilterPress}>
              <Image
                source={require('@/assets/images/searchfilter.png')}
                style={styles.filterIcon}
                resizeMode="contain"
              />
            </Pressable>
          </View>

          {/* Content */}
         
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={[
                styles.scrollContent,
                { paddingBottom: isKeyboardVisible ? 300 : 20 }
              ]}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#C708F7" />
                  <Text style={styles.loadingText}>Loading posts...</Text>
                </View>
              ) : sortedPosts.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No posts yet</Text>
                  <Text style={styles.emptySubtext}>Be the first to share something!</Text>
                </View>
              ) : (
                sortedPosts.map((post) => (
                  <View key={post.id} style={styles.postCard}>
                    {/* User Info */}
                    <View style={styles.userInfo}>
                      {post.userProfilePicture ? (
                        <Image
                          source={{ uri: post.userProfilePicture }}
                          style={styles.profileImage}
                          resizeMode="cover"
                        />
                      ) : (
                        <Image
                          source={require('@/assets/images/fav1.png')}
                          style={styles.profileImage}
                          resizeMode="cover"
                        />
                      )}
                      <View style={styles.userDetails}>
                        <Text style={styles.userName}>{post.userName || 'User'}</Text>
                        <Text style={styles.postDate}>{formatDate(post.createdAt)}</Text>
                      </View>
                    </View>

                    {/* Post Image */}
                    <Image
                      source={{ uri: post.imageUrl }}
                      style={styles.postImage}
                      resizeMode="cover"
                    />

                    {/* Engagement Stats */}
                    <View style={styles.engagementStats}>
                      <View style={styles.statItem}>
                        <Image
                          source={require('@/assets/images/like.png')}
                          style={styles.statIcon}
                          resizeMode="contain"
                        />
                        <Text style={styles.statText}>{post.likes || 0}</Text>
                      </View>
                      <Pressable 
                        style={styles.statItem}
                        onPress={() => handleViewAllComments(post)}
                      >
                        <Image
                          source={require('@/assets/images/comment.png')}
                          style={styles.statIcon}
                          resizeMode="contain"
                        />
                        <Text style={styles.statText}>{post.comments || 0}</Text>
                      </Pressable>
                    </View>

                    {/* Post Description */}
                    {post.caption ? (
                      <Text style={styles.postDescription}>{post.caption}</Text>
                    ) : null}

                    {/* Comment Section - Top 3 only */}
                    <View style={styles.commentSection}>
                      {/* Display Top 3 Comments */}
                      {comments[post.postId || post.id]?.slice(0, 3).map((comment) => (
                        <View key={comment.id} style={styles.commentItem}>
                          {comment.userProfilePicture ? (
                            <Image
                              source={{ uri: comment.userProfilePicture }}
                              style={styles.commentProfileImage}
                              resizeMode="cover"
                            />
                          ) : (
                            <Image
                              source={require('@/assets/images/fav2.png')}
                              style={styles.commentProfileImage}
                              resizeMode="cover"
                            />
                          )}
                          <View style={styles.commentContent}>
                            <Text style={styles.commenterName}>{comment.userName || 'User'}</Text>
                            <Text style={styles.commentText}>{comment.text}</Text>
                          </View>
                          <Text style={styles.commentTime}>{formatTimeAgo(comment.createdAt)}</Text>
                        </View>
                      ))}

                      {/* View All Comments Button */}
                      {comments[post.postId || post.id] && comments[post.postId || post.id].length > 3 && (
                        <Pressable 
                          style={styles.viewAllCommentsButton}
                          onPress={() => handleViewAllComments(post)}
                        >
                          <Text style={styles.viewAllCommentsText}>
                            View all {comments[post.postId || post.id].length} comments
                          </Text>
                        </Pressable>
                      )}

                      {/* Comment Input */}
                      <View style={styles.commentInputContainer}>
                        <TextInput
                          style={styles.commentInput}
                          placeholder="Write your comments"
                          placeholderTextColor="#999999"
                          value={commentInputs[post.postId || post.id] || ''}
                          onChangeText={(text) => {
                            setCommentInputs((prev) => ({
                              ...prev,
                              [post.postId || post.id]: text,
                            }));
                          }}
                          onSubmitEditing={() => handleSendComment(post.postId || post.id, post)}
                          editable={!sendingComment[post.postId || post.id]}
                        />
                        <Pressable
                          onPress={() => handleSendComment(post.postId || post.id, post)}
                          disabled={!commentInputs[post.postId || post.id]?.trim() || sendingComment[post.postId || post.id]}
                          style={styles.sendButton}
                        >
                          {sendingComment[post.postId || post.id] ? (
                            <ActivityIndicator size="small" color="#C708F7" />
                          ) : (
                            <Image
                              source={require('@/assets/images/comment1.png')}
                              style={styles.sendIcon}
                              resizeMode="contain"
                            />
                          )}
                        </Pressable>
                      </View>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>
        </SafeAreaView>
      </GradientBackground>

      {/* Filter Bottom Sheet - Outside main container to ensure proper z-index */}
      <BottomSheet
        ref={filterBottomSheetRef}
        index={-1}
        snapPoints={filterSnapPoints}
        enablePanDownToClose
        onClose={handleFilterClose}
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.filterModal}
        handleIndicatorStyle={styles.handleIndicator}
      >
        <View style={styles.filterSheetContent}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filters</Text>
            <Pressable style={styles.closeButton} onPress={handleFilterClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </Pressable>
          </View>

          {/* Filter Options */}
          <View style={styles.filterOptions}>
            {filterOptions.map((option) => (
              <Pressable
                key={option.id}
                style={[
                  styles.filterOption,
                  selectedFilter === option.label && styles.selectedFilterBackground,
                ]}
                onPress={() => handleFilterSelect(option.id)}
              >
                <Text
                  style={[
                    styles.filterOptionText,
                    selectedFilter === option.label && styles.selectedFilterText,
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </BottomSheet>

      {/* All Comments Bottom Sheet */}
      <CommentsModal
        visible={!!selectedPostForComments}
        onClose={handleCloseCommentsSheet}
        comments={selectedPostForComments ? (comments[selectedPostForComments.postId] || []) : []}
        commentText={selectedPostForComments ? (commentInputs[selectedPostForComments.postId] || '') : ''}
        onCommentTextChange={(text) => {
          if (selectedPostForComments) {
            setCommentInputs((prev) => ({
              ...prev,
              [selectedPostForComments.postId]: text,
            }));
          }
        }}
        onSendComment={() => selectedPostForComments && handleSendComment(selectedPostForComments.postId, selectedPostForComments)}
        isSending={selectedPostForComments ? (sendingComment[selectedPostForComments.postId] || false) : false}
        formatTimeAgo={formatTimeAgo}
      />
    </GestureHandlerRootView>
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
  placeholder: {
    width: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterIcon: {
    width: 40,
    height: 40,
    tintColor: '#FFFFFF',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#000000',
    marginBottom: 4,
  },
  postDate: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#666666',
  },
  postImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 16,
  },
  engagementStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  statIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  statText: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#C708F7',
  },
  postDescription: {
    fontSize: 14,
    color: '#222222',
    lineHeight: 20,
    marginBottom: 16,
  },
  commentSection: {
    marginBottom: 20,
  },
  commentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  commentProfileImage: {
    width: 35,
    height: 35,
    borderRadius: 150,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commenterName: {
    fontSize: 14,
    color: '#000000',
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    color: '#222222',
    fontWeight: '300',
  },
  commentTime: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#999999',
  },
  viewAllCommentsButton: {
    paddingVertical: 8,
    marginBottom: 12,
  },
  viewAllCommentsText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: '#666666',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(138, 83, 193, 0.03)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  commentInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#000000',
    marginRight: 8,
  },
  sendButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    width: 24,
    height: 24,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#CCCCCC',
  },
  // Filter Bottom Sheet Styles
  filterModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handleIndicator: {
    backgroundColor: '#CCCCCC',
    width: 40,
  },
  filterSheetContent: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: '#000000',
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 23,
    color: '#000000',
    fontWeight: 'bold',
  },
  filterOptions: {
  },
  filterOption: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  filterOptionText: {
    fontSize: 19,
    fontWeight: '500',
    color: '#000000',
  },
  selectedFilterText: {
    fontWeight: '500',
    color: '#C708F7',
  },
  selectedFilterBackground: {
    backgroundColor: 'rgba(247, 8, 247, 0.05)',
  },
  // Comments Bottom Sheet Styles
  commentsBottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  commentsSheetContent: {
    flex: 1,
  },
  commentsSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    position: 'relative',
  },
  commentsSheetTitle: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: '#000000',
  },
  closeSheetButton: {
    position: 'absolute',
    right: 20,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeSheetButtonText: {
    fontSize: 23,
    color: '#000000',
    fontWeight: 'bold',
  },
  commentsSheetScroll: {
    flex: 1,
  },
  commentsSheetScrollContent: {
    padding: 20,
  },
  sheetCommentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  sheetCommentProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  sheetCommentContent: {
    flex: 1,
  },
  sheetCommenterName: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    color: '#000000',
    marginBottom: 4,
  },
  sheetCommentText: {
    fontSize: 14,
    color: '#222222',
    fontWeight: '300',
  },
  sheetCommentTime: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: '#999999',
    marginLeft: 8,
  },
  noCommentsContainer: {
    paddingVertical: 50,
    alignItems: 'center',
  },
  noCommentsText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: '#666666',
  },
  sheetCommentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(138, 83, 193, 0.03)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 15,
    margin: 20,
  },
  sheetCommentInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#000000',
    marginRight: 8,
  },
  sheetSendButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetSendIcon: {
    width: 24,
    height: 24,
  },
});

export default CommunityIndexScreen;
