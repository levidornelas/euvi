import { Card, CardContent } from "../ui/card";
import { MapPin } from "lucide-react";

interface RecentItemCardProps {
    item: {
        id: string | number;
        title: string;
    };
    handlePinClick: (item: { id: string | number; title: string }) => void;
}

export default function RecentItemCard({ item, handlePinClick }: RecentItemCardProps) {
    return (
        <Card
            key={item.id}
            className="cursor-pointer hover:bg-gray-50 transition-colors border rounded-full p-1 border-gray-200"
            onClick={() => handlePinClick(item)}
        >
            <CardContent className="p-4 flex items-center gap-3">
                <MapPin className="text-blue-500 h-5 w-5 flex-shrink-0" />
                <span className="text-gray-800 font-medium">{item.title}</span>
            </CardContent>
        </Card>
    );
}