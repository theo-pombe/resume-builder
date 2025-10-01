const SectionDivider = ({ title }: { title: string }) => {
  return (
    <div className="text-sm flex items-center space-x-2 mt-6 mb-5">
      <span className="h-0.5 bg-teal-400 flex-1"></span>
      <span>{title}</span>
      <span className="h-0.5 bg-teal-400 flex-1"></span>
    </div>
  );
};

export default SectionDivider;
