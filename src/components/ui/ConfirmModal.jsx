import React from 'react';
import Modal from './Modal';
import Button from './Button';

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Xác nhận', 
  message, 
  confirmText = 'Xác nhận', 
  cancelText = 'Hủy',
  variant = 'accent',
  loading = false
}) {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={title} 
      maxWidth="max-w-lg" 
      padding="p-6" 
      rounded="rounded-[24px]"
    >
      <div className="space-y-6">
        <p className="text-sm text-[var(--hr-muted)] leading-relaxed">
          {message}
        </p>
        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            {cancelText}
          </Button>
          <Button 
            type="button" 
            variant={variant} 
            loading={loading} 
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
