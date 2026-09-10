"use client";

import { 
  Globe, Brain, Tags, BookOpen, Volume2, Mic, Highlighter, Pin, History, Rocket
} from "lucide-react";
import RadialOrbitalTimeline from "../feature/radial-orbital-timeline";

const timelineData = [
  {
    id: 1,
    title: "Plugin Launch",
    date: "v1.0",
    content: "Lightweight word meaning plugin that works on any website with just 2 lines of code. Double-click any word to get instant meaning.",
    category: "Core",
    icon: Rocket,
    relatedIds: [2, 3],
    status: "completed",
    energy: 100,
  },
  {
    id: 2,
    title: "Multi-Language Support",
    date: "Feature",
    content: "Supports 9 Indian languages including Hindi, Tamil, Bengali, Gujarati, Marathi, Telugu, Kannada, and Punjabi.",
    category: "Language",
    icon: Globe,
    relatedIds: [1, 3],
    status: "completed",
    energy: 95,
  },
  {
    id: 3,
    title: "Context-Aware AI",
    date: "AI",
    content: "Understands surrounding text to deliver accurate meaning using AI-powered processing.",
    category: "AI",
    icon: Brain,
    relatedIds: [1, 2, 4],
    status: "completed",
    energy: 90,
  },
  {
    id: 4,
    title: "Synonyms & Antonyms",
    date: "Feature",
    content: "Provides 3 synonyms and 2 antonyms with clean color-coded tags for better understanding.",
    category: "Vocabulary",
    icon: Tags,
    relatedIds: [3, 5],
    status: "completed",
    energy: 85,
  },
  {
    id: 5,
    title: "Example Sentences",
    date: "Feature",
    content: "Displays real-life usage examples to help users understand context and meaning clearly.",
    category: "Learning",
    icon: BookOpen,
    relatedIds: [4, 6],
    status: "completed",
    energy: 80,
  },
  {
    id: 6,
    title: "Text-to-Speech",
    date: "Feature",
    content: "Listen to word meanings in native voice with adjustable speed (0.5×, 1×, 2×).",
    category: "Audio",
    icon: Volume2,
    relatedIds: [5, 7],
    status: "completed",
    energy: 75,
  },
  {
    id: 7,
    title: "Voice Search",
    date: "Feature",
    content: "Speak any word using microphone and instantly get its meaning.",
    category: "Input",
    icon: Mic,
    relatedIds: [6, 8],
    status: "completed",
    energy: 70,
  },
  {
    id: 8,
    title: "Text Formatting Tools",
    date: "Feature",
    content: "Highlight text in multiple colors and apply bold formatting directly on selected content.",
    category: "Editor",
    icon: Highlighter,
    relatedIds: [7, 9],
    status: "completed",
    energy: 65,
  },
  {
    id: 9,
    title: "Save & History",
    date: "Feature",
    content: "Pin words for later and track last 50 searched words with timestamps using localStorage.",
    category: "Storage",
    icon: History,
    relatedIds: [8],
    status: "completed",
    energy: 60,
  }
];

export function RadialOrbitalTimelineDemo() {
  return <RadialOrbitalTimeline timelineData={timelineData} />;
}

export default RadialOrbitalTimelineDemo;
