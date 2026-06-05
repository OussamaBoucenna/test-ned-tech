import { Modal } from './Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  isConfirming: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Delete',
  isConfirming,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} title={title} onClose={onCancel}>
      <p className="mb-5 text-sm leading-6 text-slate-300">{message}</p>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl border border-white/12 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-100 transition hover:border-white/25 hover:bg-white/8"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(244,63,94,0.28)] transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-60"
          onClick={onConfirm}
          disabled={isConfirming}
        >
          {isConfirming ? 'Deleting...' : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
