"use client";

export function LoadingModal({ show, message }: { show: boolean; message?: string }) {
  if (!show) return null;
  return (
    <div className="modal" aria-hidden={!show}>
      <div className="modal-card" role="alertdialog" aria-modal="true" aria-live="assertive" aria-label="処理中">
        <p style={{ margin: 0 }}>{message || "処理中..."}</p>
      </div>
    </div>
  );
}
