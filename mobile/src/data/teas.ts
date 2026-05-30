import { DemoTeaImageKey } from '../assets';
import { layout } from '../theme';
import { TEA_SEEDS } from './teas.generated';

export type TimeIcon = 'sun' | 'moon' | 'none';

export type TeaImageOffset = {
  width: number;
  height: number;
  marginLeft: number;
  marginTop: number;
};

export interface Tea {
  id: string;
  name: string;
  category: string;
  timeToDrink: string;
  steepingPours: string[];
  steepingExtra?: string;
  temperature: string;
  leafRatio: string;
  story: string;
  image: string | null;
  imageAsset?: DemoTeaImageKey;
  imageOffset?: TeaImageOffset;
  timeIcon: TimeIcon;
  nameWeight: 'semibold' | 'medium';
}

function parseSteeping(raw: string): { pours: string[]; extra?: string } {
  const rinseMatch = raw.match(/Rinse[^,]*,\s*then\s*(.+)/i);
  const body = rinseMatch ? rinseMatch[1] : raw;
  const parts = body.split('→').map((p) => p.trim());
  const last = parts[parts.length - 1];
  if (last?.startsWith('+')) {
    return { pours: parts.slice(0, -1), extra: last };
  }
  return { pours: parts };
}

function tea(seed: {
  id: string;
  name: string;
  category: string;
  timeToDrink: string;
  steeping: string;
  temperature: string;
  leafRatio: string;
  story: string;
  imageUrl: string | null;
  timeIcon: Exclude<TimeIcon, 'none'>;
  nameWeight: Tea['nameWeight'];
}): Tea {
  const normalizedCategory = seed.category
    .replace("Pu'erh", 'Pu-erh')
    .replace('Puerh', 'Pu-erh');
  const { pours, extra } = parseSteeping(seed.steeping);
  return {
    id: seed.id,
    name: seed.name,
    category: normalizedCategory,
    timeToDrink: seed.timeToDrink,
    steepingPours: pours,
    steepingExtra: extra,
    temperature: seed.temperature,
    leafRatio: seed.leafRatio,
    story: seed.story,
    image: seed.imageUrl,
    timeIcon: seed.timeIcon,
    nameWeight: seed.nameWeight,
  };
}

/** Explore catalog from CSV seeds */
export const TEAS: Tea[] = TEA_SEEDS.map((seed) => tea(seed));

const dhp = TEAS.find((teaItem) => teaItem.id === 'da-hong-pao')!;
const zgf = TEAS.find((teaItem) => teaItem.id === 'tie-guan-yin')!;

const bowl = layout.cardImageMyTeas;

/** Figma My teas demo list (node 0:166) */
export const MY_TEAS: Tea[] = [
  {
    ...dhp,
    id: 'my-1',
    name: 'Da Hong Pao',
    nameWeight: 'semibold',
    timeIcon: 'sun',
    imageAsset: 'dhp1',
    imageOffset: {
      width: bowl * 1.2026,
      height: bowl * 1.2026,
      marginLeft: -bowl * 0.1111,
      marginTop: -bowl * 0.098,
    },
  },
  {
    ...zgf,
    id: 'my-2',
    name: 'Zui Gui Fei',
    nameWeight: 'medium',
    timeIcon: 'moon',
    imageAsset: 'zgf',
    imageOffset: {
      width: bowl * 1.1473,
      height: bowl * 1.1338,
      marginLeft: -bowl * 0.0764,
      marginTop: -bowl * 0.0701,
    },
  },
  {
    ...dhp,
    id: 'my-3',
    name: 'Da Hong Pao',
    nameWeight: 'medium',
    timeIcon: 'none',
    imageAsset: 'dhp2',
    imageOffset: {
      width: bowl * 1.0904,
      height: bowl * 1.0904,
      marginLeft: -bowl * 0.0426,
      marginTop: -bowl * 0.0592,
    },
  },
  {
    ...zgf,
    id: 'my-4',
    name: 'Zui Gui Fei',
    nameWeight: 'medium',
    timeIcon: 'none',
    imageAsset: 'zgf',
    imageOffset: {
      width: bowl * 1.1473,
      height: bowl * 1.1338,
      marginLeft: -bowl * 0.0764,
      marginTop: -bowl * 0.0701,
    },
  },
];

export function getTeaById(id: string): Tea | undefined {
  return TEAS.find((t) => t.id === id) ?? MY_TEAS.find((t) => t.id === id);
}

export function getTeasByIds(ids: string[]): Tea[] {
  const map = new Map(TEAS.map((tea) => [tea.id, tea]));
  return ids.map((id) => map.get(id)).filter(Boolean) as Tea[];
}

export function formatTimeToDrink(time: string): string {
  return time.replace(/\s*\/\s*/g, ', ').replace('Morning / Afternoon', 'Morning, afternoon');
}
