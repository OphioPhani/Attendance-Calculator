import { GlowCard } from '@/components/GlowCard';

export const GlowCardDemo = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center gap-8 bg-primary">
      <GlowCard glowColor="blue" size="md">
        <div className="flex flex-col h-full justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Blue Glow</h3>
            <p className="text-secondary">Mouse-tracking spotlight effect</p>
          </div>
          <div className="text-sm text-tertiary">Move your mouse</div>
        </div>
      </GlowCard>

      <GlowCard glowColor="purple" size="md">
        <div className="flex flex-col h-full justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Purple Glow</h3>
            <p className="text-secondary">Interactive highlight</p>
          </div>
          <div className="text-sm text-tertiary">Smooth animations</div>
        </div>
      </GlowCard>

      <GlowCard glowColor="green" size="md">
        <div className="flex flex-col h-full justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Green Glow</h3>
            <p className="text-secondary">Dynamic spotlight</p>
          </div>
          <div className="text-sm text-tertiary">Follows cursor</div>
        </div>
      </GlowCard>
    </div>
  );
};

export default GlowCardDemo;
