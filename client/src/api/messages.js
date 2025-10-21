// client/src/api/messages.js
export async function fetchThread({ apiBase, me, other, before, limit }) {
  const url = new URL(`${apiBase}/api/messages/thread/${other}`);
  if (before) url.searchParams.set('before', before);
  if (limit) url.searchParams.set('limit', String(limit));
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', 'X-User-Id': me },
  });
  if (!res.ok) throw new Error('Failed to load messages');
  return res.json(); // { ok: true, messages: [...] }
}

