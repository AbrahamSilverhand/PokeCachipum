
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

export const TYPE_TRANSLATIONS: Record<string, string> = {
  normal: 'Normal',
  fire: 'Fuego',
  water: 'Agua',
  electric: 'Eléctrico',
  grass: 'Planta',
  ice: 'Hielo',
  fighting: 'Lucha',
  poison: 'Veneno',
  ground: 'Tierra',
  flying: 'Volador',
  psychic: 'Psíquico',
  bug: 'Bicho',
  rock: 'Roca',
  ghost: 'Fantasma',
  dragon: 'Dragón',
  dark: 'Siniestro',
  steel: 'Acero',
  fairy: 'Hada',
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

export const CHOICE_LABELS: Record<GameChoice, string> = {
  [GameChoice.ROCK]: 'Piedra',
  [GameChoice.PAPER]: 'Papel',
  [GameChoice.SCISSORS]: 'Tijeras',
};
