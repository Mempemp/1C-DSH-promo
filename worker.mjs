const RELEASE_URL = 'https://github.com/Mempemp/DSH-1C-deskop-bundle/releases/tag/0.9.0-2';
const redirect = () => new Response(null, { status: 303, headers: { Location: RELEASE_URL, 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' } });
export default {
 async fetch(request, env) {
  const path = new URL(request.url).pathname;
  if (path === '/go/instructions') {
   if (request.method === 'GET' || request.method === 'HEAD') return redirect();
   if (request.method !== 'POST') return new Response('Method not allowed', {status:405});
   if (!env.PAGE_ORIGIN || request.headers.get('origin') !== env.PAGE_ORIGIN) return new Response('Forbidden', {status:403});
   try {
    await env.DB.prepare('INSERT INTO instruction_clicks (day,count) VALUES (?,1) ON CONFLICT(day) DO UPDATE SET count=count+1').bind(new Date().toISOString().slice(0,10)).run();
   } catch(error) { console.error('Instruction counter write failed', error); }
   return redirect();
  }
  if (path === '/api/stats' && request.method === 'GET') {
   try {
    const total=await env.DB.prepare('SELECT COALESCE(SUM(count),0) AS total FROM instruction_clicks').first();
    const days=await env.DB.prepare('SELECT day,count FROM instruction_clicks ORDER BY day DESC LIMIT 30').all();
    return Response.json({instruction_clicks:total.total,timezone:'UTC',last_30_active_days:days.results},{headers:{'Cache-Control':'no-store'}});
   } catch(error) {console.error(error);return Response.json({error:'Статистика временно недоступна'},{status:503});}
  }
  return new Response('Not found', {status:404});
 }
};


