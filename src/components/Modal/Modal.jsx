import React from 'react';
import { createPortal } from 'react-dom';

const Modal = ({ isOpen, onClose, children, type = 'edit' }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999999] animate__animated animate__fadeIn">
      <div 
        className={`bg-white rounded-lg p-6 w-full max-w-xl my-8 relative animate__animated animate__zoomIn animate__faster shadow-2xl ${
          type === 'delete' ? 'max-w-md' : ''
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-[1000001]"
        >
          ✕
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal; 