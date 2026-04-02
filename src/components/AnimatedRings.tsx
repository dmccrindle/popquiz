"use client";

/**
 * 8 concentric rings that rotate in alternating directions.
 * Odd rings (1, 3, 5, 7) spin clockwise; even rings (2, 4, 6, 8) spin counter-clockwise.
 * Rings are centered ~60% from left (behind the device mockup area).
 * Each SVG is rendered directly via <img> with no wrapper — avoids bounding box clipping.
 */

interface RingData {
  src: string;
  width: number;
  height: number;
  duration: string;
  direction: "ring-cw" | "ring-ccw";
}

const rings: RingData[] = [
  { src: "/rings/ring-01.svg", width: 445, height: 431, duration: "35s", direction: "ring-cw" },
  { src: "/rings/ring-02.svg", width: 504, height: 471, duration: "40s", direction: "ring-ccw" },
  { src: "/rings/ring-03.svg", width: 635, height: 606, duration: "48s", direction: "ring-cw" },
  { src: "/rings/ring-04.svg", width: 744, height: 656, duration: "55s", direction: "ring-ccw" },
  { src: "/rings/ring-05.svg", width: 865, height: 757, duration: "65s", direction: "ring-cw" },
  { src: "/rings/ring-06.svg", width: 1006, height: 891, duration: "75s", direction: "ring-ccw" },
  { src: "/rings/ring-07.svg", width: 1231, height: 1147, duration: "90s", direction: "ring-cw" },
  { src: "/rings/ring-08.svg", width: 1341, height: 1293, duration: "105s", direction: "ring-ccw" },
];

export default function AnimatedRings() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {rings.map((ring, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={i}
          src={ring.src}
          alt=""
          aria-hidden="true"
          className={`absolute will-change-transform ${ring.direction}`}
          style={
            {
              "--duration": ring.duration,
              width: ring.width,
              height: ring.height,
              top: "50%",
              left: "clamp(50%, calc(100% - 250px), 75%)",
              marginTop: -(ring.height / 2),
              marginLeft: -(ring.width / 2),
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
