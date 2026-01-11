import React from 'react';

interface EmptyStateProps {
  message?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

const EmptyState = ({
  message = "No records found",
  icon: Icon
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4">
        {Icon && <Icon className="text-4xl text-gray-400 dark:text-gray-500" />}
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-theme-sm">
        {message}
      </p>
    </div>
  );
};

export default EmptyState;