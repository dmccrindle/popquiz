"use client";

import { useState } from "react";

const tabs = [
  {
    id: "ipad" as const,
    label: "iPad",
    subtitle: "Gang of Four",
    title: "Music trivia night fits on an iPad.",
    description:
      "One iPad. Four players. No extra devices needed. Pop Quiz Music turns your iPad into a music trivia game show for the whole room. Everyone gathers around a single screen, and when a question drops, it's a race to buzz in first. The fastest finger gets to answer out loud. No additional downloads. No complicated setup.",
    mockupLabel: "iPad mockup",
  },
  {
    id: "iphone" as const,
    label: "iPhone",
    subtitle: "Radiohead-2-head",
    title: "Pick it up. Split the screen.",
    description:
      "Two players. One iPhone. Game on. Pop Quiz splits the screen and puts you face to face in head to head trivia. A question hits and both players race to buzz in first. Hold the answer with your voice and make the point. Get it wrong and your opponent has a shot to steal.",
    mockupLabel: "iPhone mockup",
  },
];

const DEVICE_WIDTH = "w-full max-w-[700px]";
const DEVICE_HEIGHT = "h-[340px] sm:h-[400px] lg:h-[480px]";

function TabContent({ tab, position }: { tab: typeof tabs[number]; position: "center" | "left" | "right" }) {
  const posClasses = {
    center: "translate-x-0 opacity-100",
    left: "-translate-x-[120%] opacity-0",
    right: "translate-x-[120%] opacity-0",
  };

  return (
    <div
      className={`absolute inset-0 flex flex-col items-center transition-all duration-500 ease-in-out ${posClasses[position]}`}
    >
      {/* Device mockup */}
      <div className={`mb-12 flex items-center justify-center ${DEVICE_WIDTH} ${DEVICE_HEIGHT}`}>
        <div className="relative w-full h-full rounded-3xl bg-gray-900 border border-gray-800 flex items-center justify-center overflow-hidden">
          <span className="text-white/30 text-sm">{tab.mockupLabel}</span>
        </div>
      </div>

      {/* Spacer for segmented control — keeps text aligned */}
      <div className="h-[52px] mb-8" />

      {/* Text content */}
      <div className="text-center max-w-4xl px-6">
        <p className="text-sm font-semibold text-gray-500 tracking-wide mb-2">
          {tab.subtitle}
        </p>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-gray-900 mb-6">
          {tab.title}
        </h2>
        <p className="text-base text-gray-600 leading-relaxed">
          <span className="font-bold text-gray-900">
            {tab.description.split(".").slice(0, 3).join(".") + "."}
          </span>{" "}
          {tab.description.split(".").slice(3).join(".")}
        </p>
      </div>
    </div>
  );
}

export default function DeviceFeature() {
  const [activeTab, setActiveTab] = useState<"ipad" | "iphone">("ipad");

  return (
    <section id="what-is-it" className="relative py-20 sm:py-28 bg-white text-gray-900 overflow-hidden">
      <div className="relative z-10 mx-auto max-w-7xl px-6 flex flex-col items-center">
        {/* Content area — relative container for the two sliding panels */}
        <div className="relative w-full" style={{ minHeight: "780px" }}>
          {tabs.map((tab) => {
            let position: "center" | "left" | "right";
            if (tab.id === activeTab) {
              position = "center";
            } else if (tab.id === "ipad") {
              // iPad is not active, so iPhone is — iPad should be off to the left
              position = "left";
            } else {
              // iPhone is not active, so iPad is — iPhone should be off to the right
              position = "right";
            }

            return <TabContent key={tab.id} tab={tab} position={position} />;
          })}

          {/* Segmented control — absolutely positioned, stays in place */}
          <div
            className="absolute left-1/2 -translate-x-1/2 z-20"
            style={{ top: "calc(340px + 48px)" }}
          >
            <div className="relative flex items-center bg-gray-100 rounded-full p-1 sm:top-[60px] lg:top-[140px]">
              <div
                className="absolute top-1 bottom-1 rounded-full bg-accent-pink transition-all duration-300 ease-in-out"
                style={{
                  left: activeTab === "ipad" ? "4px" : "50%",
                  width: "calc(50% - 4px)",
                }}
              />
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative z-10 px-8 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${
                    activeTab === tab.id
                      ? "text-white"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
