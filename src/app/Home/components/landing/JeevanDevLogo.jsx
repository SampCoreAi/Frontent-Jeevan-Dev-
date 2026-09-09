"use client";
import { useEffect, useRef } from "react";
import "../../../../app/globals.css";

export default function Home() {
  const hlRef = useRef(null);
  const mouse = useRef({ x: -999, y: -999 });
  const cur = useRef({ x: -999, y: -999 });
  const rafRef = useRef(null);

  useEffect(() => {
    const hl = hlRef.current;

    const onMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };
    const onLeave = () => {
      mouse.current.x = -999;
      mouse.current.y = -999;
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    const lerp = (a, b, t) => a + (b - a) * t;

    const tick = () => {
      cur.current.x = lerp(cur.current.x, mouse.current.x, 0.08);
      cur.current.y = lerp(cur.current.y, mouse.current.y, 0.08);

      const rect = hl.getBoundingClientRect();
      const relX = cur.current.x - rect.left;
      const relY = cur.current.y - rect.top;

      if (mouse.current.x === -999) {
        hl.style.setProperty("--x", "-999px");
        hl.style.setProperty("--y", "-999px");
      } else {
        hl.style.setProperty("--x", `${relX}px`);
        hl.style.setProperty("--y", `${relY}px`);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div style={{
      position: "relative",
      height: "30vh",
      backgroundColor:"#e5f3e9",
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "none",
    }}>
      
      <h1
        className="base"
        style={{
          position: "absolute",
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(50px, 15vw, 360px)",
          fontWeight: 700,
          whiteSpace: "nowrap",
          letterSpacing: "0.05em",
        }}
      >
        Jeevan Dev
      </h1>
      <h1 className="highlight" style={{
        position: "absolute",
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: "clamp(50px, 15vw, 360px)",
        fontWeight: 700,
        whiteSpace: "nowrap",
        letterSpacing: "0.05em",
      }} ref={hlRef}>Jeevan Dev</h1>
    </div>
  );
}