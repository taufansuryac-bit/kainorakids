// Public storefront constants: importing a contact link must not initialize Firebase.
export const ADMIN_EMAIL = import.meta.env?.VITE_ADMIN_EMAIL || 'kainorakids@gmail.com';
// Official Kainora WhatsApp (0815-9977-430). Kept in code, not env, so a missing
// build variable can never ship a placeholder number to checkout.
export const WA_NUMBER = '628159977430';
export const WA_PHONE_E164 = '+628159977430';
