import GradientBackground from '@/components/ui/gradient-background';
import { Fonts } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
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
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const MyPostsScreen: React.FC = () => {
  const router = useRouter();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('Newest');

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

  const handleFilterClose = () => {
    setShowFilterModal(false);
  };

  const handleFilterSelect = (filterId: string) => {
    const filter = filterOptions.find(f => f.id === filterId);
    if (filter) {
      setSelectedFilter(filter.label);
    }
    setShowFilterModal(false);
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
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Post Card */}
          <View style={styles.postCard}>
            {/* User Info */}
            <View style={styles.userInfo}>
              <Image
                source={require('@/assets/images/fav1.png')}
                style={styles.profileImage}
                resizeMode="cover"
              />
              <View style={styles.userDetails}>
                <Text style={styles.userName}>Abigail</Text>
                <Text style={styles.postDate}>10 Feb 2023</Text>
              </View>
              <Pressable style={styles.likeButton}>
                <Image
                  source={require('@/assets/images/likes.png')}
                  style={styles.likeIcon}
                  resizeMode="contain"
                />
              </Pressable>
            </View>

            {/* Post Image */}
            <Image
              source={require('@/assets/images/post1.png')}
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
                <Text style={styles.statText}>1000</Text>
              </View>
              <View style={styles.statItem}>
                <Image
                  source={require('@/assets/images/comment.png')}
                  style={styles.statIcon}
                  resizeMode="contain"
                />
                <Text style={styles.statText}>100</Text>
              </View>
            </View>

            {/* Post Description */}
            <Text style={styles.postDescription}>
              Lorem ipsum dolor sit amet consectetur. At sit tellus vel tortor egestas velit luctus arcu. Lacus quam aliquam ac massa natoque gravida justo. Neque aliquam potenti leo mi sit lobortis sed. Aliquam ut a ultricies lacus nullam nisl sem. Non accumsan etiam vitae neque sit massa at cras. Donec quisque lacus venenatis lectus aliquam eget.
            </Text>

            {/* Divider */}

            {/* Comment Section */}
            <View style={styles.commentSection}>
              <View style={styles.commentItem}>
                <Image
                  source={require('@/assets/images/fav2.png')}
                  style={styles.commentProfileImage}
                  resizeMode="cover"
                />
                <View style={styles.commentContent}>
                  <Text style={styles.commenterName}>Christin</Text>
                  <Text style={styles.commentText}>Awesome!</Text>
                </View>
                <Text style={styles.commentTime}>1 hour ago</Text>
              </View>

              {/* Comment Input */}
              <View style={styles.commentInputContainer}>
               
                <TextInput
                  style={styles.commentInput}
                  placeholder="Write your comments"
                  placeholderTextColor="#999999"
                />
              </View>
            </View>
          </View>

          {/* Next Post Preview */}
          <View style={styles.postCard}>
            {/* User Info */}
            <View style={styles.userInfo}>
              <Image
                source={require('@/assets/images/fav1.png')}
                style={styles.profileImage}
                resizeMode="cover"
              />
              <View style={styles.userDetails}>
                <Text style={styles.userName}>Abigail</Text>
                <Text style={styles.postDate}>10 Feb 2023</Text>
              </View>
              <Pressable style={styles.likeButton}>
                <Image
                  source={require('@/assets/images/likes.png')}
                  style={styles.likeIcon}
                  resizeMode="contain"
                />
              </Pressable>
            </View>

            {/* Post Image */}
            <Image
              source={require('@/assets/images/fav3.png')}
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
                <Text style={styles.statText}>1000</Text>
              </View>
              <View style={styles.statItem}>
                <Image
                  source={require('@/assets/images/comment.png')}
                  style={styles.statIcon}
                  resizeMode="contain"
                />
                <Text style={styles.statText}>100</Text>
              </View>
            </View>

            {/* Post Description */}
            <Text style={styles.postDescription}>
              Lorem ipsum dolor sit amet consectetur. At sit tellus vel tortor egestas velit luctus arcu. Lacus quam aliquam ac massa natoque gravida justo. Neque aliquam potenti leo mi sit lobortis sed. Aliquam ut a ultricies lacus nullam nisl sem. Non accumsan etiam vitae neque sit massa at cras. Donec quisque lacus venenatis lectus aliquam eget.
            </Text>

            {/* Divider */}

            {/* Comment Section */}
            <View style={styles.commentSection}>
              <View style={styles.commentItem}>
                <Image
                  source={require('@/assets/images/fav2.png')}
                  style={styles.commentProfileImage}
                  resizeMode="cover"
                />
                <View style={styles.commentContent}>
                  <Text style={styles.commenterName}>Christin</Text>
                  <Text style={styles.commentText}>Awesome!</Text>
                </View>
                <Text style={styles.commentTime}>1 hour ago</Text>
              </View>

              {/* Comment Input */}
              <View style={styles.commentInputContainer}>
               
                <TextInput
                  style={styles.commentInput}
                  placeholder="Write your comments"
                  placeholderTextColor="#999999"
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent={true}
        animationType="slide"
        onRequestClose={handleFilterClose}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={handleFilterClose} />
          <View style={styles.filterModal}>
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
        </View>
      </Modal>
    </GradientBackground>
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
    borderRadius: 15,
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
  // Filter Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
  },
  filterModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '50%',
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
fontWeight:'500',
    color: '#000000',
  },
  selectedFilterText: {
fontWeight:'500',    color: '#C708F7',
  },
  selectedFilterBackground: {
    backgroundColor: 'rgba(247, 8, 247, 0.05)',
  },
});

export default MyPostsScreen;