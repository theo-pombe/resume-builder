interface GridWrapperProps {
  children: React.ReactNode;
  styles?: string;
}

const GridWrapper: React.FC<GridWrapperProps> = ({ children, styles = "" }) => {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ${styles}`}
    >
      {children}
    </div>
  );
};

export default GridWrapper;
