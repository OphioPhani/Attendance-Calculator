# GlowCard Component - Usage Guide

## Overview
The `GlowCard` component is an interactive spotlight effect card that follows your mouse cursor. It creates a dynamic glow effect that changes color based on mouse position.

## Location
- **Component**: `/client/src/components/GlowCard.jsx`
- **Demo**: `/client/src/components/GlowCardDemo.jsx`

## Features
- ✨ Mouse-tracking spotlight effect
- 🎨 5 glow color options
- 📏 3 predefined sizes (sm, md, lg)
- 🎯 Custom sizing support
- 🌀 Dynamic hue calculation based on cursor position
- 💫 Smooth animations and backdrop blur

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | - | Content to display inside the card |
| `className` | string | `''` | Additional Tailwind classes |
| `glowColor` | string | `'blue'` | Glow color: `'blue'`, `'purple'`, `'green'`, `'red'`, `'orange'` |
| `size` | string | `'md'` | Card size: `'sm'` (w-48 h-64), `'md'` (w-64 h-80), `'lg'` (w-80 h-96) |
| `width` | string \| number | - | Custom width (overrides size prop) |
| `height` | string \| number | - | Custom height (overrides size prop) |
| `customSize` | boolean | `false` | Use width/height instead of size prop |

## Usage Examples

### Basic Usage
```jsx
import { GlowCard } from '@/components/GlowCard';

export default function Example() {
  return (
    <GlowCard glowColor="blue" size="md">
      <h3 className="text-white font-bold">Content Here</h3>
      <p className="text-secondary">Move your mouse over the card</p>
    </GlowCard>
  );
}
```

### Multiple Cards with Different Colors
```jsx
<div className="flex gap-8">
  <GlowCard glowColor="blue">
    <div>Blue Spotlight</div>
  </GlowCard>
  <GlowCard glowColor="purple">
    <div>Purple Spotlight</div>
  </GlowCard>
  <GlowCard glowColor="green">
    <div>Green Spotlight</div>
  </GlowCard>
</div>
```

### Custom Sizing
```jsx
<GlowCard
  glowColor="orange"
  customSize={true}
  width={400}
  height={500}
>
  <div>Custom sized card</div>
</GlowCard>
```

### In Dashboard
```jsx
import { GlowCard } from '@/components/GlowCard';

export function DashboardWithGlowCards() {
  return (
    <div className="grid grid-cols-3 gap-6">
      <GlowCard glowColor="green" size="md">
        <h3 className="text-white font-bold">Attendance</h3>
        <p className="mt-auto text-2xl font-bold text-green-400">92%</p>
      </GlowCard>

      <GlowCard glowColor="blue" size="md">
        <h3 className="text-white font-bold">Present</h3>
        <p className="mt-auto text-2xl font-bold text-info">45</p>
      </GlowCard>

      <GlowCard glowColor="red" size="md">
        <h3 className="text-white font-bold">Absent</h3>
        <p className="mt-auto text-2xl font-bold text-red-400">5</p>
      </GlowCard>
    </div>
  );
}
```

## Hover Behavior
- The card tracks your mouse position globally
- A spotlight effect appears where your mouse is
- The glow color shifts based on horizontal mouse position (X-axis)
- The effect is smooth and responsive

## Color Mapping
- **Blue**: Base hue 220°, spread 200
- **Purple**: Base hue 280°, spread 300
- **Green**: Base hue 120°, spread 200
- **Red**: Base hue 0°, spread 200
- **Orange**: Base hue 30°, spread 200

## Browser Support
Works in all modern browsers that support:
- CSS custom properties (variables)
- radial-gradient()
- backdrop-filter
- Pointer events
- CSS mask properties

## Performance Notes
- Uses CSS custom properties for real-time updates (no repaints)
- Pointer events are optimized with passive listeners
- Uses `will-change: filter` for GPU acceleration
- Suitable for production use on modern devices
