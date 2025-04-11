import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface TrendingAnime {
	id: string
	data_id: number
	number: number
	poster: string
	title: string
	japanese_title: string
}

interface AnimeTrendingProps {
	trending: TrendingAnime[]
}

export default function AnimeTrending({ trending }: AnimeTrendingProps) {
	if (!Array.isArray(trending) || trending.length === 0) {
		return null
	}
	const port = import.meta.env.VITE_PORT
	return (
		<Carousel
			opts={{
				align: 'start',
				loop: true
			}}
			className="w-full"
		>
			<CarouselContent className="-ml-2 md:-ml-4">
				{trending.map((anime) => (
					<CarouselItem key={anime.id} className="basis-1/2 pl-2 sm:basis-1/3 md:basis-1/4 md:pl-4 lg:basis-1/5">
						<Card className="overflow-hidden border-0 bg-transparent">
							<CardContent className="group relative p-0">
								<div className="relative overflow-hidden rounded-md">
									<img
										src={`http://localhost:${port}/api/proxy?url=${anime.poster}` || '/placeholder.svg'}
										alt={anime.title}
										className="aspect-[3/4] w-full object-cover transition-transform duration-300 group-hover:scale-105"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
									<Badge className="absolute left-2 top-2 bg-purple-600">{`#${anime.number}`}</Badge>
								</div>
								<div className="mt-2">
									<h3 className="line-clamp-1 font-medium">{anime.title}</h3>
									<p className="line-clamp-1 text-xs text-gray-400">{anime.japanese_title}</p>
								</div>
							</CardContent>
						</Card>
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious className="left-0 border-gray-700 bg-black/50 hover:bg-black/70" />
			<CarouselNext className="right-0 border-gray-700 bg-black/50 hover:bg-black/70" />
		</Carousel>
	)
}
