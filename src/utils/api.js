export const apiGet = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${url} failed with status ${res.status}`);
  return res.json();
};

export const apiPost = async (url, data) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`POST ${url} failed with status ${res.status}`);
  return res.json();
};
