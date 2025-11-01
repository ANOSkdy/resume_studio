"use client";

export function LoadingModal({ show, message }: { show: boolean; message?: string }) {
  if (!show) return null;
  return (
    <div role="dialog" aria-modal="true" className="modal">
      <div className="modal-card">
        <p style={{ margin: 0 }}>{message || "処理中..."}</p>
      </div>
    </div>
  );
}
