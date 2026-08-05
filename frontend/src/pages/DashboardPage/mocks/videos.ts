// src/pages/DashboardPage/mocks/videos.ts
export interface Video {
  id: string;
  title: string;
  duration: string; // e.g. "2:15"
  thumbnail: string; // image URL
}

export const videos: Video[] = [
  {
    id: "1",
    title: "Intro to PatchFlow",
    duration: "2:15",
    thumbnail: "https://via.placeholder.com/150",
  },
  {
    id: "2",
    title: "Advanced Patch Techniques",
    duration: "4:30",
    thumbnail: "https://via.placeholder.com/150",
  },
  {
    id: "3",
    title: "Deploying with Vercel",
    duration: "3:10",
    thumbnail: "https://via.placeholder.com/150",
  },
  {
    id: "4",
    title: "State Management with Zustand",
    duration: "5:05",
    thumbnail: "https://via.placeholder.com/150",
  },
];
