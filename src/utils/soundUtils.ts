/* eslint-disable react-hooks/rules-of-hooks */
import startSound from '../assets/sfx/start.wav';
import validSound from '../assets/sfx/valid.wav';
import flipSound from '../assets/sfx/flip.wav';
import invalidSound from '../assets/sfx/invalid.wav';
import useSound from 'use-sound';

const [playStart] = useSound(startSound);
const [playValid] = useSound(validSound);
const [playFlip] = useSound(flipSound);
const [playInvalid] = useSound(invalidSound);

export { playStart, playValid, playFlip, playInvalid };