"use client";

export default function MagneticButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="magnetic-button" type="button">
      <span>{children}</span>
    </button>
  );
}
