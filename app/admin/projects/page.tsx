import { getProjects } from "@/lib/projects";
import ProjectsClientPage from "./ProjectsClientPage";
import { Suspense } from "react";

function normalizeProject(project: any) {
  return {
    id: project.id ?? "",
    slug: project.slug ?? "",
    name: project.name ?? { en: "", bn: "" },
    location: project.location ?? { en: "", bn: "" },
    address: project.address ?? { en: "", bn: "" },
    coordinates: project.coordinates ?? { lat: 0, lng: 0 },
    status: project.status ?? "upcoming",
    description: project.description ?? { en: "", bn: "" },
    longDescription: project.longDescription ?? { en: "", bn: "" },
    image: project.image ?? "",
    gallery: project.gallery ?? [],
    completionDate: project.completionDate ?? "",
    progressPercent: project.progressPercent ?? 0,
    flats: project.flats ?? 0,
    floors: project.floors ?? 0,
    specifications: project.specifications ?? {
      totalAreaSqft: 0,
      bedrooms: 0,
      bathrooms: 0,
      parkingSpaces: 0,
      yearBuilt: 0,
    },
    amenities: project.amenities ?? {
      interior: [],
      exterior: [],
      building: [],
    },
    financials: project.financials ?? {
      sharePrice: 0,
      pricePerSqft: 0,
      currency: "BDT",
      expectedROI: 0,
    },
    nearbyPlaces: project.nearbyPlaces ?? [],
  };
}

export default async function AdminProjectsPage() {
  const projectsData = await getProjects();
  const projects = projectsData.map(normalizeProject);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProjectsClientPage projects={projects} />
    </Suspense>
  );
}

