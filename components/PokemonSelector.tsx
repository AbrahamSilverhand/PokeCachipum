
import React, { useState, useMemo } from 'react';
import { PokemonDetails } from '../types';
import { TYPE_COLORS } from '../constants';
import { Search, Filter, X } from 'lucide-react';

interface PokemonSelectorProps {
  pokemonList: PokemonDetails[];
  selectedP1: PokemonDetails | null;
  selectedP2: PokemonDetails | null;
  p1Name: string;
  p2Name: string;
  onSelect: (pokemon: PokemonDetails, player: 1 | 2) => void;
  currentPlayerTurn: 1 | 2;
}

const PokemonSelector: React.FC<PokemonSelectorProps> = ({ 
  pokemonList, 
  selectedP1, 
  selectedP2,
  p1Name,
  p2Name,
  onSelect,
  currentPlayerTurn 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const availableTypes = useMemo(() => {
    const types = new Set<string>();
    pokemonList.forEach(p => p.types.forEach(t => types.add(t.type.name)));
    return Array.from(types).sort();
  }, [pokemonList]);

  const filteredList = useMemo(() => {
    return pokemonList.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toString() === searchTerm;
      const matchesType = !selectedType || p.types.some(t => t.type.name === selectedType);
      return matchesSearch && matchesType;
    });
  }, [pokemonList, searchTerm, selectedType]);

  return (
    <div className="w-full bg-white rounded-3xl p-6 md:p-8 shadow-2xl mb-8 border-t-8 border-pokeGold animate-fade-in">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
        <div className={`p-4 rounded-2xl border-4 transition-all w-full md:w-72 flex items-center gap-4 ${currentPlayerTurn === 1 ? 'border-pokeRed bg-red-50 scale-105 shadow-xl' : 'border-gray-100 opacity-40 grayscale'}`}>
          <div className="w-14 h-14 rounded-full bg-pokeRed flex items-center justify-center text-white font-black text-2xl shadow-inner">{p1Name.charAt(0)}</div>
          <div className="text-left overflow-hidden flex-1">
            <p className="text-[10px] font-black text-pokeRed uppercase tracking-widest">Entrenador 1</p>
            <p className="font-black text-gray-800 text-lg leading-tight truncate">{p1Name}</p>
            <p className="text-sm font-bold text-gray-400 capitalize truncate">{selectedP1 ? selectedP1.name : 'Eligiendo...'}</p>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="text-pokeGold font-pokemon text-3xl animate-bounce mb-1">VS</div>
          <div className="h-1 w-12 bg-gray-200 rounded-full"></div>
        </div>

        <div className={`p-4 rounded-2xl border-4 transition-all w-full md:w-72 flex items-center gap-4 ${currentPlayerTurn === 2 ? 'border-pokeBlue bg-blue-50 scale-105 shadow-xl' : 'border-gray-100 opacity-40 grayscale'}`}>
          <div className="w-14 h-14 rounded-full bg-pokeBlue flex items-center justify-center text-white font-black text-2xl shadow-inner">{p2Name.charAt(0)}</div>
          <div className="text-left overflow-hidden flex-1">
            <p className="text-[10px] font-black text-pokeBlue uppercase tracking-widest">Entrenador 2</p>
            <p className="font-black text-gray-800 text-lg leading-tight truncate">{p2Name}</p>
            <p className="text-sm font-bold text-gray-400 capitalize truncate">{selectedP2 ? selectedP2.name : 'Eligiendo...'}</p>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-softGray p-6 rounded-2xl mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text"
              placeholder={`¡${currentPlayerTurn === 1 ? p1Name : p2Name}, busca por nombre o ID!`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border-4 border-transparent focus:border-pokeYellow outline-none font-bold text-gray-700 shadow-sm transition-all"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pokeRed">
                <X size={20} />
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
            <button 
              onClick={() => setSelectedType(null)}
              className={`px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest transition-all border-2 ${!selectedType ? 'bg-gray-800 text-white border-gray-800 shadow-md' : 'bg-white text-gray-400 border-gray-200 hover:border-gray-400'}`}
            >
              Todos
            </button>
            {availableTypes.map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type === selectedType ? null : type)}
                className={`px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest transition-all border-2 whitespace-nowrap ${
                  selectedType === type 
                  ? `${TYPE_COLORS[type]} text-white border-transparent shadow-lg scale-105` 
                  : `bg-white text-gray-500 border-gray-100 hover:border-gray-300`
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Pokemon */}
      <div className="h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {filteredList.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {filteredList.map((pokemon) => {
              const isSelectedByOther = (currentPlayerTurn === 1 ? selectedP2?.id : selectedP1?.id) === pokemon.id;
              const isCurrentSelection = (currentPlayerTurn === 1 ? selectedP1?.id : selectedP2?.id) === pokemon.id;
              const mainType = pokemon.types[0].type.name;
              
              return (
                <button
                  key={pokemon.id}
                  disabled={isSelectedByOther}
                  onClick={() => onSelect(pokemon, currentPlayerTurn)}
                  className={`group relative aspect-square p-2 rounded-2xl border-4 transition-all duration-300 flex flex-col items-center justify-center ${
                    isSelectedByOther ? 'opacity-20 grayscale cursor-not-allowed border-transparent' :
                    isCurrentSelection
                      ? 'border-pokeYellow bg-yellow-50 scale-105 shadow-xl ring-4 ring-pokeYellow/20' 
                      : 'border-transparent bg-white hover:bg-gray-50 hover:border-pokeGold/30 hover:-translate-y-1 shadow-md'
                  }`}
                >
                  <span className="absolute top-2 left-2 text-[10px] font-black text-gray-300">#{pokemon.id}</span>
                  <img 
                    src={pokemon.sprites.front_default} 
                    alt={pokemon.name} 
                    className={`w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-md group-hover:scale-110 transition-transform ${isSelectedByOther ? '' : 'animate-sprite-bounce'}`}
                    style={{ animationDelay: `${pokemon.id * 50}ms` }}
                  />
                  <span className="capitalize font-black text-xs md:text-sm text-gray-700 mt-1 truncate w-full text-center">
                    {pokemon.name}
                  </span>
                  <div className={`w-full h-1 mt-2 rounded-full ${TYPE_COLORS[mainType]} opacity-30`}></div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
            <div className="p-6 bg-gray-100 rounded-full">
              <Filter size={48} />
            </div>
            <p className="text-xl font-bold">No se encontraron Pokémon con esos filtros</p>
            <button 
              onClick={() => {setSearchTerm(''); setSelectedType(null);}}
              className="text-pokeBlue font-black uppercase tracking-widest text-sm hover:underline"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center">
        <p className="text-sm font-bold text-gray-400 italic">
          ¡Mostrando {filteredList.length} de {pokemonList.length} Pokémon!
        </p>
      </div>
    </div>
  );
};

export default PokemonSelector;
