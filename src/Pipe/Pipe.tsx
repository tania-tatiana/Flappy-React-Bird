import React from "react";
import styles from "./Pipe.module.css";

interface PipeProps {
  x: number;
  topHeight: number;
  gapSize: number;
}

export const Pipe: React.FC<PipeProps> = ({ x, topHeight, gapSize }) => {
  return (
    <>
      <div
        className={styles.pipeTop}
        style={{
          left: `${x}px`,
          height: `${topHeight}px`,
        }}
      />
      <div
        className={styles.pipeBottom}
        style={{
          left: `${x}px`,
          top: `${topHeight + gapSize}px`,
        }}
      />
    </>
  );
};
