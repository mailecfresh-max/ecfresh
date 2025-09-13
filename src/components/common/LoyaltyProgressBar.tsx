import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface LoyaltyProgressBarProps {
  currentPoints: number;
  unlockThreshold?: number;
  canUseLoyalty: boolean;
}

const LoyaltyProgressBar: React.FC<LoyaltyProgressBarProps> = ({
  currentPoints,
  unlockThreshold = 300,
  canUseLoyalty
}) => {
  const progressPercentage = Math.min((currentPoints / unlockThreshold) * 100, 100);
  const isUnlocked = currentPoints >= unlockThreshold;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900">Loyalty Credits</h3>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-green-600">₹{currentPoints}</div>
          {!isUnlocked && (
            <div className="text-xs text-gray-500">₹{unlockThreshold - currentPoints} to unlock</div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full rounded-full ${
            isUnlocked
              ? 'bg-gradient-to-r from-green-400 to-green-600'
              : 'bg-gradient-to-r from-orange-400 to-orange-500'
          }`}
        />
        {isUnlocked && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute right-1 top-1/2 transform -translate-y-1/2"
          >
            <Sparkles className="w-2 h-2 text-white fill-current" />
          </motion.div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-600">
          {isUnlocked ? 'Unlocked! Ready to use' : `${Math.round(progressPercentage)}% complete`}
        </span>
        {canUseLoyalty && (
          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
            Can use credits
          </span>
        )}
      </div>

      {!isUnlocked && (
        <div className="text-xs text-gray-500 mt-2 text-center">
          Earn 10% back on orders • Unlock usage at ₹{unlockThreshold}
        </div>
      )}
    </div>
  );
};

export default LoyaltyProgressBar;