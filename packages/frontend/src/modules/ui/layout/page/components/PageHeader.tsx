export const PageHeader = ({
  title,
  hasClosePageButton,
  onClosePage,
  Icon,
  children,
  className,
}: PageHeaderProps) => {
  return (
    <div class={"font-bold text-lg border-gray-300 p-4 border-b "+className}>
        {title && (
          <div class="flex items-center">
            {Icon && (
              <Icon/>
            )}
            {typeof title === 'string' ? (
              <span class="ml-2"> {title}</span>
            ) : (
              title
            )}
          </div>
        )}
      <div className="page-action-container">
        {children}
      </div>
    </div>
  );
};
