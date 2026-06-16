import { ImageSourcePropType } from 'react-native';
import { TEA_IMAGE_SOURCES } from './data/tea-images.generated';
import { layout } from './theme';

export type TeaImageOffset = {
  width: number;
  height: number;
  marginLeft: number;
  marginTop: number;
};

type MyTeasPreviewTea = {
  id: string;
  name: string;
  image?: string | null;
  imageAsset?: DemoTeaImageKey;
  imageOffset?: TeaImageOffset;
};

export const images = {
  iconSun: require('../assets/images/icon-sun.png'),
  iconMoon: require('../assets/images/icon-moon.png'),
  iconSmile: require('../assets/images/icon-smile.png'),
  iconHeart: require('../assets/images/icon-heart.png'),
  iconExplore: require('../assets/images/icon-explore.png'),
  iconReload: require('../assets/images/icon-reload.png'),
  iconSettings: require('../assets/images/icon-settings.png'),
  divider: require('../assets/images/divider.png'),
  cloud: require('../assets/images/cloud.png'),
  loginLeavesBg: require('../assets/images/login/leaves-bg.png'),
  loginGoogleSignIn: require('../assets/images/login/google-sign-in.png'),
} as const;

export const demoTeaImages = {
  dhp1: require('../assets/images/demo/tea-dhp-1.png'),
  dhp2: require('../assets/images/demo/tea-dhp-2.png'),
  zgf: require('../assets/images/demo/tea-zgf.png'),
} as const;

export const teaPlaceholderImage = require('../assets/images/tea-placeholder.png');

export type DemoTeaImageKey = keyof typeof demoTeaImages;

const bowl = layout.cardImageMyTeas;

export const bowlPreviewOffsets: Record<DemoTeaImageKey, TeaImageOffset> = {
  dhp1: {
    width: bowl * 1.2026,
    height: bowl * 1.2026,
    marginLeft: -bowl * 0.1111,
    marginTop: -bowl * 0.098,
  },
  dhp2: {
    width: bowl * 1.0904,
    height: bowl * 1.0904,
    marginLeft: -bowl * 0.0426,
    marginTop: -bowl * 0.0592,
  },
  zgf: {
    width: bowl * 1.1473,
    height: bowl * 1.1338,
    marginLeft: -bowl * 0.0764,
    marginTop: -bowl * 0.0701,
  },
};

const MY_TEAS_BOWL_BY_ID: Record<string, DemoTeaImageKey> = {
  'da-hong-pao': 'dhp1',
  'my-1': 'dhp1',
  'my-3': 'dhp2',
  'tie-guan-yin': 'zgf',
  'my-2': 'zgf',
  'my-4': 'zgf',
};

function bowlKeyForTea(tea: Pick<MyTeasPreviewTea, 'id' | 'name'>): DemoTeaImageKey {
  if (MY_TEAS_BOWL_BY_ID[tea.id]) {
    return MY_TEAS_BOWL_BY_ID[tea.id];
  }
  const name = tea.name.toLowerCase();
  if (name.includes('zui gui fei') || name.includes('tie guan yin')) {
    return 'zgf';
  }
  if (name.includes('da hong pao')) {
    return 'dhp1';
  }
  const pool: DemoTeaImageKey[] = ['dhp1', 'dhp2', 'zgf'];
  const hash = tea.id.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return pool[hash % pool.length];
}

export function bowlCoverImageStyle(imageSize: number): TeaImageOffset {
  return {
    width: imageSize,
    height: imageSize,
    marginLeft: 0,
    marginTop: 0,
  };
}

export function bowlContainImageStyle(imageSize: number): TeaImageOffset {
  return bowlCoverImageStyle(imageSize);
}

function listUrlCropOffset(): TeaImageOffset {
  return bowlCoverImageStyle(bowl);
}

/** Placeholder bowl in 160×160 circle: 144×109, centered */
export function placeholderCropOffset(imageSize: number): TeaImageOffset {
  const exploreCircle = layout.cardImageExplore;
  const iconWidth = 144;
  const iconHeight = 109;
  const scale = imageSize / exploreCircle;
  const width = iconWidth * scale;
  const height = iconHeight * scale;
  return {
    width,
    height,
    marginLeft: (imageSize - width) / 2,
    marginTop: (imageSize - height) / 2,
  };
}

export function teaUsesPlaceholder(tea: {
  id: string;
  image?: string | null;
  imageAsset?: DemoTeaImageKey;
}): boolean {
  if (tea.imageAsset && tea.id.startsWith('my-')) {
    return false;
  }
  if (TEA_IMAGE_SOURCES[tea.id]) {
    return false;
  }
  return !tea.image;
}

export function resolveTeaImageSource(
  teaId: string,
  imageUrl: string | null,
  imageAsset?: DemoTeaImageKey,
): ImageSourcePropType {
  if (imageAsset) {
    return demoTeaImages[imageAsset];
  }
  if (TEA_IMAGE_SOURCES[teaId]) {
    return TEA_IMAGE_SOURCES[teaId];
  }
  if (imageUrl) {
    return { uri: imageUrl };
  }
  return teaPlaceholderImage;
}

export function resolveTeaImage(
  teaId: string,
  imageUrl: string | null,
  imageAsset?: DemoTeaImageKey,
): ImageSourcePropType {
  return resolveTeaImageSource(teaId, imageUrl, imageAsset);
}

export function getTeaImagePreloadSources(): ImageSourcePropType[] {
  return [
    ...Object.values(TEA_IMAGE_SOURCES),
    ...Object.values(demoTeaImages),
    teaPlaceholderImage,
  ];
}

/** My teas list: Figma demo bowls for my-* ids, otherwise unique rooteas photo per tea */
export function resolveMyTeasListImage(tea: MyTeasPreviewTea): {
  source: ImageSourcePropType;
  offset: TeaImageOffset;
} {
  if (tea.imageAsset && tea.id.startsWith('my-')) {
    const asset = tea.imageAsset;
    return {
      source: demoTeaImages[asset],
      offset: tea.imageOffset ?? bowlPreviewOffsets[asset],
    };
  }

  if (tea.image || TEA_IMAGE_SOURCES[tea.id]) {
    return {
      source: resolveTeaImageSource(tea.id, tea.image ?? null),
      offset: tea.imageOffset ?? listUrlCropOffset(),
    };
  }

  return {
    source: teaPlaceholderImage,
    offset: placeholderCropOffset(bowl),
  };
}
