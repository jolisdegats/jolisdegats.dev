"use client";

export default function Transition({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="page-transition">
      {children}
    </div>
  );
}
