import { Center } from "@/components/ui/center";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import React, { useEffect, useState } from "react";
import ComponentSnippet from "../../ComponentSnippet";

const ProgressDemo = () => {
  const [progressSimulationPercent, setProgressSimulationPercent] = useState(0);
  const [progressTargetPercent, setProgressTargetPercent] = useState(0);
  // Set a new target every second
  useEffect(() => {
    const interval = setInterval(() => {
      setProgressTargetPercent((prev) => {
        const increment = Math.floor(Math.random() * 33) + 1;
        const next = prev + increment;
        // If next > 100, set a special flag to trigger the pause
        return next > 100 ? 101 : next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Animate progressSimulationPercent toward progressTargetPercent
  useEffect(() => {
    let animationFrame: number;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let start: number | null = null;
    let initial = progressSimulationPercent;
    let target = progressTargetPercent;
    const duration = 1000; // ms

    function animate(timestamp: number) {
      if (start === null) start = timestamp;
      const elapsed = timestamp - start;
      const t = Math.min(elapsed / duration, 1);
      const lerped = initial + (target - initial) * t;
      setProgressSimulationPercent(Math.round(lerped));
      if (t < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        // After lerping to 100, if target is 101, stay at 100 for 1s, then jump to 0
        if (target === 101) {
          timeoutId = setTimeout(() => {
            setProgressSimulationPercent(0);
            setProgressTargetPercent(0);
          }, 1000);
        }
      }
    }
    animationFrame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animationFrame);
      if (timeoutId) clearTimeout(timeoutId);
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progressTargetPercent]);
  return (
    <ComponentSnippet
      title="Progress"
      snippet="gs-ProgressBasic-lg"
      example={
        <Center className="w-full">
          <Progress size={"md"} value={progressSimulationPercent}>
            <ProgressFilledTrack />
          </Progress>
        </Center>
      }
    />
  );
};

export default ProgressDemo;
