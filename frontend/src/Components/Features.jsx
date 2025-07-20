// src/Components/FeaturesSectionDemo.jsx
import { cn } from "@/lib/utils";
import {
  Activity,
  Brain,
  GitBranch,
  Clock,
  BookOpen,
  MessageCircle,
  TimerReset,
  BarChart3,
} from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      title: "Unified Developer Dashboard",
      description: "Track GitHub, LeetCode, Codeforces, and more from a single dashboard.",
      icon: <Activity />,
    },
    {
      title: "Smart Productivity Logs",
      description: "Log tasks, wins, blockers, and progress with daily summaries.",
      icon: <BookOpen />,
    },
    {
      title: "Live Pomodoro Timer",
      description: "Focus with an integrated Pomodoro and break cycle tracker.",
      icon: <TimerReset />,
    },
    {
      title: "Auto GitHub Sync",
      description: "Sync contributions, commits, and streaks automatically.",
      icon: <GitBranch />,
    },
    {
      title: "DSA Progress Tracking",
      description: "Keep tabs on your problem-solving journey across platforms.",
      icon: <Brain />,
    },
    {
      title: "Interactive Visualizations",
      description: "Understand your productivity via dynamic graphs and charts.",
      icon: <BarChart3 />,
    },
    {
      title: "Community Collaboration",
      description: "Connect, share logs, and grow together with other developers.",
      icon: <MessageCircle />,
    },
    {
      title: "Time Management Tools",
      description: "Track how you spend your dev hours with real insights.",
      icon: <Clock />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature dark:border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800"
      )}
    >
      {index < 4 ? (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      ) : (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};
