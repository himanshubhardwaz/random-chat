import { FC, ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  onClick?: (e: any) => void;
  loading?: boolean;
  type?: "button" | "submit" | "reset" | undefined;
};

const Button: FC<Props> = ({
  children,
  className = "",
  loading = false,
  type,
  ...rest
}) => {
  return (
    <button
      type={type}
      disabled={loading}
      className={`bg-red-500 px-4 py-2 rounded-md ${className} flex items-center justify-center`}
      {...rest}
    >
      {!loading ? children : "Please Wait ..."}
    </button>
  );
};

export default Button;
