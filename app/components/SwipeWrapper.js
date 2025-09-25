'use client';

import React, { useRef, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useRouter, usePathname } from 'next/navigation';
import styles from './SwipeWrapper.module.css';

const pages = [
  "/Volunteering",
  "/Polls",
  "/",
  "/Ideas",
  "/Personal"
];

export default function SwipeWrapper({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const currentIndex = pages.indexOf(pathname);

  const [zoomClass, setZoomClass] = useState(styles.zoomActive);
  const timeoutRef = useRef();

  const handleSwipe = (dir) => {
    setZoomClass(styles.zoomIn);
    timeoutRef.current = setTimeout(() => {
      router.push(
        dir === 'left'
          ? pages[currentIndex + 1]
          : pages[currentIndex - 1]
      );
    }, 250);
  };

  React.useEffect(() => {
    setZoomClass(styles.zoomIn);
    const timer = setTimeout(() => {
      setZoomClass(styles.zoomActive);
    }, 50); // Короткая задержка для плавного появления
    return () => {
      clearTimeout(timer);
      clearTimeout(timeoutRef.current);
    };
  }, [pathname]);

  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe('left'),
    onSwipedRight: () => handleSwipe('right'),
    trackMouse: true
  });

  if (currentIndex === -1) return <>{children}</>;

  return (
    <div {...handlers} className={styles.swipeContainer}>
      <div className={`${styles.slide} ${zoomClass}`}>
        {children}
      </div>
    </div>
  );
}