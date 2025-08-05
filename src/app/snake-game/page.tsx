"use client";

import React, { useState, useEffect } from "react";
import styles from "./SnakeGame.module.css";

const gridSize = 10;
const initialSnake = [{ x: 2, y: 2 }];
const foodStart = { x: 5, y: 5 };

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

export default function SnakeGame() {
  const [snake, setSnake] = useState(initialSnake);
  const [food, setFood] = useState(foodStart);
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);

    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const dx = endX - startX;
      const dy = endY - startY;

      if (Math.abs(dx) > Math.abs(dy)) {
        setDirection(dx > 0 ? "RIGHT" : "LEFT");
      } else {
        setDirection(dy > 0 ? "DOWN" : "UP");
      }
    };

    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchend", handleTouchEnd);

    const interval = setInterval(moveSnake, 200);
    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
      clearInterval(interval);
    };
  }, [snake, direction]);

  const moveSnake = () => {
    const head = { ...snake[0] };

    switch (direction) {
      case "UP":
        head.y = (head.y - 1 + gridSize) % gridSize;
        break;
      case "DOWN":
        head.y = (head.y + 1) % gridSize;
        break;
      case "LEFT":
        head.x = (head.x - 1 + gridSize) % gridSize;
        break;
      case "RIGHT":
        head.x = (head.x + 1) % gridSize;
        break;
    }

    // Check collision with self - game over if so
    if (snake.some((segment) => segment.x === head.x && segment.y === head.y)) {
      alert("Game Over! You ran into yourself.");
      setSnake(initialSnake);
      setDirection("RIGHT");
      setFood(foodStart);
      return;
    }

    let newSnake = [head, ...snake.slice(0, -1)];

    if (head.x === food.x && head.y === food.y) {
      const eatSound = new Audio("/eat.mp3");
      eatSound.play();
      setFood({
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize),
      });
      newSnake = [head, ...snake];
    }

    setSnake(newSnake);
  };

  // Desktop arrow controls
  const handleControlClick = (newDir: Direction) => {
    // Prevent reverse direction instantly
    if (
      (direction === "UP" && newDir === "DOWN") ||
      (direction === "DOWN" && newDir === "UP") ||
      (direction === "LEFT" && newDir === "RIGHT") ||
      (direction === "RIGHT" && newDir === "LEFT")
    ) {
      return;
    }
    setDirection(newDir);
  };

  const grid = Array.from({ length: gridSize }).map((_, y) =>
    Array.from({ length: gridSize }).map((_, x) => {
      const isSnake = snake.some((s) => s.x === x && s.y === y);
      const isFood = food.x === x && food.y === y;
      const className = isSnake
        ? styles.snakeCell
        : isFood
        ? styles.foodCell
        : styles.cell;

      return <div key={`${x}-${y}`} className={className} />;
    })
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Snake Game</h1>
      <div className={styles.grid}>{grid.flat()}</div>

      {isMobile ? (
        <p className={styles.instructions}>Swipe to control the snake</p>
      ) : (
        <div className={styles.controls}>
          <button
            className={styles.button}
            onClick={() => handleControlClick("UP")}
            aria-label="Move Up"
          >
            ↑
          </button>
          <button
            className={styles.button}
            onClick={() => handleControlClick("LEFT")}
            aria-label="Move Left"
          >
            ←
          </button>
          <button
            className={styles.button}
            onClick={() => handleControlClick("DOWN")}
            aria-label="Move Down"
          >
            ↓
          </button>
          <button
            className={styles.button}
            onClick={() => handleControlClick("RIGHT")}
            aria-label="Move Right"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
