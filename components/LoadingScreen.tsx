
import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      <div className="w-24 h-24 border-8 border-gray-200 border-t-pokeRed rounded-full animate-spin mb-4 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white border-4 border-gray-200 rounded-full"></div>
      </div>
      <p className="text-2xl font-bold text-pokeRed animate-pulse">¡Capturando Pokémon...!</p>
    </div>
  );
};

export default LoadingScreen;
