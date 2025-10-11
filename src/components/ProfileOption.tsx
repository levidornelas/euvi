"use client";

import { useRouter } from "next/navigation";

type OptionProps = {
  icon: React.ReactNode;
  label: string;
  textColor?: string;
  pushTo?: string;
  action?: () => void;
};

export function ProfileOption({
  icon,
  label,
  textColor,
  pushTo,
  action,
}: OptionProps) {
  const router = useRouter();

  const handleClick = () => {
    if (action) {
      action();
    }
    if (pushTo) {
      router.push(pushTo);
    }
  };

  return (
    <button
      className={`flex items-center w-full px-4 py-3 rounded-xl text-sm hover:opacity-80 hover:text-primary hover:cursor-pointer transition ${
        textColor || "text-gray-700"
      }`}
      onClick={handleClick}
    >
      <div className="mr-3">{icon}</div>
      <span>{label}</span>
    </button>
  );
}
