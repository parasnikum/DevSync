"use client";
import React, { JSX, useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link?: string;
    action?: () => void;
    icon?: JSX.Element;
  }[];
  className?: string;
}) => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      const direction = current - scrollYProgress.getPrevious()!;
      if (scrollYProgress.get() < 0.05) setVisible(false);
      else setVisible(direction < 0);
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 1, y: -100 }}
        animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "fixed top-10 left-1/2 transform -translate-x-1/2 inline-flex rounded-full bg-white dark:bg-black shadow-lg px-4 py-2 items-center justify-center space-x-4 z-[5000]",
          className
        )}
      >
        {navItems.map((navItem, idx) =>
          navItem.link ? (
            <a
              key={idx}
              href={navItem.link}
              className="flex items-center justify-center space-x-1 text-neutral-600 dark:text-neutral-50 hover:text-neutral-500 dark:hover:text-neutral-300"
            >
              <span>{navItem.icon}</span>
              <span className="hidden md:inline text-sm">{navItem.name}</span>
            </a>
          ) : (
            <button
              key={idx}
              onClick={navItem.action}
              className="flex items-center justify-center space-x-1 text-neutral-600 dark:text-neutral-50 hover:text-neutral-500 dark:hover:text-neutral-300 bg-transparent border-none"
            >
              <span>{navItem.icon}</span>
              <span className="hidden md:inline text-sm">{navItem.name}</span>
            </button>
          )
        )}
      </motion.div>
    </AnimatePresence>
  );
};
