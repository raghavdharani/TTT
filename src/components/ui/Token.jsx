import { motion } from 'framer-motion';
import clsx from 'clsx';

export function Token({ type, size = 'md', className }) {
    const isX = type === 'X';

    // Size variants
    const sizes = {
        sm: 'w-6 h-6',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
    };

    const strokeWidth = size === 'sm' ? 3 : 2;

    // Animation variants
    const containerVariants = {
        initial: { scale: 0, opacity: 0 },
        enter: {
            scale: 1,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 20
            }
        },
        exit: {
            scale: 0,
            opacity: 0,
            transition: { duration: 0.2 }
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            className={clsx('relative flex items-center justify-center', sizes[size], className)}
        >
            {/* Glow Effect */}
            <div
                className={clsx(
                    'absolute inset-0 blur-md rounded-full opacity-60',
                    isX ? 'bg-token-x' : 'bg-token-o'
                )}
            />

            {isX ? (
                // X Token: Pulse Animation
                <svg
                    viewBox="0 0 24 24"
                    className="w-full h-full text-token-x relative z-10 drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]"
                >
                    <motion.path
                        d="M18 6L6 18M6 6l12 12"
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        animate={{
                            opacity: [0.8, 1, 0.8],
                            filter: ["drop-shadow(0 0 2px rgba(220,38,38,0.5))", "drop-shadow(0 0 8px rgba(220,38,38,0.8))", "drop-shadow(0 0 2px rgba(220,38,38,0.5))"]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </svg>
            ) : (
                // O Token: Rotate Animation
                <svg
                    viewBox="0 0 24 24"
                    className="w-full h-full text-token-o relative z-10 drop-shadow-[0_0_8px_rgba(37,99,235,0.8)]"
                >
                    <motion.circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        strokeLinecap="round"
                        strokeDasharray="50 15" // Creates a gap to make rotation visible
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                </svg>
            )}
        </motion.div>
    );
}

export default Token;
