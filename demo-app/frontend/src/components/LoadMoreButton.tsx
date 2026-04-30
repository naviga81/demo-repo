import { LABEL_LOAD_MORE, LABEL_LOAD_MORE_ARIA } from '../utils/strings';

export interface LoadMoreButtonProps {
  onClick: () => void;
  visible: boolean;
}

export function LoadMoreButton({ onClick, visible }: LoadMoreButtonProps) {
  if (!visible) {
    return null;
  }

  return (
    <div className="flex justify-center mt-6">
      <button
        aria-label={LABEL_LOAD_MORE_ARIA}
        onClick={onClick}
        className="px-6 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
      >
        {LABEL_LOAD_MORE}
      </button>
    </div>
  );
}
