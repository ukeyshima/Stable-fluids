import React from 'react';
import '../node_modules/react-dat-gui/dist/index.css';
import DatGui, { DatBoolean, DatColor, DatNumber, DatString } from 'react-dat-gui';
import { useRecoilState } from 'recoil';
import state from './stateManager';

export default function DatGUI() {
  const [data, setData] = useRecoilState(state);

  return (
    <DatGui
      data={data}
      onUpdate={(_data) =>
        setData(() => {
          return { ...data, ..._data };
        })
      }>
      <DatNumber path='diffuseIteration' label='diffuseIteration' min={0} max={30} step={1} />
      <DatNumber path='poissonIteration' label='poissonIteration' min={0} max={30} step={1} />
      <DatNumber path='v' label='v' min={0.0} max={10.0} step={0.1} />
    </DatGui>
  );
}
