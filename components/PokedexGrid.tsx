
import React from 'react';
import { PokemonDetails } from '../types';
import PokedexCard from './PokedexCard';

interface PokedexGridProps {
  pokemonList: PokemonDetails[];
}

const PokedexGrid: React.FC<PokedexGridProps> = ({ pokemonList }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-4">
      {pokemonList.map(pokemon => (
        <PokedexCard key={pokemon.id} pokemon={pokemon} />
      ))}
    </div>
  );
};

export default PokedexGrid;
