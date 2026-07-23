import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';

interface ArchiveRoutineDialogProps {
  readonly visible: boolean;
  readonly routineTitle: string;
  readonly isArchived?: boolean;
  readonly isLoading?: boolean;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
}

export const ArchiveRoutineDialog: React.FC<ArchiveRoutineDialogProps> = React.memo(
  function ArchiveRoutineDialog({
    visible,
    routineTitle,
    isArchived = false,
    isLoading = false,
    onConfirm,
    onCancel,
  }) {
    if (!visible) return null;

    const actionText = isArchived ? 'Restore' : 'Archive';
    const descriptionText = isArchived
      ? `This will restore "${routineTitle}" back to your active routines.`
      : `Archiving "${routineTitle}" will pause reminders and hide it from your active list. Your completion history will be preserved.`;

    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onCancel}
      >
        <View className="flex-1 bg-black/70 justify-center items-center p-4">
          <View className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-sm gap-4 shadow-2xl">
            <Text className="text-zinc-100 text-lg font-bold">
              {actionText} Routine?
            </Text>

            <Text className="text-zinc-400 text-sm leading-relaxed">
              {descriptionText}
            </Text>

            <View className="flex-row items-center justify-end gap-3 pt-2">
              <TouchableOpacity
                className="px-4 py-2.5 rounded-xl bg-zinc-800 active:bg-zinc-700"
                onPress={onCancel}
                disabled={isLoading}
                accessibilityRole="button"
                accessibilityLabel="Cancel"
              >
                <Text className="text-zinc-300 font-semibold text-sm">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`px-4 py-2.5 rounded-xl active:opacity-80 ${
                  isArchived ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
                onPress={onConfirm}
                disabled={isLoading}
                accessibilityRole="button"
                accessibilityLabel={`Confirm ${actionText}`}
              >
                <Text className="text-zinc-950 font-bold text-sm">
                  {isLoading ? 'Processing...' : actionText}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
);
