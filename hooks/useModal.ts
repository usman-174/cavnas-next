import { useEffect } from 'react';
import { useAppStore } from '@/store';

/**
 * Generic hook for managing modal state with body scroll lock
 */
export function useModal() {
  const { activeModal, setActiveModal } = useAppStore();

  useEffect(() => {
    if (activeModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeModal]);

  const openModal = (modal: Parameters<typeof setActiveModal>[0]) => {
    setActiveModal(modal);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return {
    activeModal,
    openModal,
    closeModal,
    isOpen: activeModal !== null,
  };
}
