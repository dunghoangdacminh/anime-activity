import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface AnimeCardProps {
  anime: {
	id: string
	data_id: number
	poster: string
	title: string
	japanese_title: string
	description?: string
	tvInfo?: {
	  showType?: string
	  duration?: string
	  releaseDate?: string
	  quality?: string
	}
  }
  onClick?: (id: string) => void
}

export default function AnimeCard({ anime, onClick }: AnimeCardProps) {
  const port = import.meta.env.VITE_PORT;
  const handleClick = () => {
	if (onClick) {
	  onClick(anime.id)
	}
  }

  return (
	<Card className="border-0 bg-transparent overflow-hidden">
	  <CardContent 
		className="p-0 relative group cursor-pointer" 
		onClick={handleClick}
	  >
		<div className="relative overflow-hidden rounded-md">
		  <img
			src={`http://localhost:${port}/api/proxy?url=${anime.poster}` || "/placeholder.svg"}
			alt={anime.title}
			className="w-full aspect-[3/4] object-cover transition-transform duration-300 group-hover:scale-105"
		  />
		  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
			{anime.tvInfo?.showType && <Badge className="self-start mb-2 bg-purple-600">{anime.tvInfo.showType}</Badge>}
			<p className="text-xs line-clamp-2 text-gray-200">{anime.description || "No description available"}</p>
		  </div>
		</div>
		<div className="mt-2">
		  <h3 className="font-medium line-clamp-1">{anime.title}</h3>
		  <p className="text-xs text-gray-400 line-clamp-1">{anime.japanese_title}</p>
		</div>
	  </CardContent>
	</Card>
  )
}
