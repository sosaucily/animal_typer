// Free Wikimedia images, saved locally with the original credit and license.
// Run: npm run images:download (requires an internet connection).
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const animals = [
  ['A', 'Aardvark', 'Aardvark', 'African grasslands'],
  ['B', 'Bear', 'Brown_bear', 'Forests and mountains'],
  ['C', 'Cat', 'Cat', 'Gardens and cozy homes'],
  ['D', 'Dog', 'Golden_Retriever', 'Parks and family homes'],
  ['E', 'Elephant', 'African_bush_elephant', 'African savannas'],
  ['F', 'Fox', 'Red_fox', 'Woodlands and meadows'],
  ['G', 'Giraffe', 'Reticulated_giraffe', 'African savannas'],
  ['H', 'Hippo', 'Hippopotamus', 'Rivers and wetlands'],
  ['I', 'Iguana', 'Green_iguana', 'Tropical forest branches'],
  ['J', 'Jellyfish', 'Chrysaora_fuscescens', 'The Pacific Ocean'],
  ['K', 'Koala', 'Koala', 'Australian eucalyptus forests'],
  ['L', 'Lion', 'Lion', 'African grasslands'],
  ['M', 'Monkey', 'Vervet_monkey', 'African woodlands'],
  ['N', 'Narwhal', 'Narwhal', 'Icy Arctic waters'],
  ['O', 'Owl', 'Barn_owl', 'Meadows and farmlands'],
  ['P', 'Penguin', 'Emperor_penguin', 'Antarctic ice and sea'],
  ['Q', 'Quail', 'California_quail', 'Brushy fields and woodlands'],
  ['R', 'Rabbit', 'European_rabbit', 'Grassy meadows'],
  ['S', 'Snake', 'Corn_snake', 'Forests and fields'],
  ['T', 'Turtle', 'Green_sea_turtle', 'Warm ocean waters'],
  ['U', 'Unicorn', 'Unicorn', 'An imaginary storybook world'],
  ['V', 'Vulture', 'Griffon_vulture', 'Rocky cliffs and open skies'],
  ['W', 'Whale', 'Humpback_whale', 'Oceans around the world'],
  ['X', 'X-ray Fish', 'Pristella_maxillaris', 'South American rivers'],
  ['Y', 'Yak', 'Yak', 'High Himalayan grasslands'],
  ['Z', 'Zebra', 'Plains_zebra', 'African savannas'],
];
const directory = new URL('../public/animals/', import.meta.url);
await mkdir(directory, { recursive: true });
const credits = await readFile(new URL('credits.json', directory), 'utf8').then(JSON.parse).catch(() => ({}));
const plainText = (html = '') => html.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).trim();
async function get(url) {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const response = await fetch(url, { headers: { 'User-Agent': 'AlphabetZoo/1.0 (educational animal image downloader)' } });
    if (response.ok) return response;
    if (![429, 503].includes(response.status) || attempt === 3) throw new Error(`${response.status}: ${url}`);
    await new Promise((resolve) => setTimeout(resolve, 3000 * (attempt + 1)));
  }
}
for (const [letter, animal, article, habitat] of animals) {
  if (credits[letter]) { console.log(`${letter}: already downloaded`); continue; }
  const summary = await (await get(`https://en.wikipedia.org/api/rest_v1/page/summary/${article}`)).json();
  const original = summary.originalimage?.source;
  if (!original?.includes('/wikipedia/commons/')) throw new Error(`No Commons image for ${animal}`);
  const segments = new URL(original).pathname.split('/');
  const filename = decodeURIComponent(segments.at(segments.includes('thumb') ? -2 : -1));
  const params = new URLSearchParams({ action: 'query', format: 'json', prop: 'imageinfo', iiprop: 'url|extmetadata', titles: `File:${filename}`, iiurlwidth: '960' });
  const result = await (await get(`https://commons.wikimedia.org/w/api.php?${params}`)).json();
  const info = Object.values(result.query.pages)[0].imageinfo?.[0];
  const metadata = info?.extmetadata;
  const license = metadata?.LicenseShortName?.value;
  if (!license || !/^(CC BY(?:-SA)? [\d.]+|CC0|Public domain)$/.test(license)) throw new Error(`Review license for ${animal}: ${license}`);
  const source = info.thumburl || info.url;
  const extension = new URL(source).pathname.split('.').pop().toLowerCase();
  if (!['jpg', 'jpeg', 'png', 'webp'].includes(extension)) throw new Error(`Unsupported image for ${animal}: ${source}`);
  const path = `${letter}.${extension}`;
  await writeFile(new URL(path, directory), Buffer.from(await (await get(source)).arrayBuffer()));
  credits[letter] = {
    animal, habitat, image: `/animals/${path}`,
    title: plainText(metadata.ObjectName?.value || filename),
    artist: letter === 'D' ? 'Janneke Vreugdenhil; derivative work by Anka Friedrich' : plainText(metadata.Artist?.value || metadata.Credit?.value || 'Wikimedia Commons contributor'),
    license, licenseUrl: (metadata.LicenseUrl?.value || 'https://creativecommons.org/publicdomain/mark/1.0/').replace(/^http:/, 'https:'),
    sourceUrl: info.descriptionurl,
    changes: 'Resized by Wikimedia; displayed in a cropped frame.',
  };
  console.log(`${letter}: ${animal} — ${license}`);
  await writeFile(new URL('credits.json', directory), `${JSON.stringify(credits, null, 2)}\n`);
}
const orderedCredits = Object.fromEntries(animals.map(([letter]) => [letter, credits[letter]]));
await writeFile(new URL('credits.json', directory), `${JSON.stringify(orderedCredits, null, 2)}\n`);
await writeFile(new URL('../src/data/animalImages.json', import.meta.url), `${JSON.stringify(orderedCredits, null, 2)}\n`);
