export const Button = ({ className = "", variant = "primary", ...props }) => {
  const variantClass =
    variant === "outline"
      ? "shadcn-btn-outline"
      : variant === "ghost"
      ? "shadcn-btn-ghost"
      : "shadcn-btn-primary";
  return (
    <button className={`shadcn-btn ${variantClass} ${className}`} {...props} />
  );
};
