import {
  LABEL_RESET_CONFIRM_MESSAGE,
  LABEL_RESET_CONFIRM_YES,
  LABEL_RESET_CONFIRM_NO,
  LABEL_RESET_CONFIRM_YES_ARIA,
  LABEL_RESET_CONFIRM_NO_ARIA,
  LABEL_RESET_DIALOG_ARIA,
} from '../utils/strings';

export interface ResetConfirmationDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ResetConfirmationDialog({
  isOpen,
  onConfirm,
  onCancel,
}: ResetConfirmationDialogProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={LABEL_RESET_DIALOG_ARIA}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div
        className="absolute inset-0 bg-black bg-opacity-40"
        aria-hidden="true"
        onClick={onCancel}
      />
      <div className="relative z-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col gap-4 min-w-[18rem] max-w-sm w-full mx-4">
        <p className="text-sm text-gray-800 dark:text-gray-200 text-center">
          {LABEL_RESET_CONFIRM_MESSAGE}
        </p>
        <div className="flex justify-center gap-3">
          <button
            type="button"
            aria-label={LABEL_RESET_CONFIRM_YES_ARIA}
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            {LABEL_RESET_CONFIRM_YES}
          </button>
          <button
            type="button"
            aria-label={LABEL_RESET_CONFIRM_NO_ARIA}
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            {LABEL_RESET_CONFIRM_NO}
          </button>
        </div>
      </div>
    </div>
  );
}
