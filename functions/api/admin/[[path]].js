import { handleAdmin } from '../../../server/admin/handler.js';
export const onRequest = ({request,env}) => handleAdmin(request,env);
