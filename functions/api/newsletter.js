import { handleNewsletter } from '../../server/newsletter/handler.js';
export const onRequest = ({request,env}) => handleNewsletter(request,env);
