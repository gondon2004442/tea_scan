import { Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { colors } from '../theme';
import { CameraIcon, SearchIcon } from './icons/TabIcons';

export type PickedImage = { base64: string; mediaType: string };

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  onPickImage: (image: PickedImage) => void;
  loading?: boolean;
};

/** Web file picker → base64 (no data: prefix). */
function pickImageWeb(onPick: (image: PickedImage) => void) {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return;
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = () => {
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result ?? '');
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      onPick({ base64, mediaType: file.type || 'image/jpeg' });
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

export function SearchBar({ value, onChangeText, onSubmit, onPickImage, loading }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.iconLeft}>
        <SearchIcon color="rgba(24, 0, 54, 0.5)" size={20} />
      </View>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        placeholder="Search a tea, or describe what you want…"
        placeholderTextColor="rgba(24, 0, 54, 0.4)"
        returnKeyType="search"
        editable={!loading}
      />
      <Pressable
        style={styles.cameraBtn}
        onPress={() => pickImageWeb(onPickImage)}
        accessibilityRole="button"
        accessibilityLabel="Search by photo"
        disabled={loading}
      >
        <CameraIcon color={colors.textPrimary} size={22} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    marginHorizontal: 13,
    marginBottom: 8,
    paddingHorizontal: 12,
    borderRadius: 1000,
    backgroundColor: colors.searchBarBg,
    borderWidth: 1,
    borderColor: colors.searchBarBorder,
  },
  iconLeft: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontFamily: 'Manrope, system-ui, sans-serif',
    fontSize: 15,
    color: colors.textPrimary,
  },
  cameraBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
});
