import { Fonts } from '@/constants/theme';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Image, Keyboard, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userProfilePicture: string;
  text: string;
  createdAt: string;
  timestamp: number;
}

interface CommentsModalProps {
  visible: boolean;
  onClose: () => void;
  comments: Comment[];
  commentText: string;
  onCommentTextChange: (text: string) => void;
  onSendComment: () => void;
  isSending: boolean;
  formatTimeAgo: (dateString: string | undefined) => string;
}

const CommentsModal: React.FC<CommentsModalProps> = ({
  visible,
  onClose,
  comments,
  commentText,
  onCommentTextChange,
  onSendComment,
  isSending,
  formatTimeAgo,
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const snapPoints = useMemo(() => ['100%'], []);

  useEffect(() => {
    visible ? bottomSheetRef.current?.expand() : bottomSheetRef.current?.close();
  }, [visible]);

  useEffect(() => {
    const show = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', e => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hide = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => setKeyboardHeight(0));

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const handleSheetClose = useCallback(() => {
    Keyboard.dismiss();
    onClose();
  }, [onClose]);

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

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={handleSheetClose}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.modalContent}
      handleIndicatorStyle={styles.handleIndicator}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Comments</Text>
          <Pressable onPress={handleSheetClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </Pressable>
        </View>

        {/* Comments List - Constrained to available space */}
        <BottomSheetScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {comments.length > 0 ? (
            comments.map((comment) => (
              <View key={comment.id} style={styles.commentItem}>
                <Image
                  source={
                    comment.userProfilePicture
                      ? { uri: comment.userProfilePicture }
                      : require('@/assets/images/fav2.png')
                  }
                  style={styles.commentProfileImage}
                />
                <View style={styles.commentContent}>
                  <Text style={styles.commenterName}>{comment.userName || 'User'}</Text>
                  <Text style={styles.commentText}>{comment.text}</Text>
                </View>
                <Text style={styles.commentTime}>{formatTimeAgo(comment.createdAt)}</Text>
              </View>
            ))
          ) : (
            <View style={styles.noCommentsContainer}>
              <Text style={styles.noCommentsText}>No comments yet</Text>
            </View>
          )}
        </BottomSheetScrollView>

        {/* Footer Input - Absolutely positioned */}
        <View style={[styles.commentInputContainer, { bottom: keyboardHeight > 0 ? keyboardHeight : 20 }]}>
          <TextInput
            style={styles.commentInput}
            placeholder="Write your comment"
            placeholderTextColor="#FFFFFF"
            value={commentText}
            onChangeText={onCommentTextChange}
            onSubmitEditing={onSendComment}
            editable={!isSending}
          />
          <Pressable onPress={onSendComment} disabled={!commentText.trim() || isSending} style={styles.sendButton}>
            {isSending ? <ActivityIndicator size="small" color="#C708F7" /> : (
              <Image source={require('@/assets/images/comment1.png')} style={styles.sendIcon} />
            )}
          </Pressable>
        </View>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    overflow: 'hidden',
  },
  modalContent: { 
    backgroundColor: '#FFFFFF', 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20 
  },
  handleIndicator: { 
    backgroundColor: '#CCCCCC', 
    width: 40 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingVertical: 16, 
    paddingHorizontal: 20, 
    borderBottomColor: '#E0E0E0' 
  },
  headerTitle: { 
    fontSize: 20, 
    fontFamily: Fonts.bold, 
    color: '#000000' 
  },
  closeButton: { 
    position: 'absolute', 
    right: 20 
  },
  closeButtonText: { 
    fontSize: 24, 
    color: '#000000', 
    fontWeight: 'bold' 
  },
  content: { 
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Space for input container
  },
  commentItem: { 
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    paddingHorizontal: 20, 
    marginBottom: 16 
  },
  commentProfileImage: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    marginRight: 12 
  },
  commentContent: { 
    flex: 1 
  },
  commenterName: { 
    fontSize: 15, 
    fontFamily: Fonts.bold, 
    color: '#000' 
  },
  commentText: { 
    fontSize: 14, 
    color: '#222' 
  },
  commentTime: { 
    fontSize: 12, 
    color: '#999', 
    marginLeft: 8 
  },
  noCommentsContainer: { 
    paddingVertical: 50, 
    alignItems: 'center' 
  },
  noCommentsText: { 
    fontSize: 16, 
    color: '#666' 
  },
  commentInputContainer: { 
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgb(157, 38, 255)', 
    borderRadius: 20, 
    paddingHorizontal: 16, 
    paddingVertical: 12,
  },
  commentInput: { 
    flex: 1, 
    fontSize: 14, 
    color: '#FFFFFF', 
    marginRight: 8 
  },
  sendButton: { 
    width: 32, 
    height: 32, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  sendIcon: { 
    width: 24, 
    height: 24 
  },
});

export default CommentsModal;
