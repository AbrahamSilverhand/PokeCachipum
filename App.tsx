
import React, { useState, useEffect } from 'react';
import { PokemonDetails, View } from './types';
import { fetchAllGen1 } from './services/pokemonService';
import LoadingScreen from './components/LoadingScreen';
import PokedexGrid from './components/PokedexGrid';
import PokemonSelector from './components/PokemonSelector';
import GameArena from './components/GameArena';
import { Search, Gamepad2, LayoutGrid, Info } from 'lucide-react';

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [pokemonList, setPokemonList] = useState<PokemonDetails[]>([]);
  const [activeView, setActiveView] = useState<View>('pokedex');
  
  // 2-Player Selection State
  const [p1Companion, setP1Companion] = useState<PokemonDetails | null>(null);
  const [p2Companion, setP2Companion] = useState<PokemonDetails | null>(null);
  const [selectionTurn, setSelectionTurn] = useState<1 | 2>(1);

  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const init = async () => {
      try {
        const data = await fetchAllGen1();
        setPokemonList(data);
      } catch (error) {
        console.error("Error fetching Pokémon data:", error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleSelection = (pokemon: PokemonDetails, player: 1 | 2) => {
    if (player === 1) {
      setP1Companion(pokemon);
      setSelectionTurn(2);
    } else {
      setP2Companion(pokemon);
    }
  };

  const resetSelection = () => {
    setP1Companion(null);
    setP2Companion(null);
    setSelectionTurn(1);
  };

  const filteredPokemon = pokemonList.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.id.toString() === searchTerm
  );

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen pb-24 bg-softGray font-sans">
      {/* Header / Nav */}
      <header className="sticky top-0 z-40 w-full bg-pokeRed text-white shadow-lg border-b-8 border-pokeGold">
        <div className="max-w-7xl mx-auto px-4 h-24 flex items-center justify-between">
          <div 
            className="flex items-center gap-4 cursor-pointer group" 
            onClick={() => setActiveView('pokedex')}
          >
            {/* Pokéball Logo */}
            <div className="relative w-14 h-14 bg-white rounded-full border-4 border-gray-900 overflow-hidden shadow-xl group-hover:animate-pokeball-roll transition-all duration-300">
              <div className="absolute top-0 w-full h-1/2 bg-pokeRed border-b-4 border-gray-900"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-white border-4 border-gray-900 rounded-full z-10">
                <div className="w-full h-full bg-white rounded-full border border-gray-300"></div>
              </div>
            </div>
            
            <h1 className="font-pokemon text-4xl mt-2 pokemon-logo hidden sm:block">
              PokéArena
            </h1>
          </div>

          <div className="hidden md:flex bg-white/20 p-1 rounded-full gap-1">
             <button 
              onClick={() => setActiveView('pokedex')}
              className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all ${activeView === 'pokedex' ? 'bg-white text-pokeRed shadow-md' : 'hover:bg-white/10'}`}
             >
               <LayoutGrid size={20} /> Pokédex
             </button>
             <button 
              onClick={() => setActiveView('game')}
              className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all ${activeView === 'game' ? 'bg-white text-pokeRed shadow-md' : 'hover:bg-white/10'}`}
             >
               <Gamepad2 size={20} /> 2 Jugadores
             </button>
          </div>

          <div className="relative group flex items-center">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-pokeRed z-10" size={18} />
            <input 
              type="text" 
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-full text-gray-800 focus:outline-none focus:ring-4 focus:ring-pokeYellow/50 w-32 md:w-64 transition-all"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeView === 'pokedex' ? (
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-8 bg-pokeBlue text-white p-6 rounded-2xl shadow-xl">
               <div className="p-3 bg-white/20 rounded-xl">
                 <LayoutGrid size={32} />
               </div>
               <div>
                 <h2 className="text-3xl font-black uppercase italic">Archivo Pokédex</h2>
                 <p className="text-blue-100 font-medium">Explorando la región de Kanto: {pokemonList.length} Pokémon encontrados</p>
               </div>
            </div>
            <PokedexGrid pokemonList={filteredPokemon} />
            {filteredPokemon.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Info size={64} className="mb-4 opacity-20" />
                <p className="text-2xl font-bold">No se encontró ningún Pokémon.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="animate-fade-in">
            {(!p1Companion || !p2Companion) && (
              <PokemonSelector 
                pokemonList={pokemonList} 
                selectedP1={p1Companion}
                selectedP2={p2Companion}
                onSelect={handleSelection}
                currentPlayerTurn={selectionTurn}
              />
            )}
            
            {p1Companion && p2Companion ? (
              <GameArena 
                player1={p1Companion} 
                player2={p2Companion}
                onResetSelection={resetSelection}
              />
            ) : null}
          </div>
        )}
      </main>

      {/* Mobile Nav Sticky */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 md:hidden bg-gray-800 text-white flex items-center p-2 rounded-full shadow-2xl z-50 border-4 border-pokeRed">
        <button 
          onClick={() => setActiveView('pokedex')}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${activeView === 'pokedex' ? 'bg-pokeRed text-white' : 'text-gray-400'}`}
        >
          <LayoutGrid size={24} />
        </button>
        <button 
          onClick={() => setActiveView('game')}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${activeView === 'game' ? 'bg-pokeRed text-white' : 'text-gray-400'}`}
        >
          <Gamepad2 size={24} />
        </button>
      </nav>

      <footer className="mt-20 py-12 bg-white border-t-4 border-gray-100">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-pokeRed rounded-full border-2 border-gray-900 relative overflow-hidden">
               <div className="absolute top-0 w-full h-1/2 bg-pokeRed border-b-2 border-gray-900"></div>
            </div>
            <p className="font-bold text-gray-600">© 2024 PokéArena - Hecho con Poké-Amor</p>
          </div>
          <p className="text-sm font-medium text-gray-400 text-center md:text-right">
            Los datos e imágenes provienen de PokeAPI. <br className="hidden md:block"/> Todos los derechos pertenecen a Nintendo/Creatures Inc./GAME FREAK inc.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
