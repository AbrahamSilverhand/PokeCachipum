
import { GameChoice } from './types';

export const TYPE_COLORS: Record<string, string> = {
  normal: 'bg-gray-400',
  fire: 'bg-orange-500',
  water: 'bg-blue-500',
  electric: 'bg-yellow-400',
  grass: 'bg-green-500',
  ice: 'bg-cyan-300',
  fighting: 'bg-red-700',
  poison: 'bg-purple-500',
  ground: 'bg-amber-600',
  flying: 'bg-indigo-300',
  psychic: 'bg-pink-500',
  bug: 'bg-lime-500',
  rock: 'bg-stone-600',
  ghost: 'bg-violet-700',
  dragon: 'bg-indigo-700',
  dark: 'bg-zinc-800',
  steel: 'bg-slate-400',
  fairy: 'bg-rose-300',
};

export const GAME_RULES: Record<GameChoice, GameChoice> = {
  [GameChoice.ROCK]: GameChoice.SCISSORS,
  [GameChoice.PAPER]: GameChoice.ROCK,
  [GameChoice.SCISSORS]: GameChoice.PAPER,
};

export const CHOICE_EMOJIS: Record<GameChoice, string> = {
  [GameChoice.ROCK]: '🪨',
  [GameChoice.PAPER]: '📄',
  [GameChoice.SCISSORS]: '✂️',
};
