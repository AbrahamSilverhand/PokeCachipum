
export interface PokemonBase {
  name: string;
  url: string;
}

export interface PokemonDetails {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
    versions?: {
      'generation-v'?: {
        'black-white'?: {
          animated?: {
            front_default: string;
            back_default: string;
          };
        };
      };
    };
  };
  types: {
    type: {
      name: string;
    };
  }[];
}

export enum GameChoice {
  ROCK = 'rock',
  PAPER = 'paper',
  SCISSORS = 'scissors'
}

export enum GameResult {
  WIN = 'WIN',
  LOSE = 'LOSE',
  DRAW = 'DRAW'
}

export type View = 'pokedex' | 'game';
export type GameMode = 'single' | 'multi';
