import Image from "next/image";

export function BrandLogo({ size = 64 }: { size?: number }) {
  return (
    <span
      className="relative z-10 grid shrink-0 place-items-center overflow-visible"
      style={{ width: size, height: size }}
    >
      <Image
        src="/images/unsolvedlogo.png"
        alt="Unsolved logo"
        width={size}
        height={size}
        className="size-full object-contain drop-shadow-[0_0_24px_color-mix(in_oklch,var(--primary)_34%,transparent)]"
        priority
      />
    </span>
  );
}
