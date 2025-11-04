import CommentsModal from '@/components/ui/comments-modal';
import GradientBackground from '@/components/ui/gradient-background';
import PostFilterModal, { FilterOptions } from '@/components/ui/postfilter-modal';
import { Fonts } from '@/constants/theme';
import { auth, database } from '@/firebase.config';
import { useRouter } from 'expo-router';
import { get, onValue, push, ref, remove, set } from 'firebase/database';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface Post {
  id: string;
  userId: string;
  userName: string;
  userProfilePicture: string;
  imageUrl: string;
  caption: string;
  likes: number;
  comments: number;
  createdAt: string;
  timestamp: number;
  postId?: string;
  globalPostId?: string;
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

const MyPostsScreen: React.FC = () => {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});
  const [comments, setComments] = useState<{ [postId: string]: Comment[] }>({});
  const [sendingComment, setSendingComment] = useState<{ [postId: string]: boolean }>({});
  const [showMenuForPost, setShowMenuForPost] = useState<string | null>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedPostForComments, setSelectedPostForComments] = useState<Post | null>(null);
  const [globalCommentCounts, setGlobalCommentCounts] = useState<{ [postId: string]: number }>({});
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});
  const scrollViewRef = useRef<ScrollView>(null);

  const filterOptions = [
    { id: 'relevance', label: 'Relevance' },
    { id: 'newest', label: 'Newest' },
    { id: 'oldest', label: 'Oldest' },
  ];

  const handleBackPress = () => {
    router.back();
  };

  const handleFilterPress = () => {
    setShowFilterModal(true);
  };

  const handleApplyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    // Convert filter ID to label for sorting
    if (newFilters.selectedFilter) {
      const filter = filterOptions.find(f => f.id === newFilters.selectedFilter);
      if (filter) {
        setSelectedFilter(filter.label);
      }
    }
    setShowFilterModal(false);
  };

  // Fetch posts from database
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    const postsRef = ref(database, `users/${user.uid}/my-post`);
    
    const unsubscribe = onValue(postsRef, (snapshot) => {
      console.log('🟡 MY POSTS: Real-time update received');
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log('🟡 MY POSTS: Posts data:', Object.keys(data || {}));
        
        // Handle case where data might be null or empty
        if (!data || Object.keys(data).length === 0) {
          console.log('🟡 MY POSTS: No posts found, setting empty array');
          setPosts([]);
          setLoading(false);
          return;
        }
        
        const postsArray: Post[] = Object.entries(data)
          .map(([id, post]: [string, any]) => {
            // Skip null or undefined posts (deleted posts)
            if (!post) {
              console.log('🟡 MY POSTS: Skipping null post with id:', id);
              return null;
            }
            return {
              id,
              ...post,
            };
          })
          .filter((post): post is Post => post !== null);
        
        // Filter to only show posts created by the current user
        const userPosts = postsArray.filter((post) => post.userId === user.uid);
        console.log('🟡 MY POSTS: Filtered user posts count:', userPosts.length);
        setPosts(userPosts);
      } else {
        console.log('🟡 MY POSTS: Snapshot does not exist, setting empty array');
        setPosts([]);
      }
      setLoading(false);
    }, (error) => {
      console.error('🟡 MY POSTS: Error in real-time listener:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sort posts based on selected filter
  const sortedPosts = useMemo(() => {
    const sorted = [...posts];
    
    // Default to 'Newest' when no filter is selected
    const filterToUse = selectedFilter || 'Newest';
    
    switch (filterToUse) {
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
        return sorted.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
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

  // Delete post
  const handleDeletePost = async (post: Post) => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'Please sign in to delete posts');
      return;
    }

    setShowMenuForPost(null); // Close menu

    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Use post.id (local key) for user's my-post deletion
              const localPostKey = post.id;
              // Use post.postId or post.globalPostId for global Posts deletion
              const globalPostId = post.postId || post.globalPostId;

              console.log('🔴 DELETE: Deleting post with local key:', localPostKey, 'global postId:', globalPostId);

              // Delete from user's my-post using the local key
              const userPostRef = ref(database, `users/${user.uid}/my-post/${localPostKey}`);
              await remove(userPostRef);
              console.log('🔴 DELETE: Deleted from user my-post');

              // Delete from global Posts using the global postId
              if (globalPostId) {
                const globalPostRef = ref(database, `Posts/${globalPostId}`);
                await remove(globalPostRef);
                console.log('🔴 DELETE: Deleted from global Posts');
              }

              Alert.alert('Success', 'Post deleted successfully');
            } catch (error) {
              console.error('Error deleting post:', error);
              Alert.alert('Error', 'Failed to delete post. Please try again.');
            }
          },
        },
      ]
    );
  };

  // Edit post - navigate to add-post with prefilled data
  const handleEditPost = async (postId: string, post: Post) => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'Please sign in to edit posts');
      return;
    }

    setShowMenuForPost(null); // Close menu

    try {
      // Use the postId from the post object (which should be the global postId)
      // If not available, try to get it from the database
      let actualPostId = post.postId || postId;
      
      if (!post.postId) {
        // Get the actual post to find the correct postId
        const userPostRef = ref(database, `users/${user.uid}/my-post/${postId}`);
        const userPostSnapshot = await get(userPostRef);
        
        if (userPostSnapshot.exists()) {
          const postData = userPostSnapshot.val() as any;
          // Use postId if available, otherwise use globalPostId, otherwise use the key
          actualPostId = postData.postId || postData.globalPostId || postId;
          console.log('🔵 MY POSTS: Post data from direct fetch:', { postId: postData.postId, globalPostId: postData.globalPostId, localId: postId, allData: postData });
        } else {
          // Try to find by searching all posts
          const allPostsRef = ref(database, `users/${user.uid}/my-post`);
          const allPostsSnapshot = await get(allPostsRef);
          if (allPostsSnapshot.exists()) {
            const posts = allPostsSnapshot.val();
            const postEntry = Object.entries(posts).find(([key, post]: [string, any]) => 
              key === postId || post.postId === postId || post.globalPostId === postId
            );
            if (postEntry) {
              const postData = postEntry[1] as any;
              actualPostId = postData.postId || postData.globalPostId || postEntry[0];
              console.log('🔵 MY POSTS: Found post by search:', { actualPostId, localKey: postEntry[0], postData });
            }
          }
        }
      }
      
      console.log('🔵 MY POSTS: Using postId for navigation:', actualPostId, 'from post object:', post);
      
      // Save the post id to database for add-post.tsx to read
      const navigationStateRef = ref(database, `users/${user.uid}/navigationState/selectedPostId`);
      await set(navigationStateRef, actualPostId);
      console.log('🔵 MY POSTS: Saved postId to database:', actualPostId);
      
      // Navigate to home screen - it will read the id from database and redirect
      router.push('/(home)/home');
    } catch (error) {
      console.error('Error saving post id to database:', error);
      Alert.alert('Error', 'Failed to navigate to edit screen. Please try again.');
    }
  };

  // Keyboard event listeners
  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setIsKeyboardVisible(true);
      }
    );
    const hideSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setIsKeyboardVisible(false);
      }
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

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

  // Handle view all comments
  const handleViewAllComments = (post: Post) => {
    setSelectedPostForComments(post);
  };

  // Handle close comments bottom sheet
  const handleCloseCommentsSheet = useCallback(() => {
    setSelectedPostForComments(null);
  }, []);

  // Fetch comments and comment counts from global Posts
  useEffect(() => {
    if (posts.length === 0) return;

    const unsubscribeFunctions: Array<() => void> = [];

    posts.forEach((post) => {
      // Use global postId - prioritize postId, then globalPostId, then id
      const globalPostId = post.postId || post.globalPostId || post.id;
      
      // Fetch from global Posts commentList
      const globalCommentsRef = ref(database, `Posts/${globalPostId}/commentList`);
      const unsubscribeComments = onValue(globalCommentsRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const commentsArray: Comment[] = Object.entries(data).map(([id, comment]: [string, any]) => ({
            id,
            ...comment,
          }));
          // Sort by timestamp (newest first)
          commentsArray.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
          
          console.log('🟡 MY POSTS: Comments for post', globalPostId, ':', commentsArray.map(c => ({
            userName: c.userName,
            hasProfilePicture: !!c.userProfilePicture,
            profilePicture: c.userProfilePicture
          })));
          
          setComments((prev) => ({
            ...prev,
            [globalPostId]: commentsArray,
          }));
        } else {
          setComments((prev) => ({
            ...prev,
            [globalPostId]: [],
          }));
        }
      });

      // Fetch global comment count
      const globalPostRef = ref(database, `Posts/${globalPostId}`);
      const unsubscribeCount = onValue(globalPostRef, (snapshot) => {
        if (snapshot.exists()) {
          const postData = snapshot.val();
          const commentCount = postData.comments || 0;
          setGlobalCommentCounts((prev) => ({
            ...prev,
            [globalPostId]: commentCount,
          }));
        }
      });

      unsubscribeFunctions.push(unsubscribeComments);
      unsubscribeFunctions.push(unsubscribeCount);
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

    // Use global postId - prioritize postId, then globalPostId, then postId parameter
    const globalPostId = post.postId || post.globalPostId || postId;

    const commentText = commentInputs[globalPostId]?.trim();
    if (!commentText) {
      return;
    }

    setSendingComment((prev) => ({ ...prev, [globalPostId]: true }));

    try {
      // Get user profile data
      const userProfileRef = ref(database, `users/${user.uid}/personalInfo`);
      const userSnapshot = await get(userProfileRef);
      const userProfile = userSnapshot.val();
      
      const userName = userProfile?.fullName || user.displayName || 'User';
      const userProfilePicture = userProfile?.profileImageUrl || userProfile?.profilePicture || userProfile?.profileImageUri || '';

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

        // Update comment count in global Posts location only
        const globalPostRef = ref(database, `Posts/${globalPostId}`);
        const globalPostSnapshot = await get(globalPostRef);
        if (globalPostSnapshot.exists()) {
          const currentData = globalPostSnapshot.val();
          const newCommentCount = (currentData.comments || 0) + 1;
          await set(ref(database, `Posts/${globalPostId}/comments`), newCommentCount);
        }

        // Clear input
        setCommentInputs((prev) => ({ ...prev, [globalPostId]: '' }));
      }
    } catch (error) {
      console.error('Error sending comment:', error);
      Alert.alert('Error', 'Failed to send comment. Please try again.');
    } finally {
      const globalPostId = post.postId || post.globalPostId || postId;
      setSendingComment((prev) => ({ ...prev, [globalPostId]: false }));
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <GradientBackground>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={{ flex: 1 }}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable style={styles.backButton} onPress={handleBackPress}>
              <Image
                source={require('@/assets/images/chevron-left.png')}
                style={styles.backIcon}
                resizeMode="contain"
              />
            </Pressable>
            <Text style={styles.headerTitle}>My Post</Text>
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
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            isKeyboardVisible && { paddingBottom: 10 }
          ]}
          showsVerticalScrollIndicator={false}
          onScrollBeginDrag={() => setShowMenuForPost(null)}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#C708F7" />
              <Text style={styles.loadingText}>Loading posts...</Text>
            </View>
          ) : sortedPosts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No posts yet</Text>
              <Text style={styles.emptySubtext}>Create your first post to get started!</Text>
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
                  <View style={styles.headerActions}>
              <Pressable style={styles.likeButton}>
                <Image
                  source={require('@/assets/images/likes.png')}
                  style={styles.likeIcon}
                  resizeMode="contain"
                />
              </Pressable>
                    <View style={styles.menuContainer}>
                      <Pressable
                        style={styles.menuButton}
                        onPress={(e) => {
                          e.stopPropagation();
                          setShowMenuForPost(showMenuForPost === post.id ? null : post.id);
                        }}
                      >
                        <Image
                          source={require('@/assets/images/dots.png')}
                          style={styles.menuIcon}
                          resizeMode="contain"
                        />
                      </Pressable>
                      {showMenuForPost === post.id && (
                        <Pressable
                          style={styles.menuDropdown}
                          onPress={(e) => e.stopPropagation()}
                        >
                          <Pressable
                            style={styles.menuItem}
                            onPress={() => handleEditPost(post.id, post)}
                          >
                            <Image
                              source={require('@/assets/images/editable.png')}
                              style={styles.menuItemIcon}
                              resizeMode="contain"
                            />
                            <Text style={styles.menuItemText}>Edit</Text>
                          </Pressable>
                          <Pressable
                            style={[styles.menuItem, styles.menuItemDelete]}
                            onPress={() => handleDeletePost(post)}
                          >
                            <Image
                              source={require('@/assets/images/deel.png')}
                              style={styles.menuItemIcon}
                              resizeMode="contain"
                            />
                            <Text style={[styles.menuItemText, styles.menuItemDeleteText]}>Delete</Text>
                          </Pressable>
                        </Pressable>
                      )}
                    </View>
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
                    <Text style={styles.statText}>
                      {globalCommentCounts[post.postId || post.globalPostId || post.id] ?? post.comments ?? 0}
                    </Text>
              </Pressable>
            </View>

            {/* Post Description */}
                {post.caption ? (
                  <Text style={styles.postDescription}>{post.caption}</Text>
                ) : null}

            {/* Comment Section */}
            <View style={styles.commentSection}>
                  {/* Display Top 3 Comments */}
                  {comments[post.postId || post.globalPostId || post.id]?.slice(0, 3).map((comment) => (
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
                      {comments[post.postId || post.globalPostId || post.id] && comments[post.postId || post.globalPostId || post.id].length > 3 && (
                        <Pressable 
                          style={styles.viewAllCommentsButton}
                          onPress={() => handleViewAllComments(post)}
                        >
                          <Text style={styles.viewAllCommentsText}>
                            View all {comments[post.postId || post.globalPostId || post.id].length} comments
                          </Text>
                        </Pressable>
                      )}

              {/* Comment Input */}
              <View style={styles.commentInputContainer}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Write your comments"
                  placeholderTextColor="#999999"
                      value={commentInputs[post.postId || post.globalPostId || post.id] || ''}
                      onChangeText={(text) => {
                        const globalPostId = post.postId || post.globalPostId || post.id;
                        setCommentInputs((prev) => ({
                          ...prev,
                          [globalPostId]: text,
                        }));
                      }}
                      onSubmitEditing={() => {
                        const globalPostId = post.postId || post.globalPostId || post.id;
                        handleSendComment(globalPostId, post);
                      }}
                      editable={!sendingComment[post.postId || post.globalPostId || post.id]}
                    />
                    <Pressable
                      onPress={() => {
                        const globalPostId = post.postId || post.globalPostId || post.id;
                        handleSendComment(globalPostId, post);
                      }}
                      disabled={!commentInputs[post.postId || post.globalPostId || post.id]?.trim() || sendingComment[post.postId || post.globalPostId || post.id]}
                      style={styles.sendButton}
                    >
                      {sendingComment[post.postId || post.globalPostId || post.id] ? (
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
        </View>
      </SafeAreaView>
    </GradientBackground>

      {/* All Comments Bottom Sheet */}
      <CommentsModal
        visible={!!selectedPostForComments}
        onClose={handleCloseCommentsSheet}
        comments={selectedPostForComments ? (comments[selectedPostForComments.postId || selectedPostForComments.globalPostId || selectedPostForComments.id] || []) : []}
        commentText={selectedPostForComments ? (commentInputs[selectedPostForComments.postId || selectedPostForComments.globalPostId || selectedPostForComments.id] || '') : ''}
        onCommentTextChange={(text) => {
          if (selectedPostForComments) {
            const globalPostId = selectedPostForComments.postId || selectedPostForComments.globalPostId || selectedPostForComments.id;
            setCommentInputs((prev) => ({
              ...prev,
              [globalPostId]: text,
            }));
          }
        }}
        onSendComment={() => {
          if (selectedPostForComments) {
            const globalPostId = selectedPostForComments.postId || selectedPostForComments.globalPostId || selectedPostForComments.id;
            handleSendComment(globalPostId, selectedPostForComments);
          }
        }}
        isSending={selectedPostForComments ? (sendingComment[selectedPostForComments.postId || selectedPostForComments.globalPostId || selectedPostForComments.id] || false) : false}
        formatTimeAgo={formatTimeAgo}
      />
         <PostFilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilters={handleApplyFilters}
        initialFilters={filters.selectedFilter ? filters : {}}
      />
  </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingBottom:-40,
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
    
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 20,
fontWeight:'800',
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuContainer: {
    position: 'relative',
  },
  menuButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    width: 24,
    height: 24,
  },
  menuDropdown: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    gap: 8,
  },
  menuItemIcon: {
    width: 16,
    height: 16,
  },
  menuItemDelete: {
    borderBottomWidth: 0,
  },
  menuItemText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: '#000000',
  },
  menuItemDeleteText: {
    color: '#FF3B30',
  },
  likeButton: {
   
  },
  likeIcon: {
    width: 74,
left:10,
    height: 74,
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
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
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
fontWeight:'300',  },
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
  inputProfileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 12,
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
  nextPostPreview: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  nextPostUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextPostProfileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  nextPostUserDetails: {
    flex: 1,
  },
  nextPostUserName: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#000000',
    marginBottom: 4,
  },
  nextPostDate: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#666666',
  },
  nextPostLikeButton: {
    padding: 8,
  },
  nextPostLikeIcon: {
    width: 24,
    height: 24,
    tintColor: '#8A2BE2',
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
});

export default MyPostsScreen;