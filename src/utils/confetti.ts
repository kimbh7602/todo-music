import confetti from "canvas-confetti";

export function fireConfetti() {
  confetti({
    particleCount: 50,
    spread: 60,
    origin: { x: 0.5, y: 0.3 },
    colors: ["#FFD700", "#C0C0C0", "#FFFFFF", "#FFA500"],
    ticks: 100,
    gravity: 1.2,
    scalar: 0.9,
  });
}
