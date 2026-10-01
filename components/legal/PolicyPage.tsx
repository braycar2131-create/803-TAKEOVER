import type { ReactNode } from "react";

type PolicyPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export default function PolicyPage({
  eyebrow,
  title,
  description,
  children,
}: PolicyPageProps) {
  return (
    <>
      <section className="legal-hero">
        <span>{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </section>

      <section className="legal-content">
        <p className="legal-updated">
          LAST UPDATED: AUGUST 4, 2026
        </p>

        {children}
      </section>
    </>
  );
}
