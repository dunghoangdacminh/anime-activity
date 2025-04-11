"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { X, Play, Star, Calendar, Clock, Info } from 'lucide-react'
import { fetchAnimeDetails } from "@/lib/api"

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
	"MAL Score": string
	Genres: string[]
	Studios: string
	Producers: string[]
  }
}

export default function AnimeDetailsModal({ animeId, isOpen, onClose }: AnimeDetailsModalProps) {
  const port = import.meta.env.VITE_PORT;
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
		  setError("Failed to load anime details. Please try again.")
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
	  <DialogContent className="sm:max-w-[900px] bg-gray-900 text-white border-gray-800 p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
		{loading ? (
		  <div className="p-6">
			<div className="flex gap-6">
			  <Skeleton className="h-[300px] w-[200px] rounded-md bg-gray-800" />
			  <div className="flex-1">
				<Skeleton className="h-8 w-3/4 mb-4 bg-gray-800" />
				<Skeleton className="h-4 w-1/2 mb-6 bg-gray-800" />
				<Skeleton className="h-4 w-full mb-2 bg-gray-800" />
				<Skeleton className="h-4 w-full mb-2 bg-gray-800" />
				<Skeleton className="h-4 w-3/4 mb-6 bg-gray-800" />
				<div className="flex gap-2 mb-4">
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
			<div className="mt-4 p-4 bg-red-900/30 border border-red-800 rounded-md">
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
				className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 rounded-full"
			  >
				<X className="h-5 w-5" />
			  </Button>

			  <div className="flex flex-col md:flex-row gap-6 p-6">
				{/* Poster */}
				<div className="w-full md:w-[200px] flex-shrink-0">
				  <img
					src={`http://localhost:${port}/api/proxy?url=${animeDetails.poster}` || "/placeholder.svg"}
					alt={animeDetails.title}
					className="w-full md:w-[200px] h-auto rounded-md object-cover shadow-lg"
				  />
				</div>

				{/* Basic Info */}
				<div className="flex-1">
				  <h2 className="text-2xl font-bold mb-1">{animeDetails.title}</h2>
				  <p className="text-sm text-gray-400 mb-4">{animeDetails.japanese_title}</p>

				  {/* Overview */}
				  <div className="mb-4">
					<p className="text-sm text-gray-300 line-clamp-4">{animeDetails.animeInfo.Overview}</p>
				  </div>

				  {/* Quick Info */}
				  <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4 mb-4">
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
					{animeDetails.animeInfo["MAL Score"] && (
					  <div className="flex items-center gap-2">
						<Star className="h-4 w-4 text-yellow-400" />
						<span className="text-sm">{animeDetails.animeInfo["MAL Score"]}</span>
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
				  <div className="flex gap-3 mt-4">
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
			<div className="p-6 pt-0 border-t border-gray-800 mt-4">
			  <h3 className="text-lg font-semibold mb-4">Details</h3>
			  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{animeDetails.animeInfo.Studios && (
				  <div>
					<span className="text-gray-400 text-sm">Studios:</span>
					<p className="text-sm">{animeDetails.animeInfo.Studios}</p>
				  </div>
				)}
				{animeDetails.animeInfo.Producers && Array.isArray(animeDetails.animeInfo.Producers) && (
				  <div>
					<span className="text-gray-400 text-sm">Producers:</span>
					<p className="text-sm">{animeDetails.animeInfo.Producers.join(", ")}</p>
				  </div>
				)}
				{animeDetails.animeInfo.Premiered && (
				  <div>
					<span className="text-gray-400 text-sm">Premiered:</span>
					<p className="text-sm">{animeDetails.animeInfo.Premiered}</p>
				  </div>
				)}
				{animeDetails.animeInfo.Synonyms && (
				  <div>
					<span className="text-gray-400 text-sm">Also Known As:</span>
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
