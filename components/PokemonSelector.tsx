
import React from 'react';
import { PokemonDetails } from '../types';

interface PokemonSelectorProps {
  pokemonList: PokemonDetails[];
  selectedP1: PokemonDetails | null;
  selectedP2: PokemonDetails | null;
  onSelect: (pokemon: PokemonDetails, player: 1 | 2) => void;
  currentPlayerTurn: 1 | 2;
}

const PokemonSelector: React.FC<PokemonSelectorProps> = ({ 
  pokemonList, 
  selectedP1, 
  selectedP2, 
  onSelect,
  currentPlayerTurn 
}) => {
  return (
    <div className="w-full bg-white rounded-2xl p-6 shadow-xl mb-8 border-t-8 border-pokeGold">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div className={`p-4 rounded-xl border-4 transition-all w-full md:w-64 flex items-center gap-4 ${currentPlayerTurn === 1 ? 'border-pokeRed bg-red-50 scale-105 shadow-md' : 'border-gray-100 opacity-60'}`}>
          <div className="w-12 h-12 rounded-full bg-pokeRed flex items-center justify-center text-white font-bold text-xl">1</div>
          <div className="text-left">
            <p className="text-xs font-bold text-pokeRed uppercase">Jugador 1</p>
            <p className="font-black text-gray-800 capitalize">{selectedP1 ? selectedP1.name : 'Eligiendo...'}</p>
          </div>
        </div>

        <div className="text-pokeGold font-pokemon text-2xl animate-bounce hidden md:block">VS</div>

        <div className={`p-4 rounded-xl border-4 transition-all w-full md:w-64 flex items-center gap-4 ${currentPlayerTurn === 2 ? 'border-pokeBlue bg-blue-50 scale-105 shadow-md' : 'border-gray-100 opacity-60'}`}>
          <div className="w-12 h-12 rounded-full bg-pokeBlue flex items-center justify-center text-white font-bold text-xl">2</div>
          <div className="text-left">
            <p className="text-xs font-bold text-pokeBlue uppercase">Jugador 2</p>
            <p className="font-black text-gray-800 capitalize">{selectedP2 ? selectedP2.name : 'Eligiendo...'}</p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        {currentPlayerTurn === 1 ? '¡Jugador 1, elige a tu Compañero!' : '¡Jugador 2, elige a tu Compañero!'}
      </h2>

      <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar snap-x">
        {pokemonList.map((pokemon) => {
          const isSelectedByOther = (currentPlayerTurn === 1 ? selectedP2?.id : selectedP1?.id) === pokemon.id;
          return (
            <button
              key={pokemon.id}
              disabled={isSelectedByOther}
              onClick={() => onSelect(pokemon, currentPlayerTurn)}
              className={`flex-shrink-0 snap-center p-4 rounded-xl border-4 transition-all duration-200 flex flex-col items-center w-32 ${
                isSelectedByOther ? 'opacity-20 grayscale cursor-not-allowed' :
                (currentPlayerTurn === 1 && selectedP1?.id === pokemon.id) || (currentPlayerTurn === 2 && selectedP2?.id === pokemon.id)
                  ? 'border-pokeYellow bg-yellow-50 scale-105 shadow-lg' 
                  : 'border-transparent bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <img 
                src={pokemon.sprites.front_default} 
                alt={pokemon.name} 
                className="w-20 h-20 object-contain drop-shadow-md"
              />
              <span className="capitalize font-bold text-gray-700 mt-2 truncate w-full text-center">
                {pokemon.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PokemonSelector;
