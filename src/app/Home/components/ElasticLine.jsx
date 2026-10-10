"use client";

import { useEffect, useRef } from "react";

export default function ElasticLine() {
  const svgRef = useRef(null);
  const visiblePathRef = useRef(null);
  const hitPathRef = useRef(null);

  const draggingRef = useRef(false);
  const animationRef = useRef(null);

  const WIDTH = 1000;
  const HEIGHT = 300;

  const START_X = 20;
  const END_X = 980;
  const CENTER_X = WIDTH / 2;
  const CENTER_Y = HEIGHT / 2;

  // Current control point
  const pointRef = useRef({
    x: CENTER_X,
    y: CENTER_Y,
  });

  // ================================
  // CREATE CURVE
  // ================================
  const createPath = (x, y) => {
    return `M ${START_X} ${CENTER_Y} Q ${x} ${y} ${END_X} ${CENTER_Y}`;
  };

  // ================================
  // UPDATE BOTH PATHS
  // ================================
  const updatePath = (x, y) => {
    const path = createPath(x, y);

    if (visiblePathRef.current) {
      visiblePathRef.current.setAttribute("d", path);
    }

    if (hitPathRef.current) {
      hitPathRef.current.setAttribute("d", path);
    }

    pointRef.current = { x, y };
  };

  // ================================
  // GET POINTER POSITION
  // ================================
  const getPointerPosition = (e) => {
    const svg = svgRef.current;

    if (!svg) return null;

    const rect = svg.getBoundingClientRect();

    const x =
      ((e.clientX - rect.left) / rect.width) *
      WIDTH;

    const y =
      ((e.clientY - rect.top) / rect.height) *
      HEIGHT;

    return { x, y };
  };

  // ================================
  // POINTER DOWN
  // ================================
  const handlePointerDown = (e) => {
    draggingRef.current = true;

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    e.currentTarget.setPointerCapture(e.pointerId);

    const position = getPointerPosition(e);

    if (!position) return;

    updatePath(position.x, position.y);
  };

  // ================================
  // POINTER MOVE
  // ================================
  const handlePointerMove = (e) => {
    if (!draggingRef.current) return;

    const position = getPointerPosition(e);

    if (!position) return;

    /*
      Zyada stretch allow kar rahe hain.
      SVG ke bahar tak bhi kheench sakte ho.
    */

    const x = Math.max(
      START_X + 40,
      Math.min(END_X - 40, position.x)
    );

    const y = Math.max(
      -150,
      Math.min(HEIGHT + 150, position.y)
    );

    updatePath(x, y);
  };

  // ================================
  // SPRING / BOUNCE
  // ================================
const startBounce = () => {
  let currentY = pointRef.current.y;
  let velocity = 0;

  // Fast + short bounce
  const stiffness = 0.11;
  const damping = 0.93;

  const animate = () => {
    const distance = CENTER_Y - currentY;

    velocity += distance * stiffness;
    velocity *= damping;

    currentY += velocity;

    updatePath(CENTER_X, currentY);

    const almostStopped =
      Math.abs(distance) < 0.5 &&
      Math.abs(velocity) < 0.5;

    if (!almostStopped) {
      animationRef.current =
        requestAnimationFrame(animate);
    } else {
      updatePath(CENTER_X, CENTER_Y);
      animationRef.current = null;
    }
  };

  animate();
};

  // ================================
  // POINTER UP
  // ================================
  const handlePointerUp = (e) => {
    if (!draggingRef.current) return;

    draggingRef.current = false;

    try {
      e.currentTarget.releasePointerCapture(
        e.pointerId
      );
    } catch {
      // Ignore
    }

    startBounce();
  };

  // ================================
  // CLEANUP
  // ================================
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(
          animationRef.current
        );
      }
    };
  }, []);

return (
  <section
    className="relative w-full"
    style={{
      height: "70px",

      // SAME BACKGROUND AS LANDING HERO
      backgroundColor: "#FFFFFF",

      backgroundImage: `
        linear-gradient(
          90deg,
          rgba(7, 135, 106, 0.13) 0%,
          rgba(7, 135, 106, 0.04) 25%,
          rgba(255, 255, 255, 0.96) 45%,
          rgba(255, 255, 255, 0.96) 55%,
          rgba(7, 135, 106, 0.04) 75%,
          rgba(7, 135, 106, 0.13) 100%
        ),

        linear-gradient(
          135deg,
          rgba(7, 135, 106, 0.09) 0%,
          rgba(52, 211, 153, 0.035) 45%,
          rgba(255, 255, 255, 0.08) 100%
        ),

        linear-gradient(
          rgba(7, 135, 106, 0.10) 1px,
          transparent 1px
        ),

        linear-gradient(
          90deg,
          rgba(7, 135, 106, 0.10) 1px,
          transparent 1px
        )
      `,

      backgroundSize: `
        100% 100%,
        40px 40px,
        40px 40px,
        40px 40px
      `,

      backgroundPosition: `
        center,
        0 0,
        0 0,
        0 0
      `,
    }}
  >
    
    <svg
      ref={svgRef}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="none"
      className="block h-full w-full overflow-visible select-none"
      style={{
        touchAction: "pan-y",
      }}
      onPointerMove={handlePointerMove}
    >
      {/* VISIBLE LINE */}
      <path
        ref={visiblePathRef}
        d={createPath(CENTER_X, CENTER_Y)}
        fill="none"
        stroke="#07876A"
        strokeWidth="2"
        strokeLinecap="round"
        pointerEvents="none"
      />

      {/* INVISIBLE DRAG AREA */}
      <path
        ref={hitPathRef}
        d={createPath(CENTER_X, CENTER_Y)}
        fill="none"
        stroke="transparent"
        strokeWidth="45"
        strokeLinecap="round"
        className="cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />
    </svg>
    <span className="absolute right-5 top-1 text-[10px] font-medium tracking-wide text-[#07876A]/60 pointer-events-none">
  Drag the line ↕
</span>
  </section>
);
}