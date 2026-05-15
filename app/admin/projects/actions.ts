'use server';

import {
  createProject as apiCreateProject,
  deleteProject as apiDeleteProject,
  getProjects as apiGetProjects,
  updateProject as apiUpdateProject,
} from '@/lib/projects';
import { Project } from '@/types/project';
import { revalidatePath } from 'next/cache';

export async function getProjects() {
  return await apiGetProjects();
}

export async function createProject(project: Omit<Project, 'id'>) {
  const newProject = await apiCreateProject(project);
  revalidatePath('/admin/projects');
  return newProject;
}

export async function updateProject(project: Project) {
  const updatedProject = await apiUpdateProject(project);
  revalidatePath('/admin/projects');
  revalidatePath(`/admin/projects/edit/${project.id}`);
  return updatedProject;
}

export async function deleteProject(id: string) {
  const result = await apiDeleteProject(id);
  revalidatePath('/admin/projects');
  return result;
}
