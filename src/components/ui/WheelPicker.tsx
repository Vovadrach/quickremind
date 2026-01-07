import { useRef, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring, animate } from 'framer-motion';
import { cn } from '@/utils/cn';

interface WheelPickerProps<T> {
  items: T[];
  value: T;
  onChange: (value: T) => void;
  renderItem: (item: T, isSelected: boolean) => React.ReactNode;
  itemHeight?: number;
  visibleItems?: number;
  className?: string;
}

export function WheelPicker<T>({
  items,
  value,
  onChange,
  renderItem,
  itemHeight = 48,
  visibleItems = 5,
  className,
}: WheelPickerProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startOffset = useRef(0);

  const currentIndex = items.findIndex((item) => item === value);
  const centerOffset = Math.floor(visibleItems / 2) * itemHeight;

  const y = useMotionValue(-currentIndex * itemHeight);
  const springY = useSpring(y, { stiffness: 300, damping: 30 });

  // Sync with external value changes
  useEffect(() => {
    const targetY = -currentIndex * itemHeight;
    animate(y, targetY, { type: 'spring', stiffness: 300, damping: 30 });
  }, [currentIndex, itemHeight, y]);

  const snapToNearest = useCallback(() => {
    const currentY = y.get();
    const rawIndex = -currentY / itemHeight;
    const snappedIndex = Math.round(rawIndex);
    const clampedIndex = Math.max(0, Math.min(items.length - 1, snappedIndex));

    animate(y, -clampedIndex * itemHeight, {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    });

    if (items[clampedIndex] !== value) {
      onChange(items[clampedIndex]);
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
    }
  }, [items, value, onChange, itemHeight, y]);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = true;
    startY.current = e.clientY;
    startOffset.current = y.get();
    e.currentTarget.setPointerCapture(e.pointerId);
  }, [y]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;

    const deltaY = e.clientY - startY.current;
    const newY = startOffset.current + deltaY;

    // Add resistance at boundaries
    const maxY = 0;
    const minY = -(items.length - 1) * itemHeight;

    if (newY > maxY) {
      y.set(maxY + (newY - maxY) * 0.3);
    } else if (newY < minY) {
      y.set(minY + (newY - minY) * 0.3);
    } else {
      y.set(newY);
    }
  }, [items.length, itemHeight, y]);

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    snapToNearest();
  }, [snapToNearest]);

  // Handle wheel scroll
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 1 : -1;
    const newIndex = Math.max(0, Math.min(items.length - 1, currentIndex + delta));

    if (newIndex !== currentIndex) {
      onChange(items[newIndex]);
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
    }
  }, [currentIndex, items, onChange]);

  const containerHeight = visibleItems * itemHeight;

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden select-none touch-none cursor-grab active:cursor-grabbing', className)}
      style={{ height: containerHeight }}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Gradient overlays */}
      <div
        className="absolute inset-x-0 top-0 z-10 pointer-events-none"
        style={{
          height: centerOffset,
          background: 'linear-gradient(to bottom, var(--color-bg-primary) 0%, transparent 100%)',
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 z-10 pointer-events-none"
        style={{
          height: centerOffset,
          background: 'linear-gradient(to top, var(--color-bg-primary) 0%, transparent 100%)',
        }}
      />

      {/* Selection indicator */}
      <div
        className="absolute inset-x-2 bg-bg-secondary/60 rounded-lg z-0 pointer-events-none"
        style={{
          top: centerOffset,
          height: itemHeight,
        }}
      />

      {/* Items container */}
      <motion.div
        style={{
          y: springY,
          paddingTop: centerOffset,
          paddingBottom: centerOffset,
        }}
      >
        {items.map((item, index) => {
          const isSelected = item === value;
          return (
            <div
              key={index}
              className="flex items-center justify-center"
              style={{ height: itemHeight }}
            >
              {renderItem(item, isSelected)}
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
