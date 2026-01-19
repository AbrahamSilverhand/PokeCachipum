
import React, { useState, useEffect, useMemo } from 'react';
import { PokemonDetails, View, GameMode } from './types';
import { fetchAllGen1 } from './services/pokemonService';
import LoadingScreen from './components/LoadingScreen';
import PokedexGrid from './components/PokedexGrid';
import PokemonSelector from './components/PokemonSelector';
import GameArena from './components/GameArena';
import { Search, Gamepad2, LayoutGrid, User, Users, ChevronRight, UserCircle, X } from 'lucide-react';

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [pokemonList, setPokemonList] = useState<PokemonDetails[]>([]);
  const [activeView, setActiveView] = useState<View>('pokedex');
  const [error, setError] = useState<string | null>(null);
  
  // Game State
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [p1Name, setP1Name] = useState<string>('');
  const [p2Name, setP2Name] = useState<string>('');
  const [isNamingPhase, setIsNamingPhase] = useState<boolean>(false);
  const [p1Companion, setP1Companion] = useState<PokemonDetails | null>(null);
  const [p2Companion, setP2Companion] = useState<PokemonDetails | null>(null);
  const [selectionTurn, setSelectionTurn] = useState<1 | 2>(1);

  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const init = async () => {
      try {
        const data = await fetchAllGen1();
        setPokemonList(data);
      } catch (err: any) {
        setError("Error al cargar los Pokémon. Por favor intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleSelection = (pokemon: PokemonDetails, player: 1 | 2) => {
    if (player === 1) {
      setP1Companion(pokemon);
      if (gameMode === 'single') {
        const randomCpu = pokemonList[Math.floor(Math.random() * pokemonList.length)];
        setP2Companion(randomCpu);
      } else {
        setSelectionTurn(2);
      }
    } else {
      setP2Companion(pokemon);
    }
  };

  const resetSelection = () => {
    setP1Companion(null);
    setP2Companion(null);
    setSelectionTurn(1);
  };

  const startNamingPhase = (mode: GameMode) => {
    setGameMode(mode);
    setP1Name('');
    setP2Name(mode === 'single' ? 'CPU' : '');
    setIsNamingPhase(true);
    setActiveView('game');
  };

  const finalizeNaming = () => {
    const finalP1 = p1Name.trim() || 'Jugador 1';
    const finalP2 = p2Name.trim() || (gameMode === 'single' ? 'CPU' : 'Jugador 2');
    setP1Name(finalP1);
    setP2Name(finalP2);
    setIsNamingPhase(false);
  };

  const filteredPokemon = useMemo(() => {
    return pokemonList.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.id.toString() === searchTerm
    );
  }, [pokemonList, searchTerm]);

  if (loading) return <LoadingScreen />;
  
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-red-500 mb-4">{error}</h1>
        <button onClick={() => window.location.reload()} className="bg-pokeRed text-white px-6 py-2 rounded-full font-bold">Reintentar</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 bg-softGray font-sans">
      <header className="sticky top-0 z-40 w-full bg-pokeRed text-white shadow-lg border-b-8 border-pokeGold">
        <div className="max-w-7xl mx-auto px-4 h-24 flex items-center justify-between">
          <div 
            className="flex items-center gap-4 cursor-pointer group" 
            onClick={() => {
              setActiveView('pokedex');
              setGameMode(null);
              setIsNamingPhase(false);
            }}
          >
            <div className="relative w-14 h-14 bg-white rounded-full border-4 border-gray-900 overflow-hidden shadow-xl group-hover:animate-pokeball-roll transition-all duration-300">
              <div className="absolute top-0 w-full h-1/2 bg-pokeRed border-b-4 border-gray-900"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-white border-4 border-gray-900 rounded-full z-10">
                <div className="w-full h-full bg-white rounded-full border border-gray-300"></div>
              </div>
            </div>
            <h1 className="font-pokemon text-3xl md:text-4xl mt-2 pokemon-logo hidden sm:block">
              PokeCachipum
            </h1>
          </div>

          <div className="hidden md:flex bg-white/20 p-1 rounded-full gap-1">
             <button 
              onClick={() => {
                setActiveView('pokedex');
                setGameMode(null);
                setIsNamingPhase(false);
              }}
              className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all ${activeView === 'pokedex' ? 'bg-white text-pokeRed shadow-md' : 'hover:bg-white/10'}`}
             >
               <LayoutGrid size={20} /> Pokédex
             </button>
             <button 
              onClick={() => setActiveView('game')}
              className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all ${activeView === 'game' ? 'bg-white text-pokeRed shadow-md' : 'hover:bg-white/10'}`}
             >
               <Gamepad2 size={20} /> Batalla
             </button>
          </div>

          <div className="relative group flex items-center">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-pokeRed z-10" size={18} />
            <input 
              type="text" 
              placeholder="Buscar en Pokédex..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10 py-2 rounded-full text-gray-800 focus:outline-none focus:ring-4 focus:ring-pokeYellow/50 w-40 md:w-64 transition-all"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pokeRed"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeView === 'pokedex' ? (
          <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-pokeBlue text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <LayoutGrid size={120} />
               </div>
               <div className="flex items-center gap-4 z-10">
                 <div className="p-3 bg-white/20 rounded-2xl">
                   <LayoutGrid size={32} />
                 </div>
                 <div>
                   <h2 className="text-3xl font-black uppercase italic tracking-tighter">Archivo Pokédex</h2>
                   <p className="text-blue-100 font-bold opacity-80">Explorando la región de Kanto: {filteredPokemon.length} Pokémon</p>
                 </div>
               </div>
               {searchTerm && (
                 <div className="bg-white/20 px-4 py-2 rounded-xl font-bold text-sm z-10">
                   Resultados para: "{searchTerm}"
                 </div>
               )}
            </div>
            
            {filteredPokemon.length > 0 ? (
              <PokedexGrid pokemonList={filteredPokemon} />
            ) : (
              <div className="flex flex-col items-center py-20 text-gray-400">
                <Search size={64} className="mb-4 opacity-20" />
                <p className="text-2xl font-black">¡No hay Pokémon con ese nombre!</p>
                <button onClick={() => setSearchTerm('')} className="mt-4 text-pokeBlue font-bold hover:underline">Mostrar todos</button>
              </div>
            )}
          </div>
        ) : (
          <div className="animate-fade-in">
            {!gameMode ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-12">
                <div className="text-center">
                  <h2 className="text-5xl font-pokemon text-pokeGold tracking-widest mb-2">¡MODO DE JUEGO!</h2>
                  <p className="text-gray-400 font-bold uppercase tracking-[0.3em]">Elige tu desafío</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-4xl">
                  <button onClick={() => startNamingPhase('single')} className="group bg-white border-8 border-pokeBlue p-12 rounded-[3rem] shadow-2xl hover:scale-105 transition-all flex flex-col items-center space-y-6">
                    <div className="p-8 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors shadow-inner">
                      <User size={80} className="text-pokeBlue" />
                    </div>
                    <div className="text-center">
                      <span className="text-3xl font-black text-gray-800 uppercase block tracking-tighter">1 Jugador</span>
                      <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Contra la CPU</span>
                    </div>
                  </button>
                  <button onClick={() => startNamingPhase('multi')} className="group bg-white border-8 border-pokeRed p-12 rounded-[3rem] shadow-2xl hover:scale-105 transition-all flex flex-col items-center space-y-6">
                    <div className="p-8 bg-red-50 rounded-full group-hover:bg-red-100 transition-colors shadow-inner">
                      <Users size={80} className="text-pokeRed" />
                    </div>
                    <div className="text-center">
                      <span className="text-3xl font-black text-gray-800 uppercase block tracking-tighter">2 Jugadores</span>
                      <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Local (PVP)</span>
                    </div>
                  </button>
                </div>
              </div>
            ) : isNamingPhase ? (
              <div className="max-w-xl mx-auto bg-white p-12 rounded-[3rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.1)] border-t-8 border-pokeGold animate-float">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-black text-gray-800 uppercase tracking-tighter">Perfil de Entrenador</h2>
                  <p className="text-gray-400 font-bold uppercase text-xs tracking-widest mt-1 italic">Ingresa los datos para la batalla</p>
                </div>
                <div className="space-y-8">
                  <div className="flex flex-col gap-3">
                    <label className="text-pokeRed font-black uppercase text-xs ml-4 flex items-center gap-2"><UserCircle size={18} /> Entrenador 1</label>
                    <input 
                      autoFocus
                      type="text" 
                      maxLength={12}
                      placeholder="Ej: Ash Ketchum" 
                      value={p1Name} 
                      onChange={(e) => setP1Name(e.target.value)}
                      className="p-5 rounded-3xl border-4 border-red-50 focus:border-pokeRed outline-none transition-all text-2xl font-black bg-red-50 text-gray-800 placeholder:text-red-200"
                    />
                  </div>
                  {gameMode === 'multi' && (
                    <div className="flex flex-col gap-3">
                      <label className="text-pokeBlue font-black uppercase text-xs ml-4 flex items-center gap-2"><UserCircle size={18} /> Entrenador 2</label>
                      <input 
                        type="text" 
                        maxLength={12}
                        placeholder="Ej: Gary Oak" 
                        value={p2Name} 
                        onChange={(e) => setP2Name(e.target.value)}
                        className="p-5 rounded-3xl border-4 border-blue-50 focus:border-pokeBlue outline-none transition-all text-2xl font-black bg-blue-50 text-gray-800 placeholder:text-blue-200"
                      />
                    </div>
                  )}
                  <button 
                    onClick={finalizeNaming}
                    className="w-full bg-pokeGold text-white p-6 rounded-3xl text-2xl font-black shadow-[0_10px_0_0_#C7A008] active:shadow-none active:translate-y-2 hover:bg-pokeYellow transition-all flex items-center justify-center gap-3 group"
                  >
                    ¡IR A ELEGIR POKÉMON! <ChevronRight className="group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="animate-fade-in max-w-6xl mx-auto">
                {(!p1Companion || !p2Companion) && (
                  <PokemonSelector 
                    pokemonList={pokemonList} 
                    selectedP1={p1Companion}
                    selectedP2={p2Companion}
                    p1Name={p1Name}
                    p2Name={p2Name}
                    onSelect={handleSelection}
                    currentPlayerTurn={selectionTurn}
                  />
                )}
                
                {p1Companion && p2Companion ? (
                  <GameArena 
                    player1={p1Companion} 
                    player2={p2Companion}
                    p1Name={p1Name}
                    p2Name={p2Name}
                    mode={gameMode}
                    onResetSelection={resetSelection}
                  />
                ) : null}

                <div className="mt-12 text-center">
                  <button 
                    onClick={() => {setGameMode(null); setIsNamingPhase(false);}} 
                    className="group bg-white/50 px-6 py-3 rounded-full text-gray-400 font-black uppercase tracking-widest text-xs hover:text-pokeRed hover:bg-white transition-all shadow-sm border border-transparent hover:border-pokeRed/20"
                  >
                    ← Volver a selección de modo
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 md:hidden bg-gray-900/90 backdrop-blur-md text-white flex items-center p-2 rounded-full shadow-2xl z-50 border-4 border-pokeRed">
        <button 
          onClick={() => {setActiveView('pokedex'); setGameMode(null);}} 
          className={`px-8 py-4 rounded-full font-black transition-all flex items-center gap-2 ${activeView === 'pokedex' ? 'bg-pokeRed shadow-lg scale-110' : 'text-gray-400 hover:text-white'}`}
        >
          <LayoutGrid size={24} />
          {activeView === 'pokedex' && <span className="text-xs uppercase tracking-widest">Pokédex</span>}
        </button>
        <div className="w-1 h-8 bg-gray-700 mx-2 rounded-full"></div>
        <button 
          onClick={() => setActiveView('game')} 
          className={`px-8 py-4 rounded-full font-black transition-all flex items-center gap-2 ${activeView === 'game' ? 'bg-pokeRed shadow-lg scale-110' : 'text-gray-400 hover:text-white'}`}
        >
          <Gamepad2 size={24} />
          {activeView === 'game' && <span className="text-xs uppercase tracking-widest">Jugar</span>}
        </button>
      </nav>
    </div>
  );
};

export default App;
