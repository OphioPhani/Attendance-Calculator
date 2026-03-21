import React from 'react';
import { EnhancedGlowCard } from './EnhancedGlowCard.jsx';

export const CanvasRevealDemo = () => {
  return (
    <div className="w-full min-h-screen bg-primary p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-white mb-8">Canvas Reveal Effect Cards</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <EnhancedGlowCard
            glowColor="blue"
            size="md"
            animationSpeed={4}
            canvasColor={[0, 200, 255]}
          >
            <div className="flex flex-col h-full justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Blue Canvas</h3>
                <p className="text-gray-300">Hover to reveal dot matrix animation</p>
              </div>
              <p className="text-sm text-gray-400">Interactive effect</p>
            </div>
          </EnhancedGlowCard>

          <EnhancedGlowCard
            glowColor="purple"
            size="md"
            animationSpeed={5}
            canvasColor={[180, 100, 255]}
          >
            <div className="flex flex-col h-full justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Purple Canvas</h3>
                <p className="text-gray-300">Smooth animation transitions</p>
              </div>
              <p className="text-sm text-gray-400">WebGL powered</p>
            </div>
          </EnhancedGlowCard>

          <EnhancedGlowCard
            glowColor="green"
            size="md"
            animationSpeed={3.5}
            canvasColor={[100, 220, 100]}
          >
            <div className="flex flex-col h-full justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Green Canvas</h3>
                <p className="text-gray-300">Dynamic dot patterns</p>
              </div>
              <p className="text-sm text-gray-400">Real-time rendering</p>
            </div>
          </EnhancedGlowCard>
        </div>
      </div>
    </div>
  );
};

export default CanvasRevealDemo;
