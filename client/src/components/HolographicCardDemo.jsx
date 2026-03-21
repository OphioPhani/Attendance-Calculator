import React from 'react';
import HolographicCard from './HolographicCard.jsx';

/**
 * Holographic Card Demo Component
 * Showcases the 3D tilt and glow effects on hover
 */
export const HolographicCardDemo = () => {
  return (
    <div className="w-full min-h-screen bg-primary p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <h1 className="text-4xl font-bold text-white mb-8">Holographic Cards</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <HolographicCard className="flex flex-col items-center justify-center p-8 min-h-80">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">3D Perspective</h3>
              <p className="text-gray-300">Hover to see the tilt effect</p>
            </div>
          </HolographicCard>

          <HolographicCard className="flex flex-col items-center justify-center p-8 min-h-80">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-cyan-300 mb-2">Holographic Glow</h3>
              <p className="text-gray-300">Watch the radiant light follow</p>
            </div>
          </HolographicCard>

          <HolographicCard className="flex flex-col items-center justify-center p-8 min-h-80">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-green-300 mb-2">Interactive</h3>
              <p className="text-gray-300">Smooth animations on motion</p>
            </div>
          </HolographicCard>
        </div>

        {/* Stats Example */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Dashboard Cards Example</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <HolographicCard className="flex flex-col justify-between p-6">
              <p className="text-sm text-gray-300">Present Days</p>
              <p className="text-3xl font-bold text-cyan-300">45</p>
            </HolographicCard>
            <HolographicCard className="flex flex-col justify-between p-6">
              <p className="text-sm text-gray-300">Absent Days</p>
              <p className="text-3xl font-bold text-red-300">8</p>
            </HolographicCard>
            <HolographicCard className="flex flex-col justify-between p-6">
              <p className="text-sm text-gray-300">Attendance %</p>
              <p className="text-3xl font-bold text-green-300">85%</p>
            </HolographicCard>
            <HolographicCard className="flex flex-col justify-between p-6">
              <p className="text-sm text-gray-300">Days Recorded</p>
              <p className="text-3xl font-bold text-blue-300">53</p>
            </HolographicCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HolographicCardDemo;
