import { motion } from 'framer-motion';

const BackgroundOrbs = () => {
  const orbs = [
    { color: 'var(--orb-1)', size: 400, x: '10%', y: '20%', duration: 25 },
    { color: 'var(--orb-2)', size: 350, x: '70%', y: '60%', duration: 30 },
    { color: 'var(--orb-3)', size: 300, x: '80%', y: '10%', duration: 20 },
    { color: 'var(--orb-1)', size: 250, x: '20%', y: '70%', duration: 35 },
    { color: 'var(--orb-3)', size: 200, x: '50%', y: '40%', duration: 28 },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {orbs.map((orb, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle, ${orb.color}40 0%, transparent 70%)`,
            filter: 'blur(80px)',
          }}
          animate={{
            x: [0, 50, -30, 20, 0],
            y: [0, -40, 30, -20, 0],
            scale: [1, 1.1, 0.95, 1.05, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

export default BackgroundOrbs;
