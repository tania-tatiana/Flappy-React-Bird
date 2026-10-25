import React from "react";
import styles from "./ScoreBoard.module.css";

interface ScoreBoardProps {
  score: number;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ score }) => {
  return <div className={styles.scoreBoard}>{score}</div>;
};
