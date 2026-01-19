
import React, { useState } from 'react';
import { PokemonDetails, GameChoice, GameResult, GameMode } from '../types';
import { GAME_RULES, CHOICE_EMOJIS } from '../constants';
import confetti from 'canvas-confetti';
import { RefreshCw, User, Users, Cpu, Trophy } from 'lucide-react';

interface GameArenaProps {
  player1: PokemonDetails;
  player2: PokemonDetails;
  p1Name: string;
  p2Name: string;
  mode: GameMode;
  onResetSelection: () => void;
}

const GameArena: React.FC<GameArenaProps> = ({ player1, player2, p1Name, p2Name, mode, onResetSelection }) => {
  const [turn, setTurn] = useState<1 | 2>(1);
  const [p1Choice, setP1Choice] = useState<GameChoice | null>(null);
  const [p2Choice, setP2Choice] = useState<GameChoice | null>(null);
  const [result, setResult] = useState<GameResult | 'P1_WIN' | 'P2_WIN' | 'DRAW' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showReveal, setShowReveal] = useState(false);

  const resetMatch = () => {
    setP1Choice(null);
    setP2Choice(null);
    setResult(null);
    setTurn(1);
    setShowReveal(false);
  };

  const handleChoice = (choice: GameChoice) => {
    if (turn === 1) {
      setP1Choice(choice);
      if (mode === 'single') {
        const cpuChoice = [GameChoice.ROCK, GameChoice.PAPER, GameChoice.SCISSORS][Math.floor(Math.random() * 3)] as GameChoice;
        setP2Choice(cpuChoice);
        startBattle(choice, cpuChoice);
      } else {
        setTurn(2);
      }
    } else {
      setP2Choice(choice);
      startBattle(p1Choice!, choice);
    }
  };

  const startBattle = (c1: GameChoice, c2: GameChoice) => {
    setIsAnimating(true);
    setTimeout(() => {
      setShowReveal(true);
      setTimeout(() => {
        if (c1 === c2) {
          setResult('DRAW');
        } else if (GAME_RULES[c1] === c2) {
          setResult('P1_WIN');
          confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#EE1515', '#FFCB05'] });
        } else {
          setResult('P2_WIN');
          confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#2A75BB', '#FFCB05'] });
        }
        setIsAnimating(false);
      }, 800);
    }, 500);
  };

  const getP1Animation = () => {
    if (isAnimating) return 'animate-hit-right';
    if (result === 'P1_WIN') return 'animate-victory';
    if (result === 'P2_WIN') return 'animate-defeat';
    if (result === 'DRAW') return 'animate-shake';
    return 'animate-sprite-bounce';
  };

  const getP2Animation = () => {
    if (isAnimating) return 'animate-hit-left';
    if (result === 'P2_WIN') return 'animate-victory';
    if (result === 'P1_WIN') return 'animate-defeat';
    if (result === 'DRAW') return 'animate-shake';
    return 'animate-sprite-bounce';
  };

  const getSprite = (pokemon: PokemonDetails) => {
    return pokemon.sprites.versions?.['generation-v']?.['black-white']?.animated?.front_default || 
           pokemon.sprites.front_default;
  };

  const getWinnerText = () => {
    if (result === 'P1_WIN') return `¡Gana ${p1Name}!`;
    if (result === 'P2_WIN') return `¡Gana ${p2Name}!`;
    return '¡EMPATE!';
  };

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto py-8 px-4">
      {!showReveal && !result && (
        <div className="mb-6 bg-white px-8 py-4 rounded-full shadow-lg border-4 border-pokeGold animate-bounce">
          <div className="text-2xl font-black text-gray-800 flex items-center gap-3">
             {turn === 1 ? (
               <span className="flex items-center gap-3">
                 <span className="w-8 h-8 rounded-full bg-pokeRed text-white flex items-center justify-center text-sm">1</span> 
                 ¡Tu turno, {p1Name}!
               </span>
             ) : (
               <span className="flex items-center gap-3">
                 <span className="w-8 h-8 rounded-full bg-pokeBlue text-white flex items-center justify-center text-sm">2</span> 
                 ¡Tu turno, {p2Name}!
               </span>
             )}
          </div>
        </div>
      )}

      <div className="w-full relative flex flex-col md:flex-row items-center justify-between gap-8 mb-12 bg-white rounded-3xl p-12 shadow-2xl overflow-hidden border-8 border-pokeGold">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pokeRed via-pokeYellow to-pokeBlue"></div>

        <div className={`flex flex-col items-center flex-1 transition-all duration-500 ${getP1Animation()}`}>
          <div className="relative mb-4">
            <div className={`absolute -inset-8 rounded-full transition-colors duration-500 ${result === 'P1_WIN' ? 'bg-green-100 animate-pulse' : 'bg-pokeRed/5'}`}></div>
            <img 
              src={getSprite(player1)} 
              alt={player1.name}
              className={`w-40 h-40 md:w-56 md:h-56 object-contain drop-shadow-2xl z-20 relative transition-all duration-500`}
              style={{ imageRendering: 'pixelated' }}
            />
            {showReveal && p1Choice && (
               <div className="absolute top-0 right-0 bg-white border-4 border-pokeRed rounded-full p-4 shadow-xl text-4xl z-30 transform translate-x-1/2 -translate-y-1/4 animate-bounce">
                 {CHOICE_EMOJIS[p1Choice]}
               </div>
            )}
          </div>
          <h3 className="text-2xl font-black uppercase tracking-tight text-gray-800 truncate max-w-[200px]">{player1.name}</h3>
          <span className="text-pokeRed font-black flex items-center gap-2 mt-1 italic tracking-tighter">
            <User size={16} /> {p1Name}
          </span>
        </div>

        <div className="z-10 flex flex-col items-center">
          {(!result && !isAnimating) ? (
            <div className="bg-pokeGold text-white font-pokemon text-4xl w-24 h-24 flex items-center justify-center rounded-full border-4 border-white shadow-xl animate-pulse">
              VS
            </div>
          ) : result ? (
             <div className="text-center">
                <Trophy className="text-pokeGold mb-2 animate-bounce" size={48} />
             </div>
          ) : (
            <RefreshCw className="text-pokeYellow animate-spin" size={48} />
          )}
        </div>

        <div className={`flex flex-col items-center flex-1 transition-all duration-500 ${getP2Animation()}`}>
          <div className="relative mb-4">
            <div className={`absolute -inset-8 rounded-full transition-colors duration-500 ${result === 'P2_WIN' ? 'bg-green-100 animate-pulse' : 'bg-pokeBlue/5'}`}></div>
            <img 
              src={getSprite(player2)} 
              alt={player2.name}
              className={`w-40 h-40 md:w-56 md:h-56 object-contain drop-shadow-2xl z-20 relative scale-x-[-1] transition-all duration-500`}
              style={{ imageRendering: 'pixelated' }}
            />
            {showReveal && p2Choice && (
               <div className="absolute top-0 left-0 bg-white border-4 border-pokeBlue rounded-full p-4 shadow-xl text-4xl z-30 transform -translate-x-1/2 -translate-y-1/4 animate-bounce">
                 {CHOICE_EMOJIS[p2Choice]}
               </div>
            )}
          </div>
          <h3 className="text-2xl font-black uppercase tracking-tight text-gray-800 truncate max-w-[200px]">{player2.name}</h3>
          <span className="text-pokeBlue font-black flex items-center gap-2 mt-1 italic tracking-tighter">
            {mode === 'single' ? <Cpu size={16} /> : <User size={16} />} {p2Name}
          </span>
        </div>
      </div>

      {result && (
        <div className="text-center mb-8 animate-fade-in">
          <h2 className={`text-5xl font-pokemon tracking-widest mb-6 ${
            result === 'P1_WIN' ? 'text-pokeRed' : result === 'P2_WIN' ? 'text-pokeBlue' : 'text-gray-500'
          }`}>
            {getWinnerText()}
          </h2>
          <div className="flex gap-4 justify-center">
            <button onClick={resetMatch} className="flex items-center gap-2 bg-gray-800 text-white px-8 py-4 rounded-full font-bold hover:bg-gray-700 transition-all shadow-lg active:scale-95">
              <RefreshCw size={20} /> Revancha
            </button>
            <button onClick={onResetSelection} className="flex items-center gap-2 bg-white text-gray-800 border-4 border-gray-800 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all shadow-lg active:scale-95">
              <Users size={20} /> Cambiar Pokémon
            </button>
          </div>
        </div>
      )}

      {!result && !isAnimating && (
        <div className={`w-full max-w-lg p-8 rounded-3xl shadow-xl flex flex-col items-center transition-colors duration-500 ${turn === 1 ? 'bg-red-50 border-4 border-pokeRed' : 'bg-blue-50 border-4 border-pokeBlue'}`}>
          <div className="mb-6 text-center">
            <h4 className="text-2xl font-black text-gray-800 uppercase mb-2">
               ¿Qué hará {turn === 1 ? p1Name : p2Name}?
            </h4>
            <p className="text-gray-500 font-bold italic">
              ¡{mode === 'multi' && turn === 2 ? p1Name + ' ya eligió...' : 'Elige sabiamente!'}
            </p>
          </div>
          <div className="flex gap-6 w-full justify-center">
            {(Object.values(GameChoice) as GameChoice[]).map((choice) => (
              <button
                key={choice}
                onClick={() => handleChoice(choice)}
                className={`group flex-1 flex flex-col items-center gap-3 p-6 rounded-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-md border-4 bg-white ${
                  choice === GameChoice.ROCK ? 'border-gray-300 text-gray-700' : 
                  choice === GameChoice.PAPER ? 'border-blue-300 text-blue-700' : 
                  'border-red-300 text-red-700'
                }`}
              >
                <span className="text-5xl group-hover:rotate-12 transition-transform">{CHOICE_EMOJIS[choice]}</span>
                <span className="font-black uppercase text-sm tracking-widest">{choice === 'rock' ? 'Piedra' : choice === 'paper' ? 'Papel' : 'Tijeras'}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {isAnimating && (
        <div className="text-center py-10">
          <p className="font-pokemon text-4xl text-pokeGold animate-pulse mb-4 tracking-widest italic">¡POKE-ATAQUE!</p>
          <div className="flex gap-4 justify-center">
             <div className="w-4 h-4 bg-pokeRed rounded-full animate-bounce delay-75"></div>
             <div className="w-4 h-4 bg-pokeYellow rounded-full animate-bounce delay-150"></div>
             <div className="w-4 h-4 bg-pokeBlue rounded-full animate-bounce delay-225"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameArena;
