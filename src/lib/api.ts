export async function fetchAnimeData() {
	try {
		const response = await fetch('/api/proxy?url=https://akimiya-api-url.vercel.app/api')

		if (!response.ok) {
			throw new Error(`API request failed with status: ${response.status}`)
		}

		const data = await response.json()
		return data
	} catch (error) {
		console.error('Error fetching anime data:', error)
		throw error
	}
}

export async function searchAnime(keyword: string) {
	try {
		if (!keyword.trim()) {
			return { success: true, results: { data: [] } }
		}

		const response = await fetch(
			`/api/proxy?url=https://akimiya-api-url.vercel.app/api/search?keyword=${encodeURIComponent(keyword)}`
		)

		if (!response.ok) {
			throw new Error(`Search API request failed with status: ${response.status}`)
		}

		const data = await response.json()

		// Ensure the data structure is as expected
		if (!data.results || !data.results.data || !Array.isArray(data.results.data)) {
			return { success: true, results: { data: [] } }
		}

		return data
	} catch (error) {
		console.error('Error searching anime:', error)
		// Return empty array on error
		return { success: false, results: { data: [] } }
	}
}

// Add new function to fetch anime details by ID
export async function fetchAnimeDetails(id: string) {
	try {
		if (!id) {
			throw new Error('Anime ID is required')
		}

		const response = await fetch(
			`/api/proxy?url=https://akimiya-api-url.vercel.app/api/info?id=${encodeURIComponent(id)}`
		)

		if (!response.ok) {
			throw new Error(`Anime details API request failed with status: ${response.status}`)
		}

		const data = await response.json()

		// Ensure the data structure is as expected
		if (!data.success || !data.results || !data.results.data) {
			throw new Error('Invalid anime details data structure')
		}

		return data.results.data
	} catch (error) {
		console.error('Error fetching anime details:', error)
		throw error
	}
}
