import { RefObject, useEffect, useState, useRef } from "react";
import {
  useMotionValue,
  useSpring,
  useTransform,
  MotionValue,
} from "framer-motion";
import homeStyles from "../pages/Home/Home.module.css";

interface ScrollLockResult {
  blurCss: MotionValue<string>;
  progressScale: MotionValue<number>;
  indicatorText: string;
  isLocked: boolean;
}

export function useScrollLockSection(ref: RefObject<any>): ScrollLockResult {
  const [isLocked, setIsLocked] = useState(false);
  const isLockedRef = useRef(false);
  const [hasStartedScrolling, setHasStartedScrolling] = useState(false);
  const [overscrollDown, setOverscrollDown] = useState(0);
  const [overscrollUp, setOverscrollUp] = useState(0);
  const [indicatorText, setIndicatorText] = useState("Scroll to reveal");
  const OVERSCROLL_THRESHOLD = 500;

  const onWheelRef = useRef((_e: WheelEvent) => {});

  // Motion values for blur
  const blurAmount = useMotionValue(50);
  // Direct transforms without spring to avoid oscillation
  const blurCss = useTransform(blurAmount, (v) => `${v}px`);
  const progressScale = useTransform(blurAmount, [0, 100], [0, 1]);

  // Observer to manage the lock state
  useEffect(() => {
    const sectionWrapper = ref.current?.parentElement as HTMLElement | null;
    if (!sectionWrapper) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const shouldBeLocked =
          entry.isIntersecting && entry.intersectionRatio > 0.8;
        if (shouldBeLocked !== isLockedRef.current) {
          isLockedRef.current = shouldBeLocked;
          setIsLocked(shouldBeLocked);

          if (shouldBeLocked) {
            // Reset state when locking
            blurAmount.set(100);
            setHasStartedScrolling(false);
            setOverscrollDown(0);
            setOverscrollUp(0);
            setIndicatorText("Scroll to reveal");
          }
        }
      },
      { threshold: [0.8, 0.9, 1.0] }
    );
    observer.observe(sectionWrapper);
    return () => observer.disconnect();
  }, [ref, blurAmount]);

  // Disable native CSS snap while locked
  useEffect(() => {
    const sectionWrapper = ref.current?.parentElement as HTMLElement | null;
    const scrollContainer = sectionWrapper?.parentElement as HTMLElement | null;
    if (!sectionWrapper) return;
    if (isLocked) {
      scrollContainer?.style?.setProperty("scroll-snap-type", "none");
    } else {
      scrollContainer?.style?.removeProperty("scroll-snap-type");
    }
  }, [isLocked, ref]);

  // This effect defines the wheel handler logic and keeps it up-to-date with the latest state.
  useEffect(() => {
    onWheelRef.current = (e: WheelEvent) => {
      if (!isLockedRef.current) return;

      const sectionWrapper = ref.current?.parentElement as HTMLElement | null;
      const scrollContainer =
        sectionWrapper?.parentElement as HTMLElement | null;
      const target = e.target as Node;
      if (!sectionWrapper?.contains(target) && !ref.current?.contains(target))
        return;
      e.preventDefault();
      e.stopPropagation();

      const deltaY = e.deltaY;
      const currentBlur = blurAmount.get();

      // Scroll up overscroll at max blur
      if (currentBlur >= 100 && deltaY < 0 && hasStartedScrolling) {
        const up = overscrollUp + Math.abs(deltaY);
        setOverscrollUp(up);
        if (up >= OVERSCROLL_THRESHOLD) {
          isLockedRef.current = false;
          setIsLocked(false);
          setHasStartedScrolling(false);
          setOverscrollDown(0);
          setOverscrollUp(0);
          blurAmount.set(100);
          const prevSnap =
            sectionWrapper?.previousElementSibling as HTMLElement | null;
          if (prevSnap && prevSnap.classList.contains(homeStyles.snapSection)) {
            // Temporarily disable snap to avoid conflicts
            const currentSnapType = scrollContainer?.style.scrollSnapType || "";
            scrollContainer?.style.setProperty("scroll-snap-type", "none");
            scrollContainer?.scrollTo({
              top: prevSnap.offsetTop,
              behavior: "smooth",
            });
            // Re-enable snap after scroll completes
            setTimeout(() => {
              scrollContainer?.style.setProperty(
                "scroll-snap-type",
                currentSnapType || "y mandatory"
              );
            }, 600);
          }
        } else {
          if (up >= OVERSCROLL_THRESHOLD * 0.8)
            setIndicatorText("Almost back...");
          else if (up >= OVERSCROLL_THRESHOLD * 0.4)
            setIndicatorText("Keep scrolling up...");
        }
        return;
      }

      // Scroll down overscroll at zero blur
      if (currentBlur <= 0 && deltaY > 0) {
        const down = overscrollDown + deltaY;
        setOverscrollDown(down);
        if (down >= OVERSCROLL_THRESHOLD) {
          isLockedRef.current = false;
          setIsLocked(false);
          setHasStartedScrolling(false);
          setOverscrollDown(0);
          setOverscrollUp(0);
          blurAmount.set(100);
          const nextSnap =
            sectionWrapper?.nextElementSibling as HTMLElement | null;
          if (nextSnap && nextSnap.classList.contains(homeStyles.snapSection)) {
            const currentSnapType = scrollContainer?.style.scrollSnapType || "";
            scrollContainer?.style.setProperty("scroll-snap-type", "none");
            scrollContainer?.scrollTo({
              top: nextSnap.offsetTop,
              behavior: "smooth",
            });
            setTimeout(() => {
              scrollContainer?.style.setProperty(
                "scroll-snap-type",
                currentSnapType || "y mandatory"
              );
            }, 600);
          }
        } else {
          if (down >= OVERSCROLL_THRESHOLD * 0.8)
            setIndicatorText("Almost there!");
          else if (down >= OVERSCROLL_THRESHOLD * 0.4)
            setIndicatorText("Keep going...");
        }
        return;
      }

      // Reset overscroll on direction change
      if (deltaY < 0 && currentBlur <= 0) {
        // only reset overscroll if we are not at max blur
      } else if (deltaY < 0) {
        setOverscrollDown(0);
      }
      if (deltaY > 0) setOverscrollUp(0);

      // Calculate blur change - deltaY is positive when scrolling down
      const delta = deltaY * 0.05; // Reduced sensitivity for smoother control
      const amt = Math.max(0, Math.min(100, currentBlur - delta));
      blurAmount.set(amt);

      // Update indicator text
      if (amt <= 0) setIndicatorText("Keep scrolling...");
      else if (amt >= 100 && hasStartedScrolling)
        setIndicatorText("Keep scrolling to go back...");
      else setIndicatorText("Scroll to reveal");

      if (deltaY > 0 && currentBlur > 50) setHasStartedScrolling(true);
    };
  }, [hasStartedScrolling, overscrollDown, overscrollUp, blurAmount, ref]);

  // This effect attaches the event listener once on mount.
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      onWheelRef.current(e);
    };

    window.addEventListener("wheel", handleWheel, {
      passive: false,
      capture: true,
    });

    return () => {
      window.removeEventListener("wheel", handleWheel, { capture: true });
    };
  }, []); // Empty dependency array ensures this runs only once

  return {
    blurCss,
    progressScale,
    indicatorText,
    isLocked,
  };
}
