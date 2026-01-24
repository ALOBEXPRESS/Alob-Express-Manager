export const Card = ({ className = "", ...props }) => {
  return <div className={`shadcn-card ${className}`} {...props} />;
};

export const CardHeader = ({ className = "", ...props }) => {
  return <div className={`shadcn-card-header ${className}`} {...props} />;
};

export const CardContent = ({ className = "", ...props }) => {
  return <div className={`shadcn-card-content ${className}`} {...props} />;
};

export const CardTitle = ({ className = "", ...props }) => {
  return <h3 className={`shadcn-card-title ${className}`} {...props} />;
};
