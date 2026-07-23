import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import type { HairPhotoVM } from '../types';
import { InlineLoader } from '@/shared/components';

interface DeletePhotoDialogProps {
  readonly visible: boolean;
  readonly photo: HairPhotoVM | null;
  readonly isDeleting?: boolean;
  readonly onConfirm: () => Promise<void>;
  readonly onCancel: () => void;
}

export const DeletePhotoDialog: React.FC<DeletePhotoDialogProps> = React.memo(
  function DeletePhotoDialog({ visible, photo, isDeleting = false, onConfirm, onCancel }) {
    if (!photo) return null;

    return (
      <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
        <View className="flex-1 bg-black/80 justify-center items-center p-6">
          <View className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 w-full max-w-sm gap-4">
            <View className="items-center gap-1">
              <Text className="text-zinc-100 text-lg font-bold">Delete Progress Photo?</Text>
              <Text className="text-zinc-400 text-xs text-center">
                Are you sure you want to delete this photo captured on {photo.formattedDate}? This action cannot be undone.
              </Text>
            </View>

            <View className="flex-row gap-3 pt-2">
              <TouchableOpacity
                className="flex-1 bg-zinc-800 border border-zinc-700 py-3 rounded-xl items-center"
                onPress={onCancel}
                disabled={isDeleting}
                accessibilityRole="button"
              >
                <Text className="text-zinc-300 font-semibold text-xs">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-rose-600 active:bg-rose-700 py-3 rounded-xl items-center shadow-md shadow-rose-600/30"
                onPress={() => void onConfirm()}
                disabled={isDeleting}
                accessibilityRole="button"
              >
                {isDeleting ? (
                  <InlineLoader label="..." color="#ffffff" />
                ) : (
                  <Text className="text-white font-extrabold text-xs">Delete Photo</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
);
