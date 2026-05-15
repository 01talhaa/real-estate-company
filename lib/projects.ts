import dbConnect from './mongoose';
import ProjectModel from './models/ProjectModel';
import { apiCache, CacheTTL, withCache } from './cache';
import { revalidateTag, unstable_cache } from 'next/cache';
import { Project } from '@/types/project';

const PROJECTS_CACHE_KEY = 'projects:all';

function clearProjectCaches(project: { id?: string; slug?: string } | null) {
  apiCache.delete(PROJECTS_CACHE_KEY);
  if (!project) return;
  if (project.id) apiCache.delete(`projects:${project.id}`);
  if (project.slug) apiCache.delete(`projects:${project.slug}`);
}

function serializeProject(doc: any): Project {
  const obj = doc.toObject ? doc.toObject() : doc;
  if (obj._id) delete obj._id;
  if (obj.__v !== undefined) delete obj.__v;
  return obj as Project;
}

export async function getProjects(): Promise<Project[]> {
  await dbConnect();
  try {
    return await withCache(
      PROJECTS_CACHE_KEY,
      async () => {
        const projects = await ProjectModel.find().lean();
        return projects.map((p: any) => {
          if (p._id) delete p._id;
          if (p.__v !== undefined) delete p.__v;
          return p as Project;
        });
      },
      CacheTTL.MEDIUM
    );
  } catch (error) {
    console.error('Error fetching projects from MongoDB:', error);
    return [];
  }
}

export async function getProjectById(idOrSlug: string): Promise<Project | null> {
  await dbConnect();
  return withCache(
    `projects:${idOrSlug}`,
    async () => {
      const project = await ProjectModel.findOne({
        $or: [{ id: idOrSlug }, { slug: idOrSlug }],
      }).lean();
      if (!project) return null;
      if (project._id) delete project._id;
      if (project.__v !== undefined) delete project.__v;
      return project as Project;
    },
    CacheTTL.MEDIUM
  );
}

export const getProjectsCached = unstable_cache(
  async () => getProjects(),
  ["projects:all"],
  { revalidate: 60, tags: ["projects"] }
);

export async function getProjectByIdCached(idOrSlug: string): Promise<Project | null> {
  return unstable_cache(
    async () => getProjectById(idOrSlug),
    ["projects", idOrSlug],
    { revalidate: 60, tags: ["projects"] }
  )();
}

export async function createProject(project: Project): Promise<Project> {
  await dbConnect();
  const created = await ProjectModel.create(project);
  clearProjectCaches(project);
  revalidateTag("projects");
  return serializeProject(created);
}

export async function updateProject(updatedProject: Project): Promise<Project> {
  await dbConnect();
  const updated = await ProjectModel.findOneAndUpdate(
    { id: updatedProject.id },
    updatedProject,
    { new: true }
  );
  if (!updated) throw new Error('Project not found');
  clearProjectCaches(updatedProject);
  revalidateTag("projects");
  return serializeProject(updated);
}

export async function deleteProject(id: string): Promise<{ success: boolean }> {
  await dbConnect();
  const deleted = await ProjectModel.findOneAndDelete({ id });
  clearProjectCaches(deleted ? { id, slug: (deleted as any).slug } : { id });
  revalidateTag("projects");
  return { success: true };
}
