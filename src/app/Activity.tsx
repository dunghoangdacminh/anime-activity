"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from 'lucide-react'
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

import AnimeSpotlight from "../components/AnimeSpotlight"
import AnimeTrending from "../components/AnimeTrending"
import AnimeCard from "../components/AnimeCard"
import AnimeSchedule from "../components/AnimeSchedule"
import AnimeDetailsModal from "../components/AnimeDetailsModal"
import { fetchAnimeData, searchAnime } from "../lib/api"
import SearchResults from "../components/SearchResults"

function App() {
  const [animeData, setAnimeData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchKeyword, setSearchKeyword] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)

  // State for anime details modal
  const [selectedAnimeId, setSelectedAnimeId] = useState<string | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  useEffect(() => {
    const getAnimeData = async () => {
      try {
        setLoading(true)
        const data = await fetchAnimeData()
        setAnimeData(data.results)
        setLoading(false)
      } catch (err) {
        setError("Failed to fetch anime data. Please try again later.")
        setLoading(false)
      }
    }

    getAnimeData()
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!searchKeyword.trim()) return

    try {
      setIsSearching(true)
      setSearchLoading(true)
      setSearchError(null)

      const data = await searchAnime(searchKeyword)

      // Update to handle the correct response structure
      if (data.results && data.results.data) {
        setSearchResults(data.results.data)
        setTotalPages(data.results.totalPage || 1)
      } else {
        setSearchResults([])
        setTotalPages(1)
      }

      setSearchLoading(false)
    } catch (err) {
      setSearchError("Failed to search anime. Please try again.")
      setSearchLoading(false)
    }
  }

  const closeSearch = () => {
    setIsSearching(false)
    setSearchKeyword("")
    setSearchResults([])
    setSearchError(null)
  }

  // Handle opening anime details modal
  const handleAnimeClick = (id: string) => {
    setSelectedAnimeId(id)
    setIsDetailsModalOpen(true)
  }

  // Handle closing anime details modal
  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false)
    setSelectedAnimeId(null)
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p>{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4 bg-purple-600 hover:bg-purple-700">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Anime Together</h1>
          </div>
          <div className="relative w-full max-w-sm">
            <form onSubmit={handleSearch}>
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search anime..."
                className="pl-8 bg-gray-900 border-gray-700 focus:border-purple-500"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </form>
          </div>
        </div>
      </header>

      <main className="container py-6">
        {loading ? (
          <LoadingState />
        ) : (
          <>
            {/* Spotlight Section */}
            {animeData?.spotlights && animeData.spotlights.length > 0 && (
              <section className="mb-12">
                <AnimeSpotlight 
                  spotlights={animeData.spotlights} 
                  onAnimeClick={handleAnimeClick}
                />
              </section>
            )}

            {/* Trending Section */}
            {animeData?.trending && animeData.trending.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Trending Now</h2>
                <AnimeTrending 
                  trending={animeData.trending} 
                  onAnimeClick={handleAnimeClick}
                />
              </section>
            )}

            {/* Main Content Tabs */}
            <Tabs defaultValue="popular" className="mb-12">
              <TabsList className="bg-gray-900 border border-gray-800">
                <TabsTrigger value="popular">Most Popular</TabsTrigger>
                <TabsTrigger value="airing">Top Airing</TabsTrigger>
                <TabsTrigger value="favorite">Most Favorite</TabsTrigger>
                <TabsTrigger value="completed">Latest Completed</TabsTrigger>
                <TabsTrigger value="episodes">Latest Episodes</TabsTrigger>
              </TabsList>

              <TabsContent value="popular" className="mt-6">
                <AnimeGrid animes={animeData?.mostPopular || []} onAnimeClick={handleAnimeClick} />
              </TabsContent>

              <TabsContent value="airing" className="mt-6">
                <AnimeGrid animes={animeData?.topAiring || []} onAnimeClick={handleAnimeClick} />
              </TabsContent>

              <TabsContent value="favorite" className="mt-6">
                <AnimeGrid animes={animeData?.mostFavorite || []} onAnimeClick={handleAnimeClick} />
              </TabsContent>

              <TabsContent value="completed" className="mt-6">
                <AnimeGrid animes={animeData?.latestCompleted || []} onAnimeClick={handleAnimeClick} />
              </TabsContent>

              <TabsContent value="episodes" className="mt-6">
                <AnimeGrid animes={animeData?.latestEpisode || []} onAnimeClick={handleAnimeClick} />
              </TabsContent>
            </Tabs>

            {/* Today's Schedule */}
            {animeData?.today && animeData.today.schedule && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Today's Schedule</h2>
                <AnimeSchedule 
                  schedule={animeData.today.schedule} 
                  onAnimeClick={handleAnimeClick}
                />
              </section>
            )}

            {/* Genres */}
            {animeData?.genres && Array.isArray(animeData.genres) && animeData.genres.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Genres</h2>
                <div className="flex flex-wrap gap-2">
                  {animeData.genres.map((genre: string) => (
                    <Badge key={genre} variant="outline" className="bg-gray-800 hover:bg-gray-700 cursor-pointer">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
        
        {/* Search Results */}
        {isSearching && (
          <SearchResults
            results={searchResults}
            loading={searchLoading}
            error={searchError}
            onClose={closeSearch}
            keyword={searchKeyword}
            totalPages={totalPages}
            onAnimeClick={handleAnimeClick}
          />
        )}
        
        {/* Anime Details Modal */}
        <AnimeDetailsModal
          animeId={selectedAnimeId}
          isOpen={isDetailsModalOpen}
          onClose={handleCloseDetailsModal}
        />
      </main>
    </div>
  )
}

function AnimeGrid({ animes, onAnimeClick }: { animes: any[], onAnimeClick?: (id: string) => void }) {
  if (!Array.isArray(animes) || animes.length === 0) {
    return <p className="text-gray-400">No anime found in this category.</p>
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {animes.map((anime) => (
        <AnimeCard 
          key={anime.id} 
          anime={anime} 
          onClick={onAnimeClick}
        />
      ))}
    </div>
  )
}

function LoadingState() {
  return (
    <>
      {/* Spotlight Loading */}
      <div className="mb-12 relative rounded-lg overflow-hidden">
        <Skeleton className="h-[400px] w-full bg-gray-800" />
      </div>

      {/* Trending Loading */}
      <div className="mb-12">
        <Skeleton className="h-8 w-48 mb-4 bg-gray-800" />
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-[250px] w-[180px] rounded-md bg-gray-800" />
          ))}
        </div>
      </div>

      {/* Tabs Loading */}
      <div className="mb-12">
        <Skeleton className="h-10 w-full mb-6 bg-gray-800" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <Skeleton key={i} className="h-[250px] rounded-md bg-gray-800" />
          ))}
        </div>
      </div>
    </>
  )
}

export default App
