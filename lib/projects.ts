import { getGithubFile, updateGithubFile } from './github';
import { Project } from '@/types/project';

const PROJECTS_PATH = 'data/projects.json';

export async function getProjects(): Promise<Project[]> {
  const file = await getGithubFile(PROJECTS_PATH);
  if (!file) {
    return [];
  }
  try {
    return JSON.parse(file.content);
  } catch (error) {
    console.error('Error parsing projects.json:', error);
    return [];
  }
}

export async function createProject(project: Omit<Project, 'id'>): Promise<Project> {
  const projects = await getProjects();
  const newProject: Project = {
    ...project,
    id: Date.now().toString(),
  };
  projects.push(newProject);

  const file = await getGithubFile(PROJECTS_PATH);
  await updateGithubFile(
    PROJECTS_PATH,
    JSON.stringify(projects, null, 2),
    'Create project',
    file?.sha
  );
  return newProject;
}

export async function updateProject(updatedProject: Project): Promise<Project> {
  let projects = await getProjects();
  projects = projects.map((p) =>
    p.id === updatedProject.id ? updatedProject : p
  );

  const file = await getGithubFile(PROJECTS_PATH);
  await updateGithubFile(
    PROJECTS_PATH,
    JSON.stringify(projects, null, 2),
    `Update project ${updatedProject.id}`,
    file?.sha
  );
  return updatedProject;
}

export async function deleteProject(id: string): Promise<{ success: boolean }> {
  let projects = await getProjects();
  projects = projects.filter((p) => p.id !== id);

  const file = await getGithubFile(PROJECTS_PATH);
  await updateGithubFile(
    PROJECTS_PATH,
    JSON.stringify(projects, null, 2),
    `Delete project ${id}`,
    file?.sha
  );

  return { success: true };
}
