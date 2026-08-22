"use client";

import { FormEvent, useState } from "react";

type FormState = "idle" | "submitting" | "success" | "error";

export default function QuoteForm() {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to submit quote request.");

      form.reset();
      setState("success");
      setMessage("Thank you. Your quote request has been received. Floush Logistics will follow up with you shortly.");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Unable to submit quote request.");
    }
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="field"><label htmlFor="company">Company</label><input id="company" name="company" required placeholder="Your company" autoComplete="organization" /></div>
        <div className="field"><label htmlFor="contact">Contact name</label><input id="contact" name="contact" required placeholder="Full name" autoComplete="name" /></div>
        <div className="field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" required placeholder="you@company.com" autoComplete="email" /></div>
        <div className="field"><label htmlFor="phone">Phone</label><input id="phone" name="phone" type="tel" required placeholder="Business phone" autoComplete="tel" /></div>
        <div className="field"><label htmlFor="pickup">Pickup</label><input id="pickup" name="pickup" required placeholder="City, State" /></div>
        <div className="field"><label htmlFor="delivery">Delivery</label><input id="delivery" name="delivery" required placeholder="City, State" /></div>
        <div className="field"><label htmlFor="pickupDate">Pickup date</label><input id="pickupDate" name="pickupDate" type="date" required /></div>
        <div className="field"><label htmlFor="equipment">Equipment</label><select id="equipment" name="equipment" required defaultValue=""><option value="" disabled>Select equipment</option><option>Dry Van</option><option>Reefer</option><option>Flatbed</option><option>Other / Not sure</option></select></div>
        <div className="field full"><label htmlFor="details">Freight details</label><textarea id="details" name="details" required placeholder="Commodity, weight, dimensions, special requirements, delivery date, and any other details" /></div>
        <div className="field full">
          <button className="btn btn-primary submit-btn" type="submit" disabled={state === "submitting"}>
            {state === "submitting" ? "Submitting…" : "Submit Quote Request"}
          </button>
          {message && <div className={`form-message ${state}`} role="status" aria-live="polite">{message}</div>}
        </div>
      </div>
    </form>
  );
}
