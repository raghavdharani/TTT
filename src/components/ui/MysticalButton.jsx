import { motion } from 'framer-motion';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export function MysticalButton({ className, children, variant = 'primary', ...props }) {
    const baseStyles = 'relative overflow-hidden rounded-xl font-medium transition-all duration-300 flex items-center justify-center';

    const variants = {
        primary: 'bg-indigo-600/80 hover:bg-indigo-500 text-white shadow-glow-sm hover:shadow-glow-md border border-indigo-400/30',
        secondary: 'bg-white/5 hover:bg-white/10 text-white/90 border border-white/10 hover:border-white/20',
        ghost: 'bg-transparent hover:bg-white/5 text-white/70 hover:text-white',
        icon: 'p-3 rounded-full bg-navy-800/50 hover:bg-navy-700 border border-white/10 hover:shadow-glow-sm text-white'
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={twMerge(clsx(baseStyles, variants[variant], className))}
            {...props}
        >
            {/* Underlying glow layer for primary buttons */}
            {variant === 'primary' && (
                <span className="absolute inset-0 bg-primary-glow/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            )}
            <span className="relative z-10 flex items-center gap-2">{children}</span>
        </motion.button>
    );
}

export default MysticalButton;
