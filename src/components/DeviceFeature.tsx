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
  },
  {
    id: "iphone" as const,
    label: "iPhone",
    subtitle: "Radiohead-2-head",
    title: "Pick it up. Split the screen.",
    description:
      "Two players. One iPhone. Game on. Pop Quiz splits the screen and puts you face to face in head to head trivia. A question hits and both players race to buzz in first. Hold the answer with your voice and make the point. Get it wrong and your opponent has a shot to steal.",
  },
];

export default function DeviceFeature() {
  const [activeTab, setActiveTab] = useState<"ipad" | "iphone">("ipad");
  const activeTabData = tabs.find((t) => t.id === activeTab)!;

  return (
    <section id="what-is-it" className="relative pt-0 pb-12 bg-white text-gray-900 overflow-x-hidden">

      {/* Sliding image track */}
      <div className="w-full overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: activeTab === "ipad" ? "translateX(0%)" : "translateX(-50%)", width: "200%" }}
        >
          {tabs.map((tab) => (
            <div key={tab.id} className="w-1/2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={tab.id === "ipad" ? "/ipad-hands.jpg" : "/iphone-hands.jpg"}
                alt={tab.id === "ipad" ? "Pop Quiz on iPad" : "Pop Quiz on iPhone"}
                className="w-full h-auto block"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Segmented control */}
      <div className="flex justify-center mt-6 mb-8">
        <div className="relative flex items-center bg-gray-100 rounded-full p-1">
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
                activeTab === tab.id ? "text-white" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Text content — fades on switch */}
      <div key={activeTab} className="text-center max-w-4xl mx-auto px-6 animate-fade-in">
        <p className="text-sm font-semibold text-gray-500 tracking-wide mb-2">
          {activeTabData.subtitle}
        </p>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-gray-900 mb-6">
          {activeTabData.title}
        </h2>
        <p className="text-base text-gray-600 leading-relaxed">
          <span className="font-bold text-gray-900">
            {activeTabData.description.split(".").slice(0, 3).join(".") + "."}
          </span>{" "}
          {activeTabData.description.split(".").slice(3).join(".")}
        </p>
      </div>

    </section>
  );
}
