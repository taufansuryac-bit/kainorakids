import React from 'react';
import {renderToString} from 'react-dom/server';
import {MotionConfig} from 'motion/react';
import App from './App';
import {StoreProvider} from './context/StoreContext';
import {SizeStudioView} from './pages/SizeStudioView';
export function render(path){
  const location=new URL(path,'https://kainorakids.com');
  return renderToString(<React.StrictMode><MotionConfig reducedMotion="user"><StoreProvider initialLocation={location}><App initialLocation={location} SizeStudioComponent={SizeStudioView}/></StoreProvider></MotionConfig></React.StrictMode>);
}
