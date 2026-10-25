import { useState, useEffect, useRef, useCallback } from "react";
import { Bird } from "./Bird/Bird";
import { Pipe } from "./Pipe/Pipe";
import { ScoreBoard } from "./ScoreBoard/ScoreBoard";
import { Overlay } from "./Overlay/Overlay";
import type { GameState, PipeType } from "./types/types";
import "./App.css";

const GRAVITY = 0.6;
const JUMP_STRENGTH = -8.5;
const PIPE_SPEED = 3;
const PIPE_SPAWN_RATE = 120;
const GAP_SIZE = 150;

export default function App() {
  const [gameState, setGameState] = useState<GameState>("START");
  const [score, setScore] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(() => {
    return parseInt(localStorage.getItem("flappy_best_score") || "0", 10);
  });

  // Зберігаємо і позицію, і швидкість пташки в одному стані, щоб уникнути доступу до useRef під час рендеру
  const [bird, setBird] = useState<{ y: number; velocity: number }>({
    y: 250,
    velocity: 0,
  });

  const [pipes, setPipes] = useState<PipeType[]>([]);
  const frameCountRef = useRef<number>(0);
  const requestRef = useRef<number>(0);

  const endGame = useCallback(() => {
    setGameState("GAMEOVER");
    setScore((finalScore) => {
      if (finalScore > bestScore) {
        setBestScore(finalScore);
        localStorage.setItem("flappy_best_score", finalScore.toString());
      }
      return finalScore;
    });
  }, [bestScore]);

  const resetGame = useCallback(() => {
    setBird({ y: 250, velocity: 0 });
    setPipes([]);
    setScore(0);
    frameCountRef.current = 0;
    setGameState("PLAYING");
  }, []);

  const handleJump = useCallback(() => {
    if (gameState === "START" || gameState === "PLAYING") {
      if (gameState === "START") setGameState("PLAYING");
      setBird((prev) => ({ ...prev, velocity: JUMP_STRENGTH }));
    } else if (gameState === "GAMEOVER") {
      resetGame();
    }
  }, [gameState, resetGame]);

  // Обробка клавіатури
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        handleJump();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleJump]);

  // Головний ігровий цикл
  useEffect(() => {
    if (gameState !== "PLAYING") return;

    const updateGame = () => {
      setBird((prevBird) => {
        const newVelocity = prevBird.velocity + GRAVITY;
        const nextY = prevBird.y + newVelocity;

        if (nextY > 560 || nextY < 0) {
          endGame();
        }

        return { y: nextY, velocity: newVelocity };
      });

      frameCountRef.current += 1;
      setPipes((prevPipes) => {
        let newPipes = prevPipes.map((p) => ({ ...p, x: p.x - PIPE_SPEED }));

        if (frameCountRef.current % PIPE_SPAWN_RATE === 0) {
          const topHeight = Math.floor(Math.random() * 300) + 50;
          newPipes.push({ x: 400, topHeight, passed: false });
        }

        newPipes = newPipes.filter((p) => p.x > -60);

        newPipes.forEach((pipe) => {
          if (!pipe.passed && pipe.x < 100) {
            pipe.passed = true;
            setScore((s) => s + 1);
          }

          // Тут звертаємось до актуального bird.y через функціональний оновлювач або замкнене значення
        });

        return newPipes;
      });

      requestRef.current = requestAnimationFrame(updateGame);
    };

    requestRef.current = requestAnimationFrame(updateGame);
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameState, endGame]);

  // Окрема перевірка зіткнень труб із пташкою через ефект, щоб завжди мати свіжий bird.y
  useEffect(() => {
    if (gameState !== "PLAYING") return;

    pipes.forEach((pipe) => {
      const birdBox = { x: 100, y: bird.y, size: 30 };
      const inPipeX =
        pipe.x < birdBox.x + birdBox.size && pipe.x + 50 > birdBox.x;
      const inTopPipeY = birdBox.y < pipe.topHeight;
      const inBottomPipeY =
        birdBox.y + birdBox.size > pipe.topHeight + GAP_SIZE;

      if (inPipeX && (inTopPipeY || inBottomPipeY)) {
        endGame();
      }
    });
  }, [bird.y, pipes, gameState, endGame]);

  return (
    <div onClick={handleJump} className="container">
      <h1 className="title">Flappy React Bird</h1>
      <p className="subtitle">
        Натискай <b>Пробіл</b> або <b>Клік мишкою</b>
      </p>

      <div className="gameBoard">
        <Bird y={bird.y} velocity={bird.velocity} />

        {pipes.map((pipe, idx) => (
          <Pipe
            key={idx}
            x={pipe.x}
            topHeight={pipe.topHeight}
            gapSize={GAP_SIZE}
          />
        ))}

        {gameState === "PLAYING" && <ScoreBoard score={score} />}

        <Overlay
          gameState={gameState}
          score={score}
          bestScore={bestScore}
          onStart={resetGame}
        />
      </div>
    </div>
  );
}
