import Link from "next/link";

type PreferenceConflictDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function PreferenceConflictDialog({ open, onClose, onConfirm }: PreferenceConflictDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-xl border-2 border-black bg-card p-5 shadow-[var(--shadow-comic)]"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 className="text-base font-black">설정 충돌 감지</h3>
        <p className="mt-2 text-sm font-semibold text-muted-foreground">
          다른 화면에서 같은 설정이 먼저 바뀌었어. 최신 설정을 확인하고 다시 저장할지 선택해.
        </p>

        <div className="mt-4 flex flex-col justify-end gap-2 sm:flex-row">
          <button
            type="button"
            className="h-11 w-full cursor-pointer rounded-md border-2 border-black bg-background px-4 text-sm font-extrabold hover:-translate-y-0.5 sm:w-auto"
            onClick={onClose}
          >
            취소
          </button>
          <button
            type="button"
            className="h-11 w-full cursor-pointer rounded-md border-2 border-black bg-[hsl(var(--primary))] px-4 text-sm font-extrabold text-primary-foreground hover:-translate-y-0.5 sm:w-auto"
            onClick={onConfirm}
          >
            다시 저장
          </button>
        </div>

        <div className="mt-3 text-right">
          <Link href="/" className="text-xs font-bold underline underline-offset-2">
            대시보드로 이동
          </Link>
        </div>
      </div>
    </div>
  );
}
