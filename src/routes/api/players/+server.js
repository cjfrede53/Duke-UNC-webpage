import players from '$lib/data/players.json';

export function GET({ url }) {
  const team = url.searchParams.get('team');

  const filtered = players.filter(p => !team || p.team === team);

  return new Response(JSON.stringify(filtered), {
    headers: { 'Content-Type': 'application/json' }
  });
}