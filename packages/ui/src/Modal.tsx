import type { ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal = ({ open, onClose, children }: ModalProps) => {
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true">
      <div onClick={onClose} aria-hidden="true" />
      <div>{children}</div>
    </div>
  );
};

export default Modal;
