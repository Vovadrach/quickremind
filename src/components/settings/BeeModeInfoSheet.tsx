import { BottomSheet } from '@/components/ui/Modal';
import { useI18n } from '@/hooks/useI18n';

interface BeeModeInfoSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BeeModeInfoSheet({ isOpen, onClose }: BeeModeInfoSheetProps) {
  const { copy } = useI18n();

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={copy.beeMode.infoTitle}>
      <div className="p-4">
        <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-line">
          {copy.beeMode.infoBody}
        </p>
      </div>
    </BottomSheet>
  );
}
