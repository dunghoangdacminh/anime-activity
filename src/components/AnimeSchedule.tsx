import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from 'lucide-react'

interface ScheduleItem {
  id: string
  data_id: number
  title: string
  japanese_title: string
  releaseDate: string
  time: string
  episode_no: number
}

interface AnimeScheduleProps {
  schedule: ScheduleItem[]
  onAnimeClick?: (id: string) => void
}

export default function AnimeSchedule({ schedule, onAnimeClick }: AnimeScheduleProps) {
  if (!Array.isArray(schedule) || schedule.length === 0) {
    return <p className="text-gray-400">No scheduled anime for today.</p>
  }

  const handleAnimeClick = (id: string) => {
    if (onAnimeClick) {
      onAnimeClick(id)
    }
  }

  return (
    <ScrollArea className="h-[300px] rounded-md border border-gray-800 bg-gray-900/50">
      <div className="p-4">
        {schedule.map((item) => (
          <Card 
            key={item.id} 
            className="mb-3 bg-gray-800/50 border-gray-700 cursor-pointer hover:bg-gray-800"
            onClick={() => handleAnimeClick(item.id)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-xs text-gray-400">{item.japanese_title}</p>
                </div>
                <Badge className="bg-purple-600">EP {item.episode_no}</Badge>
              </div>
              <div className="flex items-center mt-2 text-sm text-gray-400">
                <Clock className="h-3 w-3 mr-1" />
                <span>{item.time}</span>
                <span className="mx-2">•</span>
                <span>{item.releaseDate}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  )
}
