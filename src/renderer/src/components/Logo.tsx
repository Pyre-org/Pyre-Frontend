import clsx from "clsx";
import { Link } from "react-router-dom";

interface LogoProps {
  className?: string;
}

function Logo({ className }: LogoProps) {
  return (
    <Link to="/">
      <span className={clsx("text-3xl font-extrabold", className)}>PYRE</span>
    </Link>
  );
}

export default Logo;
