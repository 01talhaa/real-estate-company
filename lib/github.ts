import fs from 'fs/promises';
import path from 'path';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

interface GithubFile {
  sha: string;
  content: string;
}

async function getGithubFile(filePath: string): Promise<GithubFile | null> {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`;

  // Helper to fallback to local file system
  const tryLocal = async () => {
    try {
      const fullPath = path.join(process.cwd(), filePath);
      const content = await fs.readFile(fullPath, 'utf-8');
      return { sha: 'local-sha', content };
    } catch (err) {
      return null;
    }
  };

  if (!GITHUB_TOKEN) {
    return tryLocal();
  }

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
      cache: 'no-store',
    });

    if (response.status === 404) {
      return tryLocal();
    }

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        console.warn(`GitHub API Auth failed (${response.status}). Falling back to local file system for ${filePath}.`);
        const localData = await tryLocal();
        if (localData) return localData;
      }
      const error = await response.json();
      throw new Error(`Failed to fetch ${filePath} from GitHub: ${error.message}`);
    }

    const data = await response.json();
    return {
      sha: data.sha,
      content: Buffer.from(data.content, 'base64').toString('utf-8'),
    };
  } catch (error) {
    console.error(`Error getting GitHub file at ${filePath}, trying local fallback:`, error);
    const localData = await tryLocal();
    if (localData) return localData;
    throw error;
  }
}

async function updateGithubFile(
  filePath: string,
  content: string,
  commitMessage: string,
  sha?: string
): Promise<void> {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`;

  // Always update locally for immediate feedback and as a fallback
  const writeLocal = async () => {
    try {
      const fullPath = path.join(process.cwd(), filePath);
      await fs.writeFile(fullPath, content, 'utf-8');
    } catch (err) {
      console.error(`Failed to write local file ${filePath}`, err);
    }
  };

  await writeLocal();

  if (!GITHUB_TOKEN) {
    console.warn(`No GITHUB_TOKEN provided. Only updated local file ${filePath}.`);
    return;
  }

  const encodedContent = Buffer.from(content).toString('base64');
  const body: { message: string; content: string; branch: string; sha?: string } = {
    message: commitMessage,
    content: encodedContent,
    branch: GITHUB_BRANCH,
  };

  if (sha && sha !== 'local-sha') {
    body.sha = sha;
  }

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.warn(`GitHub API update failed (${response.status}). Changes to ${filePath} were saved locally.`);
    }
  } catch (error) {
    console.warn(`Error updating GitHub file at ${filePath}. Changes were saved locally.`, error);
  }
}

export { getGithubFile, updateGithubFile };
