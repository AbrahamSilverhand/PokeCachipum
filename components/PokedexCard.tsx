
import React from 'react';
import { PokemonDetails } from '../types';
import { TYPE_COLORS, TYPE_TRANSLATIONS } from '../constants';

interface PokedexCardProps {
  pokemon: PokemonDetails;
}

const PokedexCard: React.FC<PokedexCardProps> = ({ pokemon }) => {
  const mainType = pokemon.types[0].type.name;
  const bgColor = TYPE_COLORS[mainType] || 'bg-gray-100';

  return (
    <div className="group relative bg-white rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border-2 border-transparent hover:border-pokeRed">
      <div className={`w-full aspect-square ${bgColor} bg-opacity-10 rounded-xl flex items-center justify-center mb-4 overflow-hidden relative`}>
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white opacity-20 rounded-full"></div>
        <img 
          src={pokemon.sprites.other['official-artwork'].front_default} 
          alt={pokemon.name}
          className="w-4/5 h-4/5 object-contain group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="text-center">
        <p className="text-gray-400 font-medium text-sm">N.º {String(pokemon.id).padStart(3, '0')}</p>
        <h3 className="text-xl font-bold text-gray-800 capitalize mb-2">{pokemon.name}</h3>
        <div className="flex flex-wrap gap-1 justify-center">
          {pokemon.types.map(t => (
            <span 
              key={t.type.name} 
              className={`${TYPE_COLORS[t.type.name]} text-white text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider`}
            >
              {TYPE_TRANSLATIONS[t.type.name] || t.type.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PokedexCard;
