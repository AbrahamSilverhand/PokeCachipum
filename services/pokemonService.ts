
import axios from 'axios';
import { PokemonBase, PokemonDetails } from '../types';

const BASE_URL = 'https://pokeapi.co/api/v2';

export const fetchAllGen1 = async (): Promise<PokemonDetails[]> => {
  const response = await axios.get(`${BASE_URL}/pokemon?limit=151`);
  const results: PokemonBase[] = response.data.results;
  
  // Fetch detailed info for each to get types and images
  const detailedPromises = results.map(p => axios.get<PokemonDetails>(p.url));
  const detailedResponses = await Promise.all(detailedPromises);
  
  return detailedResponses.map(res => res.data);
};
