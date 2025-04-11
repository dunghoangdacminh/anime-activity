import { RoboRequest } from "@robojs/server"

export default async (request: RoboRequest) => {
	const targetUrl = request.query.url as string

	const res = await fetch(targetUrl, {
		headers: {
			// Forward essential headers only
			"User-Agent": request.headers.get("user-agent") || "",
			// Avoid sending Accept-Encoding if you can't handle compressed responses
			"Accept-Encoding": "identity"
		}
	})

	const data = await res.text()

	return new Response(data, {
		status: res.status,
		headers: {
			"Content-Type": res.headers.get("content-type") || "text/plain"
		}
	})
}
