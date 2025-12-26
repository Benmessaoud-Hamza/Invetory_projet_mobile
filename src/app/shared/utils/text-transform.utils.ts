export const normalizeText = (text: string) => {
  return text
    .toLowerCase() // convert to lowercase
    .normalize('NFD') // separate letters from accents
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^\w\s]/g, '') // remove punctuation
    .replace(/\s+/g, ' ') // collapse multiple spaces
    .trim(); // remove leading/trailing spaces
};
