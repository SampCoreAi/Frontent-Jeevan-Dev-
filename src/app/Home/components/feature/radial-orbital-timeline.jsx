"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowRight, Link, Zap, Pause, Play, RotateCcw, Maximize2 } from "lucide-react";
import { Badge } from "../feature/Badge";
import { Button } from "../feature/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../feature/card";

const RadialOrbitalTimeline = ({ timelineData }) => {
  const [expandedItems, setExpandedItems] = useState({});
  const [viewMode, setViewMode] = useState("orbital");
  const [rotationAngle, setRotationAngle] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [pulseEffect, setPulseEffect] = useState({});
  const [centerOffset, setCenterOffset] = useState({ x: 0, y: 0 });
  const [activeNodeId, setActiveNodeId] = useState(null);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showConnections, setShowConnections] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef(null);
  const orbitRef = useRef(null);
  const nodeRefs = useRef({});
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Primary color: #063e2a (dark green)
  const PRIMARY_COLOR = "#063e2a";
  const PRIMARY_LIGHT = "#0a5c3f";
  const PRIMARY_DARK = "#042818";

  // Check for mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleContainerClick = useCallback((e) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  }, []);

  const toggleItem = useCallback((id) => {
    setExpandedItems((prev) => {
      const newState = { ...prev };

      Object.keys(newState).forEach((key) => {
        if (parseInt(key) !== id) {
          newState[parseInt(key)] = false;
        }
      });

      newState[id] = !prev[id];

      if (!prev[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);

        const relatedItems = getRelatedItems(id);
        const newPulseEffect = {};
        relatedItems.forEach((relId) => {
          newPulseEffect[relId] = true;
        });
        setPulseEffect(newPulseEffect);

        centerViewOnNode(id);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
      }

      return newState;
    });
  }, []);

  const getRelatedItems = useCallback((itemId) => {
    const currentItem = timelineData.find((item) => item.id === itemId);
    return currentItem ? currentItem.relatedIds : [];
  }, [timelineData]);

  const isRelatedToActive = useCallback((itemId) => {
    if (!activeNodeId) return false;
    const relatedItems = getRelatedItems(activeNodeId);
    return relatedItems.includes(itemId);
  }, [activeNodeId, getRelatedItems]);

  // Auto-rotation effect
  useEffect(() => {
    let rotationTimer;

    if (autoRotate && viewMode === "orbital" && !isDragging) {
      rotationTimer = setInterval(() => {
        setRotationAngle((prev) => {
          const newAngle = (prev + 0.2) % 360;
          return Number(newAngle.toFixed(3));
        });
      }, 50);
    }

    return () => {
      if (rotationTimer) {
        clearInterval(rotationTimer);
      }
    };
  }, [autoRotate, viewMode, isDragging]);

  const centerViewOnNode = useCallback((nodeId) => {
    if (viewMode !== "orbital" || !nodeRefs.current[nodeId]) return;

    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    const totalNodes = timelineData.length;
    const targetAngle = (nodeIndex / totalNodes) * 360;

    setRotationAngle(270 - targetAngle);
  }, [viewMode, timelineData]);

  const calculateNodePosition = useCallback((index, total) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;

    // Responsive radius
    const radius = isMobile ? 125 : 220;

    const radian = (angle * Math.PI) / 180;

    const x = radius * Math.cos(radian) + centerOffset.x;
    const y = radius * Math.sin(radian) + centerOffset.y;

    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(
      0.5,
      Math.min(1, 0.5 + 0.5 * ((1 + Math.sin(radian)) / 2))
    );
    const scale = 0.8 + 0.2 * ((1 + Math.sin(radian)) / 2);

    return { x, y, angle, zIndex, opacity, scale };
  }, [rotationAngle, centerOffset, isMobile]);

  const getStatusStyles = useCallback((status) => {
    switch (status) {
      case "completed":
        return "bg-[#063e2a] text-white border-[#063e2a]";
      case "in-progress":
        return "bg-white text-[#063e2a] border-[#063e2a] border-2";
      case "pending":
        return "bg-gray-100 text-gray-500 border-gray-300";
      default:
        return "bg-gray-100 text-gray-500 border-gray-300";
    }
  }, []);

  const getStatusColor = useCallback((status) => {
    switch (status) {
      case "completed":
        return "#063e2a";
      case "in-progress":
        return "#0a5c3f";
      case "pending":
        return "#9ca3af";
      default:
        return "#9ca3af";
    }
  }, []);

  // Drag handlers for manual rotation
  const handleMouseDown = useCallback((e) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setIsDragging(true);
      setAutoRotate(false);
      dragStartRef.current = { x: e.clientX, y: e.clientY, angle: rotationAngle };
    }
  }, [rotationAngle]);

  // Touch handlers for mobile
  const handleTouchStart = useCallback((e) => {
    const touch = e.touches[0];
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setIsDragging(true);
      setAutoRotate(false);
      dragStartRef.current = { x: touch.clientX, y: touch.clientY, angle: rotationAngle };
    }
  }, [rotationAngle]);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging) return;
    e.preventDefault();
    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStartRef.current.x;
    const newAngle = (dragStartRef.current.angle + deltaX * 0.5) % 360;
    setRotationAngle(Number(newAngle.toFixed(3)));
  }, [isDragging]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStartRef.current.x;
    const newAngle = (dragStartRef.current.angle + deltaX * 0.5) % 360;
    setRotationAngle(Number(newAngle.toFixed(3)));
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      if (!isMobile) {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
      } else {
        window.addEventListener('touchmove', handleTouchMove, { passive: false });
        window.addEventListener('touchend', handleTouchEnd);
      }
      return () => {
        if (!isMobile) {
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('mouseup', handleMouseUp);
        } else {
          window.removeEventListener('touchmove', handleTouchMove);
          window.removeEventListener('touchend', handleTouchEnd);
        }
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd, isMobile]);

  const resetView = useCallback(() => {
    setRotationAngle(0);
    setCenterOffset({ x: 0, y: 0 });
    setAutoRotate(true);
    setExpandedItems({});
    setActiveNodeId(null);
  }, []);

  // Calculate connection lines
  const getConnectionLines = useCallback(() => {
    if (!showConnections || !activeNodeId) return [];

    const activeNode = timelineData.find(item => item.id === activeNodeId);
    if (!activeNode) return [];

    const activeIndex = timelineData.findIndex(item => item.id === activeNodeId);
    const activePos = calculateNodePosition(activeIndex, timelineData.length);

    return activeNode.relatedIds.map(relatedId => {
      const relatedIndex = timelineData.findIndex(item => item.id === relatedId);
      const relatedPos = calculateNodePosition(relatedIndex, timelineData.length);

      return {
        x1: activePos.x,
        y1: activePos.y,
        x2: relatedPos.x,
        y2: relatedPos.y,
        id: `${activeNodeId}-${relatedId}`
      };
    });
  }, [activeNodeId, showConnections, timelineData, calculateNodePosition]);

  const connections = getConnectionLines();

  // Responsive sizes
  const nodeSize = isMobile ? 36 : 48;
  const iconSize = isMobile ? 16 : 20;
  const centralHubSize = isMobile ? 48 : 80;
  const centralHubInnerSize = Math.round(centralHubSize / 2.5); // roughly matches old w-{size/5}
  const pingRing1Size = centralHubSize + 20; // roughly matches old w-{size/2+10}
  const pingRing2Size = centralHubSize + 40; // roughly matches old w-{size/2+20}
  const orbitSize = isMobile ? 320 : 440;
  const titleFontSize = isMobile ? "text-3xl" : "text-6xl";

  return (
    <div
      className="
        w-full
        h-auto
        md:h-screen
        flex flex-col
        items-center
        justify-start md:justify-center
        overflow-hidden
        relative
        select-none
      "
      ref={containerRef}
      onClick={handleContainerClick}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
    >
      {/* Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #dcfce7 0%, #ecfdf5 45%, #ffffff 100%)",
          }}
        />

        {/* Large Grid */}
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.18,
            backgroundImage: `
          linear-gradient(to right,#16a34a 1px,transparent 1px),
          linear-gradient(to bottom,#16a34a 1px,transparent 1px)
        `,
            backgroundSize: isMobile ? "40px 40px" : "60px 60px",
          }}
        />

        {/* Small Grid */}
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.08,
            backgroundImage: `
          linear-gradient(to right,#15803d 1px,transparent 1px),
          linear-gradient(to bottom,#15803d 1px,transparent 1px)
        `,
            backgroundSize: isMobile ? "15px 15px" : "20px 20px",
          }}
        />

        {/* White Radial */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at center,transparent 0%,rgba(255,255,255,.3) 50%,rgba(255,255,255,.9) 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div
        className="
          relative z-10
          w-full
          h-auto md:h-full
          flex flex-col
          items-center
          justify-start md:justify-center
          px-3 md:px-4
          py-6 md:py-0
        "
      >

        <div className="mb-2 flex justify-center w-full max-w-2xl">
          <div className="w-32 md:w-74 h-1 bg-[#1e6658] rounded-full animate-pulse"></div>
        </div>

        <div className="inline-block mb-2 text-center px-2">
          <h1 className={`${titleFontSize} md:text-7xl font-black tracking-tighter leading-[0.9]`}>
            <span className="text-[#1e6658]">OUR</span>
            <span
              className="text-transparent"
              style={{
                WebkitTextStroke: isMobile ? '1.5px #1e6658' : '2px #1e6658',
                marginLeft: isMobile ? 4 : 10
              }}
            >
              FEATURE
            </span>
          </h1>
        </div>
        <div className="w-full mb-4 flex justify-center">
          <div className="w-1/2 md:w-[30%] h-1 bg-[#1e6658] rounded-full animate-pulse"></div>
        </div>

        <div
          className="
            relative
            w-full
            max-w-5xl
            h-[420px]
            sm:h-[480px]
            md:h-full
            flex
            items-center
            justify-center
          "
        >
          <div
            className="absolute w-full h-full flex items-center justify-center"
            ref={orbitRef}
            style={{
              perspective: "1200px",
              transform: `translate(${centerOffset.x}px, ${centerOffset.y}px)`,
            }}
          >
            {/* Connection Lines SVG */}
            <svg className="absolute w-full h-full pointer-events-none z-0" style={{ overflow: 'visible' }}>
              {connections.map(conn => (
                <line
                  key={conn.id}
                  x1={conn.x1}
                  y1={conn.y1}
                  x2={conn.x2}
                  y2={conn.y2}
                  stroke="#063e2a"
                  strokeWidth={isMobile ? "1.5" : "2"}
                  strokeDasharray="5,5"
                  opacity="0.4"
                  className="animate-pulse"
                />
              ))}
            </svg>

            {/* Central Hub */}
            <div
              className="absolute rounded-full bg-gradient-to-br from-[#063e2a] via-[#0a5c3f] to-[#063e2a] shadow-2xl flex items-center justify-center z-20 animate-pulse"
              style={{ width: centralHubSize, height: centralHubSize }}
            >
              <div
                className="absolute rounded-full border-2 border-[#063e2a]/20 animate-ping"
                style={{ width: pingRing1Size, height: pingRing1Size }}
              ></div>
              <div
                className="absolute rounded-full border border-[#063e2a]/10 animate-ping"
                style={{ width: pingRing2Size, height: pingRing2Size, animationDelay: "0.5s" }}
              ></div>
              <div
                className="rounded-full bg-white shadow-inner flex items-center justify-center"
                style={{ width: centralHubInnerSize, height: centralHubInnerSize }}
              >
                <Zap size={isMobile ? 16 : 20} className="text-[#063e2a]" />
              </div>
            </div>

            {/* Orbit Ring */}
            <div
              className="absolute rounded-full border-2 border-dashed border-[#063e2a]/20 animate-[spin_60s_linear_infinite]"
              style={{ width: orbitSize, height: orbitSize }}
            ></div>
            <div
              className="absolute rounded-full border border-[#063e2a]/10"
              style={{ width: orbitSize, height: orbitSize }}
            ></div>

            {/* Timeline Nodes */}
            {timelineData.map((item, index) => {
              const position = calculateNodePosition(index, timelineData.length);
              const isExpanded = expandedItems[item.id];
              const isRelated = isRelatedToActive(item.id);
              const isPulsing = pulseEffect[item.id];
              const isHovered = hoveredNodeId === item.id;
              const Icon = item.icon;

              // Node position with mobile adjustments
              const nodeTranslateX = position.x;
              const nodeTranslateY = position.y;
              const nodeScale = isExpanded ? 1.2 : position.scale;

              const nodeStyle = {
                transform: `translate(${nodeTranslateX}px, ${nodeTranslateY}px) scale(${nodeScale})`,
                zIndex: isExpanded ? 200 : position.zIndex,
                opacity: isExpanded ? 1 : position.opacity,
              };

              // Energy effect size
              const energySize = isMobile ? 30 : 50;

              return (
                <div
                  key={item.id}
                  ref={(el) => (nodeRefs.current[item.id] = el)}
                  className="absolute transition-all duration-500 ease-out"
                  style={nodeStyle}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleItem(item.id);
                  }}
                  onMouseEnter={() => setHoveredNodeId(item.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                >
                  {/* Energy Glow Effect */}
                  <div
                    className={`absolute rounded-full transition-all duration-500 ${isPulsing ? 'animate-pulse' : ''}`}
                    style={{
                      background: `radial-gradient(circle, ${getStatusColor(item.status)}20 0%, transparent 70%)`,
                      width: `${item.energy * 0.8 + energySize}px`,
                      height: `${item.energy * 0.8 + energySize}px`,
                      left: `-${(item.energy * 0.8 + energySize - nodeSize) / 2}px`,
                      top: `-${(item.energy * 0.8 + energySize - nodeSize) / 2}px`,
                      opacity: isHovered || isExpanded ? 0.8 : 0.4,
                    }}
                  ></div>

                  {/* Node Circle */}
                  <div
                    className={`
                    rounded-full flex items-center justify-center
                    transition-all duration-300 shadow-lg
                    ${isHovered ? "scale-110 shadow-xl" : ""}
                    ${isPulsing ? "animate-bounce" : ""}
                  `}
                    style={{
                      width: `${nodeSize}px`,
                      height: `${nodeSize}px`,
                      border: `3px solid #063e2a`,
                      backgroundColor: isExpanded ? '#063e2a' : '#ffffff',
                      color: isExpanded ? '#ffffff' : '#063e2a',
                    }}
                  >
                    <Icon size={iconSize} strokeWidth={2} />
                  </div>

                  {/* Label - Always visible with better mobile handling */}
                  <div
                    className={`
                    absolute top-14 left-1/2 -translate-x-1/2 whitespace-nowrap
                    text-xs md:text-sm font-bold tracking-wide
                    transition-all duration-300 px-2 md:px-3 py-0.5 md:py-1 rounded-full
                    ${isExpanded
                        ? "text-[#063e2a] bg-white shadow-md scale-110"
                        : isRelated
                          ? "text-[#063e2a] bg-[#063e2a]/10"
                          : "text-gray-600 bg-white/80 backdrop-blur-sm"
                      }
                  `}
                    style={{
                      fontSize: isMobile ? '10px' : '14px',
                      maxWidth: isMobile ? '80px' : 'none',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.title}
                  </div>

                  {/* Expanded Card - Mobile Responsive */}
                  {isExpanded && (
                    <Card className={`absolute top-${isMobile ? '16' : '20'} left-1/2 -translate-x-1/2 
                      ${isMobile ? 'w-64' : 'w-72'} 
                      bg-white shadow-2xl border-[#063e2a]/20 overflow-visible animate-in fade-in zoom-in duration-300
                      ${isMobile ? 'max-w-[90vw]' : ''}`}>
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-[#063e2a]/30"></div>
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45 border-t border-l border-[#063e2a]/20"></div>

                      <CardHeader className="pb-3 bg-gradient-to-r from-[#063e2a]/5 to-transparent">
                        <CardTitle className="text-sm md:text-base text-[#063e2a]">
                          {item.title}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="text-xs md:text-sm text-gray-600">
                        <p className="leading-relaxed">{item.content}</p>

                        {/* Connected Nodes */}
                        {item.relatedIds.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center mb-3">
                              <Link size={isMobile ? 10 : 12} className="text-[#063e2a] mr-2" />
                              <h4 className="text-2xs md:text-xs uppercase tracking-wider font-bold text-[#063e2a]">
                                Connected Phases
                              </h4>
                            </div>
                            <div className="flex flex-wrap gap-1 md:gap-2">
                              {item.relatedIds.map((relatedId) => {
                                const relatedItem = timelineData.find(
                                  (i) => i.id === relatedId
                                );
                                return (
                                  <Button
                                    key={relatedId}
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center h-6 md:h-7 px-2 md:px-3 text-2xs md:text-xs rounded-full border-[#063e2a]/30 bg-white hover:bg-[#063e2a] hover:text-white transition-all duration-300 text-[#063e2a]"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleItem(relatedId);
                                    }}
                                  >
                                    {relatedItem?.title}
                                    <ArrowRight size={isMobile ? 8 : 10} className="ml-1" />
                                  </Button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              );
            })}
          </div>
        </div>


      </div>
    </div>
  );
};

export default RadialOrbitalTimeline;