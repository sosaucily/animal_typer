import { useState } from 'react';
import images from '../data/animalImages.json';
import { ALPHABET_DATA, getAnimalSVG } from '../data/animals';

const fallbackAnimals = Object.fromEntries(ALPHABET_DATA.map(({ letter }) => [letter, getAnimalSVG(letter)]));

export default function AnimalPicture({ letter, showCredit = false, className = '' }) {
  const [failed, setFailed] = useState(false);
  const image = images[letter];
  const animal = ALPHABET_DATA.find((item) => item.letter === letter);
  const Fallback = fallbackAnimals[letter];
  return (
    <figure className={`animal-picture ${className}`}>
      {!failed && image ? <img src={image.image} alt={`${animal.animal}${letter === 'U' ? ', a storybook illustration' : ''}`} style={{ objectPosition: ['G', 'P'].includes(letter) ? 'center top' : letter === 'O' ? 'center 25%' : letter === 'F' ? 'right center' : 'center' }} onError={() => setFailed(true)} draggable="false" /> : <div className="animal-picture-fallback" style={{ background: animal.bg }}>{Fallback && <Fallback color={animal.color} />}</div>}
      {showCredit && image && <figcaption><a href={image.sourceUrl} target="_blank" rel="noreferrer">{image.artist}</a> · <a href={image.licenseUrl} target="_blank" rel="noreferrer">{image.license}</a> · cropped</figcaption>}
    </figure>
  );
}
