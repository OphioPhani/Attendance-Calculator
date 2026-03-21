# CanvasRevealEffect Integration Guide

## Overview
The `CanvasRevealEffect` component is a WebGL-powered dot matrix animation effect that appears on hover. It creates a beautiful animated pattern of colored dots that reveals smoothly with custom opacities and animation speeds.

## Location
- **Component**: `/client/src/components/CanvasRevealEffect.jsx`
- **Enhanced Card Wrapper**: `/client/src/components/EnhancedGlowCard.jsx`
- **Demo**: `/client/src/components/CanvasRevealDemo.jsx`

## Dependencies
- `three` - 3D graphics library
- `@react-three/fiber` - React renderer for Three.js
- `framer-motion` - Animation library (for smooth entrance/exit)

## Features
- ✨ WebGL-powered dot matrix animation
- 🎨 Customizable colors (RGB values)
- ⚡ Adjustable animation speed
- 🎯 Smooth hover detection with Framer Motion
- 💫 Combined with GlowCard for dual effect
- 🔧 Flexible component composition

## Component Props

### CanvasRevealEffect
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `animationSpeed` | number | 0.4 | Animation speed factor (0.1-1.0) |
| `opacities` | number[] | [0.3, ...] | Array of 10 opacity values |
| `colors` | number[][] | [[0, 255, 255]] | Array of RGB color arrays |
| `containerClassName` | string | '' | Additional Tailwind classes |
| `dotSize` | number | 3 | Size of individual dots |
| `showGradient` | boolean | true | Show gradient overlay |

### EnhancedGlowCard (Recommended)
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `glowColor` | string | 'blue' | GlowCard color: `'blue'`, `'purple'`, `'green'`, `'red'`, `'orange'` |
| `size` | string | 'md' | Card size: `'sm'`, `'md'`, `'lg'` |
| `animationSpeed` | number | 3 | Canvas animation speed |
| `canvasColor` | number[] | [0, 200, 255] | RGB color values [R, G, B] |
| `showCanvasEffect` | boolean | true | Enable/disable canvas effect on hover |
| `className` | string | '' | Additional Tailwind classes |

## Usage Examples

### Basic EnhancedGlowCard
```jsx
import { EnhancedGlowCard } from '@/components/EnhancedGlowCard';

export default function Stats() {
  return (
    <EnhancedGlowCard
      glowColor="blue"
      size="md"
      animationSpeed={4}
      canvasColor={[0, 200, 255]}
    >
      <h3>Present Days</h3>
      <p className="text-3xl font-bold">45</p>
    </EnhancedGlowCard>
  );
}
```

### With Custom Colors
```jsx
<EnhancedGlowCard
  glowColor="purple"
  animationSpeed={5}
  canvasColor={[180, 100, 255]}
>
  <div>Custom Purple Effect</div>
</EnhancedGlowCard>
```

### Multiple Cards in Grid
```jsx
<div className="grid grid-cols-3 gap-6">
  <EnhancedGlowCard glowColor="blue" canvasColor={[0, 200, 255]}>
    <div>Blue Card</div>
  </EnhancedGlowCard>
  <EnhancedGlowCard glowColor="green" canvasColor={[100, 220, 100]}>
    <div>Green Card</div>
  </EnhancedGlowCard>
  <EnhancedGlowCard glowColor="red" canvasColor={[255, 100, 100]}>
    <div>Red Card</div>
  </EnhancedGlowCard>
</div>
```

## Color Reference
Common RGB color values for `canvasColor`:
- **Blue**: `[0, 200, 255]`
- **Purple**: `[180, 100, 255]`
- **Green**: `[100, 220, 100]`
- **Red**: `[255, 100, 100]`
- **Orange**: `[255, 150, 50]`
- **Cyan**: `[0, 255, 255]`
- **Pink**: `[255, 100, 200]`

## Animation Speed Guide
- `2.0-3.0` - Slow, relaxed animation
- `3.5-4.5` - Medium, default speed
- `5.0-7.0` - Fast, energetic animation
- `>7.0` - Very fast, intense animation

## How It Works
1. **GlowCard Base** - Provides the spotlight effect that follows the cursor
2. **Hover Detection** - `EnhancedGlowCard` tracks mouse enter/leave
3. **Canvas Animation** - On hover, `CanvasRevealEffect` renders a WebGL dot matrix
4. **Smooth Transition** - Framer Motion provides fade in/out animation
5. **Gradient Overlay** - Subtle gradient improves visual hierarchy

## Browser Compatibility
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+
- Requires WebGL support

## Performance Notes
- Uses GPU acceleration via Three.js
- Optimized for 60 FPS rendering
- Canvas only renders on hover (minimal performance impact)
- Suitable for production use

## Dashboard Integration
All stat cards in the Dashboard now use `EnhancedGlowCard`:
- **Top Stats** (Present Days, Absent Days, Attendance %)
- **Metrics Cards** (Days Recorded, Attended, Absent, Percentage)
- Each card has color-coded canvas effects matching its semantic meaning

## Troubleshooting

### Canvas not rendering on hover
- Ensure Three.js and @react-three/fiber are installed
- Check browser console for WebGL errors
- Verify `showCanvasEffect={true}` prop

### Animation too fast/slow
- Adjust `animationSpeed` prop (range: 0.5-10)
- Values <2 may appear frozen, values >8 may be jarring

### Colors not matching
- Use RGB values 0-255
- Test color picker: `[R, G, B]` format
- Blue examples: [0, 150, 255], [0, 200, 255], [100, 200, 255]

## Files Modified
- **Dashboard.jsx** - Updated stat cards to use `EnhancedGlowCard`
- **package.json** - Added `three` and `@react-three/fiber` dependencies

## Installation
```bash
cd client
npm install --legacy-peer-deps three @react-three/fiber
npm run dev
```
