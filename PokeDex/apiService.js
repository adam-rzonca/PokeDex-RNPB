export const fetchPokemonsList = async () => {
  const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=50');
  const data = await response.json();
  return data;
};

export const fetchPokemon = async (url, signal) => {
  const response = await fetch(url, {signal});

  const data = await response.json();
  return data;
};
