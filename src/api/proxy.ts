// proxy.ts
import { RoboRequest } from '@robojs/server'

export default async (request: RoboRequest) => {
	const targetUrl = request.query.url as string

	const res = await fetch(targetUrl, {
		headers: {
			'User-Agent': request.headers.get('user-agent') || '',
			'Accept-Encoding': 'identity'
		}
	})

	return new Response(res.body, {
		status: res.status,
		headers: {
			'Content-Type': res.headers.get('content-type') || 'application/octet-stream',
			'Cache-Control': 'public, max-age=86400' // optional cache
		}
	})
}
