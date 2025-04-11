'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { X, Play, Star, Calendar, Clock, Info } from 'lucide-react'
import { fetchAnimeDetails } from '@/lib/api'

interface AnimeDetailsModalProps {
	animeId: string | null
	isOpen: boolean
	onClose: () => void
}

interface AnimeDetails {
	adultContent: boolean
	id: string
	data_id: number
	title: string
	japanese_title: string
	poster: string
	showType: string
	animeInfo: {
		Overview: string
		Japanese: string
		Synonyms: string
		Aired: string
		Premiered: string
		Duration: string
		Status: string
		'MAL Score': string
		Genres: string[]
		Studios: string
		Producers: string[]
	}
}

export default function AnimeDetailsModal({ animeId, isOpen, onClose }: AnimeDetailsModalProps) {
	const port = import.meta.env.VITE_PORT
	const [animeDetails, setAnimeDetails] = useState<AnimeDetails | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (isOpen && animeId) {
			const getAnimeDetails = async () => {
				try {
					setLoading(true)
					setError(null)
					const data = await fetchAnimeDetails(animeId)
					setAnimeDetails(data)
					setLoading(false)
				} catch (err) {
					setError('Failed to load anime details. Please try again.')
					setLoading(false)
				}
			}

			getAnimeDetails()
		} else {
			// Reset state when modal is closed
			setAnimeDetails(null)
			setError(null)
		}
	}, [animeId, isOpen])

	// Handle closing the modal
	const handleClose = () => {
		onClose()
	}

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
			<DialogContent className="max-h-[90vh] overflow-hidden overflow-y-auto border-gray-800 bg-gray-900 p-0 text-white sm:max-w-[900px]">
				{loading ? (
					<div className="p-6">
						<div className="flex gap-6">
							<Skeleton className="h-[300px] w-[200px] rounded-md bg-gray-800" />
							<div className="flex-1">
								<Skeleton className="mb-4 h-8 w-3/4 bg-gray-800" />
								<Skeleton className="mb-6 h-4 w-1/2 bg-gray-800" />
								<Skeleton className="mb-2 h-4 w-full bg-gray-800" />
								<Skeleton className="mb-2 h-4 w-full bg-gray-800" />
								<Skeleton className="mb-6 h-4 w-3/4 bg-gray-800" />
								<div className="mb-4 flex gap-2">
									<Skeleton className="h-8 w-24 rounded-full bg-gray-800" />
									<Skeleton className="h-8 w-24 rounded-full bg-gray-800" />
								</div>
							</div>
						</div>
					</div>
				) : error ? (
					<div className="p-6">
						<DialogHeader>
							<DialogTitle className="text-xl font-bold">Error</DialogTitle>
						</DialogHeader>
						<div className="mt-4 rounded-md border border-red-800 bg-red-900/30 p-4">
							<p>{error}</p>
						</div>
						<div className="mt-4 flex justify-end">
							<Button onClick={handleClose} variant="outline" className="border-gray-700">
								Close
							</Button>
						</div>
					</div>
				) : animeDetails ? (
					<>
						{/* Banner/Header with poster and basic info */}
						<div className="relative">
							{/* Close button */}
							<Button
								variant="ghost"
								size="icon"
								onClick={handleClose}
								className="absolute right-2 top-2 z-10 rounded-full bg-black/50 hover:bg-black/70"
							>
								<X className="h-5 w-5" />
							</Button>

							<div className="flex flex-col gap-6 p-6 md:flex-row">
								{/* Poster */}
								<div className="w-full flex-shrink-0 md:w-[200px]">
									<img
										src={`http://localhost:${port}/api/proxy?url=${animeDetails.poster}` || '/placeholder.svg'}
										alt={animeDetails.title}
										className="h-auto w-full rounded-md object-cover shadow-lg md:w-[200px]"
									/>
								</div>

								{/* Basic Info */}
								<div className="flex-1">
									<h2 className="mb-1 text-2xl font-bold">{animeDetails.title}</h2>
									<p className="mb-4 text-sm text-gray-400">{animeDetails.japanese_title}</p>

									{/* Overview */}
									<div className="mb-4">
										<p className="line-clamp-4 text-sm text-gray-300">{animeDetails.animeInfo.Overview}</p>
									</div>

									{/* Quick Info */}
									<div className="mb-4 grid grid-cols-2 gap-x-4 gap-y-2 md:grid-cols-3">
										{animeDetails.showType && (
											<div className="flex items-center gap-2">
												<Info className="h-4 w-4 text-purple-400" />
												<span className="text-sm">{animeDetails.showType}</span>
											</div>
										)}
										{animeDetails.animeInfo.Status && (
											<div className="flex items-center gap-2">
												<span className="h-2 w-2 rounded-full bg-green-500"></span>
												<span className="text-sm">{animeDetails.animeInfo.Status}</span>
											</div>
										)}
										{animeDetails.animeInfo['MAL Score'] && (
											<div className="flex items-center gap-2">
												<Star className="h-4 w-4 text-yellow-400" />
												<span className="text-sm">{animeDetails.animeInfo['MAL Score']}</span>
											</div>
										)}
										{animeDetails.animeInfo.Aired && (
											<div className="flex items-center gap-2">
												<Calendar className="h-4 w-4 text-blue-400" />
												<span className="text-sm">{animeDetails.animeInfo.Aired}</span>
											</div>
										)}
										{animeDetails.animeInfo.Duration && (
											<div className="flex items-center gap-2">
												<Clock className="h-4 w-4 text-pink-400" />
												<span className="text-sm">{animeDetails.animeInfo.Duration}</span>
											</div>
										)}
									</div>

									{/* Genres */}
									{animeDetails.animeInfo.Genres && Array.isArray(animeDetails.animeInfo.Genres) && (
										<div className="mb-4">
											<div className="flex flex-wrap gap-2">
												{animeDetails.animeInfo.Genres.map((genre, index) => (
													<Badge key={index} className="bg-purple-600 hover:bg-purple-700">
														{genre}
													</Badge>
												))}
											</div>
										</div>
									)}

									{/* Action Buttons */}
									<div className="mt-4 flex gap-3">
										<Button className="bg-purple-600 hover:bg-purple-700">
											<Play className="mr-2 h-4 w-4" /> Watch Now
										</Button>
										<Button variant="outline" className="border-gray-700">
											+ Add to List
										</Button>
									</div>
								</div>
							</div>
						</div>

						{/* Additional Details */}
						<div className="mt-4 border-t border-gray-800 p-6 pt-0">
							<h3 className="mb-4 text-lg font-semibold">Details</h3>
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								{animeDetails.animeInfo.Studios && (
									<div>
										<span className="text-sm text-gray-400">Studios:</span>
										<p className="text-sm">{animeDetails.animeInfo.Studios}</p>
									</div>
								)}
								{animeDetails.animeInfo.Producers && Array.isArray(animeDetails.animeInfo.Producers) && (
									<div>
										<span className="text-sm text-gray-400">Producers:</span>
										<p className="text-sm">{animeDetails.animeInfo.Producers.join(', ')}</p>
									</div>
								)}
								{animeDetails.animeInfo.Premiered && (
									<div>
										<span className="text-sm text-gray-400">Premiered:</span>
										<p className="text-sm">{animeDetails.animeInfo.Premiered}</p>
									</div>
								)}
								{animeDetails.animeInfo.Synonyms && (
									<div>
										<span className="text-sm text-gray-400">Also Known As:</span>
										<p className="text-sm">{animeDetails.animeInfo.Synonyms}</p>
									</div>
								)}
							</div>
						</div>
					</>
				) : null}
			</DialogContent>
		</Dialog>
	)
}
