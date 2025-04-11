import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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
	const port = import.meta.env.VITE_PORT
	const handleClick = () => {
		if (onClick) {
			onClick(anime.id)
		}
	}

	return (
		<Card className="overflow-hidden border-0 bg-transparent">
			<CardContent className="group relative cursor-pointer p-0" onClick={handleClick}>
				<div className="relative overflow-hidden rounded-md">
					<img
						src={`http://localhost:${port}/api/proxy?url=${anime.poster}` || '/placeholder.svg'}
						alt={anime.title}
						className="aspect-[3/4] w-full object-cover transition-transform duration-300 group-hover:scale-105"
					/>
					<div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
						{anime.tvInfo?.showType && <Badge className="mb-2 self-start bg-purple-600">{anime.tvInfo.showType}</Badge>}
						<p className="line-clamp-2 text-xs text-gray-200">{anime.description || 'No description available'}</p>
					</div>
				</div>
				<div className="mt-2">
					<h3 className="line-clamp-1 font-medium">{anime.title}</h3>
					<p className="line-clamp-1 text-xs text-gray-400">{anime.japanese_title}</p>
				</div>
			</CardContent>
		</Card>
	)
}
