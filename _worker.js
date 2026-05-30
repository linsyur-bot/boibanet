export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/gdrive-img') {
      const id = url.searchParams.get('id');
      if (!id) return new Response('Missing id', { status: 400 });

      const gdriveUrl = `https://drive.google.com/uc?export=view&id=${id}`;
      const response = await fetch(gdriveUrl, {
        headers: {
          'Referer': 'https://drive.google.com',
          'User-Agent': 'Mozilla/5.0'
        }
      });

      const newHeaders = new Headers(response.headers);
      newHeaders.set('Access-Control-Allow-Origin', '*');
      newHeaders.set('Cache-Control', 'public, max-age=86400');

      return new Response(response.body, {
        status: response.status,
        headers: newHeaders
      });
    }

    return env.ASSETS.fetch(request);
  }
};