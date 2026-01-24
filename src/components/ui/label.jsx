export const Label = ({ className = "", ...props }) => {
  return <label className={`shadcn-label ${className}`} {...props} />;
};
