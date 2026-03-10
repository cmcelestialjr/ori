import { SDGMapping, AgendaMapping } from "../../shared/types/types";

interface CardProps {
  card: SDGMapping | AgendaMapping;
  onClick?: () => void;
  className?: string;
}

/**
 * UPDATED: Robust Helper for Faculty Side
 * This version is more resilient to different path formats from the DB.
 */
const getImageUrl = (path: string | null | undefined) => {
  if (!path) return "https://via.placeholder.com/150";
  
  // 1. If it's a full URL string
  if (path.startsWith("http")) {
      // Force port 8000 if it's pointing to localhost/127.0.0.1 without the port
      if (path.includes("localhost") || path.includes("127.0.0.1")) {
         // This regex finds 'localhost' or '127.0.0.1' and ensures it's followed by :8000
         return path.replace(/http:\/\/(localhost|127\.0\.0\.1)(:\d+)?/, "http://localhost:8000");
      }
      return path;
  }

  // 2. Handle relative paths (e.g., "/storage/img.png" or "img.png")
  // Remove leading slash if it exists
  let cleanPath = path.startsWith('/') ? path.substring(1) : path;
  
  // If the path already includes 'storage/', don't add it again
  if (cleanPath.startsWith('storage/')) {
      return `http://localhost:8000/${cleanPath}`;
  }

  // Otherwise, add the full local storage prefix
  return `http://localhost:8000/storage/${cleanPath}`; 
};

export const Card = ({ card, onClick, className }: CardProps) => {
  return (
    <div
      onClick={onClick}
      className={`flex h-[19rem] min-w-40 flex-col items-center justify-center rounded-md border bg-white shadow-sm transition-all hover:shadow-md ${className}`}
    >
      <div className="h-40 w-full overflow-hidden p-2">
        <img
          src={getImageUrl(card.image_path)}
          alt={card.name}
          className="h-full w-full object-contain"
          loading="lazy"
          onError={(e) => {
            // Fallback if the image is physically missing from the server
            e.currentTarget.src = "https://via.placeholder.com/150?text=Image+Missing";
          }}
        />
      </div>
      <div className="flex flex-1 items-center justify-center p-3 text-center">
        <p className="text-sm font-semibold text-gray-700">{card.name}</p>
      </div>
    </div>
  );
};