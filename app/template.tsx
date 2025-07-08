"use client";

import Transition from "@/components/UI/Transition";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <Transition>
      {children}
    </Transition>
  );
}
