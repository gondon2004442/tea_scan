# Tea Scan — mobile UI

Pixel-aligned implementation of the [Figma design](https://www.figma.com/design/fx7ltjEq3qUX9uEQVODybY/Untitled?node-id=0-165&m=dev) (frame **390×844**).

## Screens

- **My teas** — green gradient, vertical list, 206px tea images
- **Explore** — purple gradient, filter chips, 2-column grid (160px cards)
- **Tea detail** — modal card with steeping rings

## Run

```bash
cd mobile
npm start
```

Scan the QR code with **Expo Go**, or press `w` for web preview.

## Figma tokens used

| Token | Value |
|-------|--------|
| Text primary | `#180036` |
| My teas gradient | `#DCE49C` → white (60%) |
| Explore gradient | `#9CAAE4` → `#F5EEFF` (60%) |
| Tea name | 17px / line-height 28 |
| Modal title | 44px / line-height 50 |
| Tab toggle | 112×48, item 56×48 |
| Safari bar | 334×114, bottom offset 28 |

Fonts in Figma: **Muse Sans VF** (lists), **PP Right Grotesk Wide** (filters & modal). The app uses system sans-serif at the same sizes; add font files under `assets/fonts/` and load with `expo-font` for an exact match.

Assets exported from Figma are in `assets/images/`.
