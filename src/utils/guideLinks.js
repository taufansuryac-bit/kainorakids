import { plainClick } from './productRoutes';

export function openGuide(event, path) {
  if (!plainClick(event) || !path.startsWith('/')) return;
  event.preventDefault();
  const view=path.replace(/\/$/,'')==='/panduan-ukuran-anak'?'sizeGuide':'guide';
  history.pushState({view},'',path);
  window.dispatchEvent(new PopStateEvent('popstate',{state:{view}}));
}
