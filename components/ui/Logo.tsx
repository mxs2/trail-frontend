import Image from 'next/image';

interface LogoProps {
  width?: number;
  height?: number;
}

export default function Logo({ width = 92, height = 22 }: LogoProps) {
  return (
    <Image
      src="/trail-logo.png"
      alt="Trail"
      width={width}
      height={height}
      style={{ filter: 'brightness(0) invert(1)', opacity: 0.95 }}
    />
  );
}
