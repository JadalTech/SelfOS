import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

interface UploadPhotoButtonProps {
  readonly onPress: () => void;
  readonly label?: string;
  readonly isUploading?: boolean;
}

export const UploadPhotoButton: React.FC<UploadPhotoButtonProps> = React.memo(
  function UploadPhotoButton({ onPress, label = '+ Upload Progress Photo', isUploading = false }) {
    return (
      <TouchableOpacity
        className="bg-amber-500 active:bg-amber-600 px-4 py-3 rounded-xl flex-row items-center justify-center shadow-md shadow-amber-500/20"
        onPress={onPress}
        disabled={isUploading}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        <Text className="text-zinc-950 font-extrabold text-xs">
          {isUploading ? 'Uploading Photo...' : label}
        </Text>
      </TouchableOpacity>
    );
  }
);
