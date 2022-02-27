import { atom } from 'recoil';

const state = atom({
  key: 'state',
  default: {
    diffuseIteration: 8.0,
    poissonIteration: 8.0,
    v: 3.0,
  },
});

export default state;
