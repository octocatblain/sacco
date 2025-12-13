import { icons } from "lucide-react";
import { FC } from "react";

export interface IconProps {
  color?: string;
  size?: number;
  name: keyof typeof icons | string;
  className?: string;
  onClick?: () => void;
}

const LucideIcon: FC<IconProps> = ({
  name,
  color,
  size = 16,
  className,
  onClick,
}) => {
  const IconComp = icons[name as keyof typeof icons];
  if (!IconComp) {
    if (import.meta && import.meta.env && import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.warn(`LucideIcon: unknown icon name "${name}"`);
    }
    return <span className={className} onClick={onClick} />;
  }
  return (
    <IconComp
      color={color}
      size={size}
      className={className}
      onClick={onClick}
    />
  );
};

export default LucideIcon;
