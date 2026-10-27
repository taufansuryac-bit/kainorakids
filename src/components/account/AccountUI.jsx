import { useId } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, X } from 'lucide-react';
import { useDialog } from '../fashion/hooks';
import { useMotionPreference } from '../fashion/useMotionPreference';
import './account.css';

export function AccountButton({ children, secondary = false, className = '', ...props }) {
  return <button type="button" className={`ka-button ${secondary ? 'is-secondary' : ''} ${className}`} {...props}>{children}</button>;
}
export function AccountHeading({ eyebrow, title, description, children }) {
  return <header className="ka-heading"><div><span className="ka-kicker">{eyebrow}</span><h1>{title}</h1>{description && <p>{description}</p>}</div>{children}</header>;
}
export function AccountEmpty({ icon: Icon, title, description, action, onAction, secondary, onSecondary }) {
  return <div className="ka-empty"><div className="ka-empty-orbit"><Icon size={38} strokeWidth={1.3}/><i/><i/></div><h2>{title}</h2><p>{description}</p><div><AccountButton onClick={onAction}>{action}<ArrowUpRight size={18}/></AccountButton>{secondary && <AccountButton secondary onClick={onSecondary}>{secondary}</AccountButton>}</div></div>;
}
export function AccountField({ label, hint, suffix, multiline = false, ...props }) {
  const generated = useId(), id = props.id || generated;
  const Input = multiline ? 'textarea' : 'input';
  return <div className="ka-field"><label htmlFor={id}>{label}</label><div className={`ka-input-box ${suffix ? 'has-suffix' : ''}`}><Input {...props} id={id} aria-describedby={hint ? `${id}-hint` : undefined}/>{suffix}</div>{hint && <small id={`${id}-hint`}>{hint}</small>}</div>;
}
export function AccountDialog({ open, close, title, label, className = '', children }) {
  const dialog = useDialog(open, close), reduce = useMotionPreference(), id = useId();
  return createPortal(<div className="ka-root"><AnimatePresence>{open && <motion.div className="ka-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : .2 }} onClick={close}><motion.section ref={dialog} role="dialog" aria-modal="true" aria-label={label || title} aria-labelledby={title ? id : undefined} className={`ka-dialog ${className}`} initial={reduce ? false : { y: 28, scale: .96 }} animate={{ y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: .98 }} transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 270, damping: 30 }} onClick={event => event.stopPropagation()}><button type="button" className="ka-close" aria-label="Tutup jendela" onClick={close}><X size={21}/></button>{title && <h2 id={id}>{title}</h2>}{children}</motion.section></motion.div>}</AnimatePresence></div>, document.body);
}
