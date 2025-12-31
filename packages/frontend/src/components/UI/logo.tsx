import React from 'react';

const Logo = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-md flex items-center justify-center">
        <span className="text-white font-bold text-lg">Y</span>
      </div>
      <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
        ZapHalo
      </span>
    </div>
  );
};

export default Logo;