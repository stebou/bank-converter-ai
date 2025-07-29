'use client';
import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';

// Composant optimisé pour un carré lumineux
const FastSquare = ({
  x,
  y,
  size,
  delay,
}: {
  x: number;
  y: number;
  size: number;
  delay: number;
}) => {
  const pathData = `M ${x} ${y} L ${x + size} ${y} L ${x + size} ${y + size} L ${x} ${y + size} Z`;

  return (
    <motion.path
      d={pathData}
      stroke="rgba(59, 130, 246, 0.9)"
      strokeWidth="1.2"
      fill="transparent"
      vectorEffect="non-scaling-stroke"
      style={{ willChange: 'auto' }}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ 
        pathLength: [0, 1, 0],
        opacity: [0, 1, 0]
      }}
      transition={{
        duration: 1.7,
        delay,
        repeat: Infinity,
        repeatDelay: 1.2,
        ease: "linear"
      }}
    />
  );
};

// Ligne horizontale optimisée
const FastHorizontalLine = ({ y, delay }: { y: number; delay: number }) => (
  <motion.path
    d={`M 0 ${y} L 100 ${y}`}
    stroke="rgba(139, 92, 246, 0.8)"
    strokeWidth="1"
    fill="transparent"
    vectorEffect="non-scaling-stroke"
    style={{ willChange: 'auto' }}
    initial={{ pathLength: 0, opacity: 0 }}
    animate={{ 
      pathLength: [0, 1, 0],
      opacity: [0, 1, 0]
    }}
    transition={{
      duration: 1.3,
      delay,
      repeat: Infinity,
      repeatDelay: 0.85,
      ease: "linear"
    }}
  />
);

// Ligne verticale optimisée
const FastVerticalLine = ({ x, delay }: { x: number; delay: number }) => (
  <motion.path
    d={`M ${x} 0 L ${x} 100`}
    stroke="rgba(34, 197, 94, 0.8)"
    strokeWidth="1"
    fill="transparent"
    vectorEffect="non-scaling-stroke"
    style={{ willChange: 'auto' }}
    initial={{ pathLength: 0, opacity: 0 }}
    animate={{ 
      pathLength: [0, 1, 0],
      opacity: [0, 1, 0]
    }}
    transition={{
      duration: 1.3,
      delay,
      repeat: Infinity,
      repeatDelay: 0.85,
      ease: "linear"
    }}
  />
);

const AnimatedGridBackground = () => {
  const [squares, setSquares] = useState<any[]>([]);
  const [horizontalLines, setHorizontalLines] = useState<any[]>([]);
  const [verticalLines, setVerticalLines] = useState<any[]>([]);

  // Réduit le nombre d'éléments pour les performances
  const numSquares = 15;
  const numHorizontalLines = 6;
  const numVerticalLines = 8;

  useEffect(() => {
    // Génération optimisée
    const newSquares = Array.from({ length: numSquares }).map((_, i) => ({
      id: `square-${i}`,
      x: Math.random() * 85,
      y: Math.random() * 85,
      size: Math.random() * 6 + 3,
      delay: i * 0.1, // Délais échelonnés pour éviter les pics de calcul
    }));

    const newHorizontalLines = Array.from({ length: numHorizontalLines }).map((_, i) => ({
      id: `h-line-${i}`,
      y: (i + 1) * (100 / (numHorizontalLines + 1)),
      delay: i * 0.15,
    }));

    const newVerticalLines = Array.from({ length: numVerticalLines }).map((_, i) => ({
      id: `v-line-${i}`,
      x: (i + 1) * (100 / (numVerticalLines + 1)),
      delay: i * 0.12,
    }));

    setSquares(newSquares);
    setHorizontalLines(newHorizontalLines);
    setVerticalLines(newVerticalLines);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 h-screen w-full overflow-hidden">
      {/* Arrière-plan principal */}
      <div className="absolute inset-0 bg-gray-950" />

      {/* Grille CSS statique simple */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: `
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* SVG optimisé sans filtres coûteux */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ 
          mixBlendMode: 'screen',
          willChange: 'auto',
          backfaceVisibility: 'hidden'
        }}
      >
        {/* Lignes horizontales */}
        <g>
          {horizontalLines.map((line) => (
            <FastHorizontalLine
              key={line.id}
              y={line.y}
              delay={line.delay}
            />
          ))}
        </g>

        {/* Lignes verticales */}
        <g>
          {verticalLines.map((line) => (
            <FastVerticalLine
              key={line.id}
              x={line.x}
              delay={line.delay}
            />
          ))}
        </g>

        {/* Carrés */}
        <g>
          {squares.map((square) => (
            <FastSquare
              key={square.id}
              x={square.x}
              y={square.y}
              size={square.size}
              delay={square.delay}
            />
          ))}
        </g>
      </svg>

      {/* Dégradé simple */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, rgba(59, 130, 246, 0.15) 0%, transparent 50%)`
        }}
      />
    </div>
  );
};

export default AnimatedGridBackground;