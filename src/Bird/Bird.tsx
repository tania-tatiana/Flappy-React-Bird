import React from "react";
import styles from "./Bird.module.css";

interface BirdProps {
  y: number;
  velocity: number;
}

export const Bird: React.FC<BirdProps> = ({ y, velocity }) => {
  const rotation = Math.min(Math.max(velocity * 4, -30), 70);

  return (
    <div
      className={styles.bird}
      style={{
        top: `${y}px`,
        transform: `rotate(${rotation}deg)`,
      }}
    />
  );
};
