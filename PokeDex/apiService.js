export const fetchData = async (url, signal) => {
  const response = await fetch(url, {signal});
  const data = await response.json();
  return data;
};
