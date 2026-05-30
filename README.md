# Tea Scan

Web app for exploring Chinese teas and saving favorites — built with Expo 56 + expo-router.

## Run locally

```bash
cd mobile
npm install
npm run preview:web
```

Open http://localhost:3000/my-teas

## Data

- `data/top-50-chinese-teas-gongfu.csv` — tea catalog source
- `npm run generate:data` — regenerate `mobile/src/data/teas.generated.ts`

## Screens

- **My teas** — favorites list with bowl-style leaf photos
- **Explore** — 50-tea grid with time/category filters
- **Tea detail** — modal with steeping info and story
