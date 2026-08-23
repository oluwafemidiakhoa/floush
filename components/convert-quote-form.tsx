"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ConvertQuoteForm({ quoteId }: { quoteId: string }) {
  const router = useRouter();
  const [rate, setRate] = useState("");
  const [loadedMiles, setLoadedMiles] = useState("");
  const [deadheadMiles, setDeadheadMiles] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`/api/ops/quotes/${quoteId}/convert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rate, loadedMiles, deadheadMiles }),
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.error || "Unable to create load.");

      setMessage(`Load ${result.loadNumber} created successfully.`);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to create load.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="ops-form" onSubmit={submit}>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="rate">Agreed rate ($)</label>
          <input id="rate" type="number" min="0.01" step="0.01" required value={rate} onChange={(e) => setRate(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="loadedMiles">Loaded miles</label>
          <input id="loadedMiles" type="number" min="0" step="0.1" value={loadedMiles} onChange={(e) => setLoadedMiles(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="deadheadMiles">Deadhead miles</label>
          <input id="deadheadMiles" type="number" min="0" step="0.1" value={deadheadMiles} onChange={(e) => setDeadheadMiles(e.target.value)} />
        </div>
      </div>
      <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? "Creating load..." : "Convert to Load"}</button>
      {message ? <p className="form-message success">{message}</p> : null}
    </form>
  );
}
