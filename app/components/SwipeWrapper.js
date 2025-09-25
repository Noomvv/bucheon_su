'use client';

import { useSwipeable } from 'react-swipeable';
import { useRouter, usePathname } from 'next/navigation';

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

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentIndex !== -1 && currentIndex < pages.length - 1) {
        router.push(pages[currentIndex + 1]);
      }
    },
    onSwipedRight: () => {
      if (currentIndex > 0) {
        router.push(pages[currentIndex - 1]);
      }
    },
    trackMouse: true
  });

  // Если текущая страница не в списке, не обрабатывать свайп
  if (currentIndex === -1) return <>{children}</>;

  return (
    <div {...handlers}>
      {children}
    </div>
  );
}