import * as React from 'react';

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ open, title, description, onConfirm, onCancel }: ConfirmDialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-xs">
        <h2 className="font-bold text-lg mb-2">{title || 'Konfirmasi'}</h2>
        {description && <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">{description}</p>}
        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200" onClick={onCancel}>Batal</button>
          <button className="px-4 py-2 rounded bg-red-600 text-white" onClick={onConfirm}>Hapus</button>
        </div>
      </div>
    </div>
  );
}
