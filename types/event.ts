import { BilingualText } from "@/types";

export interface Event {
  id: string;
  title: BilingualText;
  date: string;
  location: BilingualText;
  description: BilingualText;
  type: "announcement" | "event" | "milestone";
  displayImage: string;
  registrationLink?: string;
  isUpcoming: boolean;
  createdAt: string;
  updatedAt: string;
}
