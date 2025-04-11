'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Info, Play } from 'lucide-react'

interface SpotlightAnime {
	id: string
	data_id: number
	poster: string
	title: string
	japanese_title: string
	description: string
	tvInfo: {
		showType: string
		duration: string
		releaseDate: string
		quality: string
	}
}

interface AnimeSpotlightProps {
	spotlights: SpotlightAnime[]
}

export default function AnimeSpotlight({ spotlights }: AnimeSpotlightProps) {
	const [currentIndex, setCurrentIndex] = useState(0)

	useEffect(() => {
		if (!Array.isArray(spotlights) || spotlights.length === 0) return

		const interval = setInterval(() => {
			setCurrentIndex((prevIndex) => (prevIndex + 1) % spotlights.length)
		}, 8000)

		return () => clearInterval(interval)
	}, [spotlights])

	const handlePrev = () => {
		setCurrentIndex((prevIndex) => (prevIndex - 1 + spotlights.length) % spotlights.length)
	}

	const handleNext = () => {
		setCurrentIndex((prevIndex) => (prevIndex + 1) % spotlights.length)
	}
	const port = import.meta.env.VITE_PORT
	if (!spotlights || spotlights.length === 0) {
		return null
	}

	const currentSpotlight = spotlights[currentIndex]

	return (
		<div className="relative h-[400px] overflow-hidden rounded-lg md:h-[500px]">
			{/* Background Image with Gradient Overlay */}
			<div
				className="absolute inset-0 bg-cover bg-center"
				style={{
					backgroundImage: `url(http://localhost:${port}/api/proxy?url=${currentSpotlight.poster})`,
					backgroundPosition: 'center 20%'
				}}
			>
				<div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
			</div>

			{/* Content */}
			<div className="relative flex h-full max-w-3xl flex-col justify-end p-6 md:p-10">
				<h2 className="mb-2 text-3xl font-bold md:text-4xl">{currentSpotlight.title}</h2>
				<p className="mb-2 text-sm text-gray-300">{currentSpotlight.japanese_title}</p>

				<div className="mb-4 flex gap-4 text-sm">
					<span>{currentSpotlight.tvInfo.showType}</span>
					<span>{currentSpotlight.tvInfo.duration}</span>
					<span>{currentSpotlight.tvInfo.releaseDate}</span>
					<span>{currentSpotlight.tvInfo.quality}</span>
				</div>

				<p className="mb-6 line-clamp-3 text-sm text-gray-300">{currentSpotlight.description}</p>

				<div className="flex gap-4">
					<Button className="bg-purple-600 hover:bg-purple-700">
						<Play className="mr-2 h-4 w-4" /> Watch Now
					</Button>
					<Button variant="outline" className="border-gray-600">
						<Info className="mr-2 h-4 w-4" /> Details
					</Button>
				</div>
			</div>

			{/* Navigation Buttons */}
			<Button
				variant="ghost"
				size="icon"
				className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/30 hover:bg-black/50"
				onClick={handlePrev}
			>
				<ChevronLeft className="h-6 w-6" />
			</Button>

			<Button
				variant="ghost"
				size="icon"
				className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/30 hover:bg-black/50"
				onClick={handleNext}
			>
				<ChevronRight className="h-6 w-6" />
			</Button>

			{/* Indicators */}
			<div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
				{Array.isArray(spotlights) &&
					spotlights.map((_, index) => (
						<button
							key={index}
							className={`h-2 w-2 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-white/30'}`}
							onClick={() => setCurrentIndex(index)}
						/>
					))}
			</div>
		</div>
	)
}
