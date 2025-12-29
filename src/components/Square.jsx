import clsx from 'clsx';
import { motion } from 'framer-motion';
import Token from './ui/Token';

function Square({ value, onClick, disabled, index, isRelocating, isSelected, isValidDestination }) {
  const row = Math.floor(index / 3) + 1;
  const col = (index % 3) + 1;
  const ariaLabel = `${value || 'Empty'} square, row ${row}, column ${col}`;

  // Visual state logic
  const isInteractive = !disabled;
  const shouldHighlight = isValidDestination || isSelected;

  return (
    <motion.button
      whileHover={isInteractive ? { scale: 1.05 } : {}}
      whileTap={isInteractive ? { scale: 0.95 } : {}}
      className={clsx(
        // Base Glassmorphism styles for the square
        'relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-xl',
        'flex items-center justify-center',
        'border transition-all duration-300',

        // Conditional Styles
        // 1. Selected (being moved)
        isSelected ? 'bg-primary-glow/30 border-primary-glow shadow-glow-md z-10' :
          // 2. Valid Destination (target for move)
          isValidDestination ? 'bg-primary-accent/20 border-primary-accent/50 shadow-glow-sm cursor-pointer' :
            // 3. Filled (has token)
            value ? 'bg-navy-800/40 border-white/10' :
              // 4. Empty & Interactive (can place new)
              !disabled ? 'bg-navy-800/60 border-white/5 hover:bg-navy-800/80 hover:border-white/20 cursor-pointer' :
                // 5. Disabled (locked)
                'bg-navy-900/40 border-white/5 opacity-50 cursor-not-allowed'
      )}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-disabled={disabled}
    >
      {/* Target Indicator for relocation moves */}
      {isValidDestination && !value && (
        <div className="absolute inset-0 bg-primary-accent/10 rounded-xl animate-pulse" />
      )}

      {/* Render Token */}
      {value && <Token type={value} size="md" />}

    </motion.button>
  );
}

export default Square;
