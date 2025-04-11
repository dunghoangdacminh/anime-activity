'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface SearchResultsProps {
	results: any[]
	loading: boolean
	error: string | null
	onClose: () => void
	keyword: string
	totalPages: number
	onAnimeClick?: (id: string) => void
}

export default function SearchResults({
	results,
	loading,
	error,
	onClose,
	keyword,
	totalPages,
	onAnimeClick
}: SearchResultsProps) {
	const port = import.meta.env.VITE_PORT
	const [currentPage, setCurrentPage] = useState(1)

	const handleAnimeClick = (id: string) => {
		if (onAnimeClick) {
			onAnimeClick(id)
			onClose() // Close search results when an anime is clicked
		}
	}

	if (loading) {
		return (
			<div className="fixed inset-0 z-50 overflow-y-auto bg-black/95 p-4 pt-20">
				<div className="container mx-auto">
					<div className="mb-6 flex items-center justify-between">
						<h2 className="text-xl font-bold">Searching for "{keyword}"...</h2>
						<Button variant="ghost" size="icon" onClick={onClose}>
							<X className="h-5 w-5" />
						</Button>
					</div>
					<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
						{[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
							<Skeleton key={i} className="h-[250px] rounded-md bg-gray-800" />
						))}
					</div>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="fixed inset-0 z-50 overflow-y-auto bg-black/95 p-4 pt-20">
				<div className="container mx-auto">
					<div className="mb-6 flex items-center justify-between">
						<h2 className="text-xl font-bold">Search Error</h2>
						<Button variant="ghost" size="icon" onClick={onClose}>
							<X className="h-5 w-5" />
						</Button>
					</div>
					<div className="rounded-md border border-red-800 bg-red-900/30 p-4">
						<p>{error}</p>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="fixed inset-0 z-50 overflow-y-auto bg-black/95 p-4 pt-20">
			<div className="container mx-auto">
				<div className="mb-6 flex items-center justify-between">
					<h2 className="text-xl font-bold">
						Search Results for "{keyword}" ({Array.isArray(results) ? results.length : 0})
						{totalPages > 1 && ` - Page ${currentPage}/${totalPages}`}
					</h2>
					<Button variant="ghost" size="icon" onClick={onClose}>
						<X className="h-5 w-5" />
					</Button>
				</div>

				{!Array.isArray(results) || results.length === 0 ? (
					<div className="py-12 text-center">
						<p className="mb-4 text-gray-400">No results found for "{keyword}"</p>
						<Button onClick={onClose} variant="outline">
							Return to Homepage
						</Button>
					</div>
				) : (
					<>
						<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
							{results.map((anime) => (
								<Card
									key={anime.id}
									className="overflow-hidden border-0 bg-transparent"
									onClick={() => handleAnimeClick(anime.id)}
								>
									<CardContent className="group relative cursor-pointer p-0">
										<div className="relative overflow-hidden rounded-md">
											<img
												src={`http://localhost:${port}/api/proxy?url=${anime.poster}` || '/placeholder.svg'}
												alt={anime.title}
												className="aspect-[3/4] w-full object-cover transition-transform duration-300 group-hover:scale-105"
											/>
											<div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
												{anime.tvInfo?.showType && (
													<Badge className="mb-2 self-start bg-purple-600">{anime.tvInfo.showType}</Badge>
												)}
												{anime.duration && <span className="text-xs text-white/80">{anime.duration}</span>}
											</div>
										</div>
										<div className="mt-2">
											<h3 className="line-clamp-1 font-medium">{anime.title}</h3>
											<p className="line-clamp-1 text-xs text-gray-400">{anime.japanese_title}</p>
										</div>
									</CardContent>
								</Card>
							))}
						</div>

						{totalPages > 1 && (
							<div className="mt-8 flex justify-center gap-2">
								<Button
									variant="outline"
									size="icon"
									disabled={currentPage === 1}
									onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
								>
									<ChevronLeft className="h-4 w-4" />
								</Button>
								<div className="flex items-center gap-1">
									{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
										<Button
											key={page}
											variant={currentPage === page ? 'default' : 'outline'}
											size="sm"
											onClick={() => setCurrentPage(page)}
											className={currentPage === page ? 'bg-purple-600' : ''}
										>
											{page}
										</Button>
									))}
								</div>
								<Button
									variant="outline"
									size="icon"
									disabled={currentPage === totalPages}
									onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
								>
									<ChevronRight className="h-4 w-4" />
								</Button>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	)
}
