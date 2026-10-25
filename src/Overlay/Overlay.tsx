import React from "react";
import styles from "./Overlay.module.css";
import type { GameState } from "../types/types";

interface OverlayProps {
  gameState: GameState;
  score: number;
  bestScore: number;
  onStart: () => void;
}

export const Overlay: React.FC<OverlayProps> = ({
  gameState,
  score,
  bestScore,
  onStart,
}) => {
  if (gameState === "PLAYING") return null;

  return (
    <div className={styles.overlay}>
      {gameState === "START" && (
        <>
          <h2>Почати гру</h2>
          <p>Натисни Пробіл або Клік, щоб злетіти!</p>
        </>
      )}

      {gameState === "GAMEOVER" && (
        <>
          <h2 className={styles.gameOverTitle}>Game Over</h2>
          <p className={styles.scoreText}>
            Рахунок: <b>{score}</b>
          </p>
          <p className={styles.bestScoreText}>
            Рекорд: <b>{bestScore}</b>
          </p>
          <button onClick={onStart} className={styles.button}>
            Знову
          </button>
        </>
      )}
    </div>
  );
};
