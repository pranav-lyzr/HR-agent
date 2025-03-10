
import React from 'react';
import { Loader } from 'lucide-react';

const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex items-center space-x-2 p-4 mb-4 animate-pulse">
      <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center space-x-3">
          <Loader className="h-5 w-5 text-purple-500 animate-spin" />
          <span className="text-sm text-gray-500">Thinking...</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;