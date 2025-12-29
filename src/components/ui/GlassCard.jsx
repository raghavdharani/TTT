import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export function GlassCard({ className, children, hoverEffect = false, ...props }) {
    return (
        <div
            className={twMerge(
                clsx(
                    // Base Glassmorphism styles
                    'bg-navy-800/40 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl',
                    'transition-all duration-300 ease-out',
                    // Hover effect
                    hoverEffect && 'hover:bg-navy-800/60 hover:scale-[1.02] hover:shadow-glow-sm hover:border-primary-glow/40',
                    className
                )
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export default GlassCard;
