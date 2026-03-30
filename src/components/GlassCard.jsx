import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

const GlassCard = ({ 
  children, 
  className = '', 
  animate = true,
  ...props 
}) => {
  const Component = animate ? motion.div : 'div';
  
  const animationProps = animate ? {
    initial: { opacity: 0, y: 20, filter: 'blur(10px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    transition: { duration: 0.5, ease: 'easeOut' }
  } : {};

  return (
    <Component
      className={cn(
        'glass-panel rounded-3xl shadow-2xl overflow-hidden',
        className
      )}
      {...animationProps}
      {...props}
    >
      {children}
    </Component>
  );
};

export default GlassCard;
