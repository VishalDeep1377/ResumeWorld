import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'accent' | 'white';
  text?: string;
  fullScreen?: boolean;
}

const LoadingSpinner = ({ 
  size = 'md', 
  variant = 'primary', 
  text = 'Loading...', 
  fullScreen = false 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24'
  };

  const colorClasses = {
    primary: 'border-blue-500',
    secondary: 'border-green-500',
    accent: 'border-purple-500',
    white: 'border-white'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const containerClasses = fullScreen 
    ? 'fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-50'
    : 'flex flex-col items-center justify-center py-8';

  return (
    <motion.div 
      className={containerClasses}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Main Spinner */}
      <div className="relative">
        {/* Outer Ring */}
        <motion.div
          className={`${sizeClasses[size]} ${colorClasses[variant]} border-4 border-t-transparent rounded-full`}
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Inner Ring */}
        <motion.div
          className={`absolute inset-2 ${colorClasses[variant]} border-2 border-b-transparent rounded-full`}
          animate={{ rotate: -360 }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Center Dot */}
        <motion.div
          className={`absolute inset-0 flex items-center justify-center`}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className={`w-2 h-2 ${variant === 'white' ? 'bg-white' : variant === 'primary' ? 'bg-blue-500' : variant === 'secondary' ? 'bg-green-500' : 'bg-purple-500'} rounded-full`} />
        </motion.div>
      </div>

      {/* Loading Text */}
      {text && (
        <motion.p 
          className={`mt-4 ${textSizeClasses[size]} text-gray-300 font-medium`}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {text}
        </motion.p>
      )}

      {/* Pulse Effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.1, 0.3]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          background: variant === 'primary' 
            ? 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)'
            : variant === 'secondary'
            ? 'radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%)'
            : variant === 'accent'
            ? 'radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)'
        }}
      />
    </motion.div>
  );
};

export default LoadingSpinner;