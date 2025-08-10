const API_BASE = import.meta.env.VITE_API_URL;

export async function createCheckoutSession(payload) {
  const res = await fetch(`${API_BASE}/api/stripe/create-checkout-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || "Failed to create checkout session");
  }
  return res.json();
}
