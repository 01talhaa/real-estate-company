/**
 * GitHub API Client for managing JSON files
 * Handles authentication, file fetching, and committing changes
 */

import { GithubFileResponse, GithubCommitResponse, ApiResponse } from "@/types"

const GITHUB_API_BASE = "https://api.github.com"

interface GitHubConfig {
  owner: string
  repo: string
  token: string
  branch?: string
}

class GitHubClient {
  private config: GitHubConfig

  constructor(config: GitHubConfig) {
    this.config = {
      ...config,
      branch: config.branch || "main",
    }
  }

  private getHeaders() {
    return {
      Authorization: `Bearer ${this.config.token}`,
      Accept: "application/vnd.github+json",
    }
  }

  /**
   * Fetch a file from GitHub repository
   */
  async getFile(filePath: string): Promise<GithubFileResponse> {
    const url = `${GITHUB_API_BASE}/repos/${this.config.owner}/${this.config.repo}/contents/${filePath}?ref=${this.config.branch}`

    const response = await fetch(url, {
      method: "GET",
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      let errBody: any = {}
      try {
        errBody = await response.json()
      } catch (e) {
        // ignore
      }

      const msg = errBody && errBody.message ? String(errBody.message) : "Failed to fetch file"
      const doc = errBody && errBody.documentation_url ? ` See: ${errBody.documentation_url}` : ""
      const hint = `Possible causes: token missing repo access or insufficient scopes (repo or repo:contents), or fine-grained PAT not granted access to this repository.`
      throw new Error(`GitHub API Error: ${msg} (status ${response.status}).${doc} ${hint}`)
    }

    return response.json()
  }

  /**
   * Decode Base64 content from GitHub
   */
  decodeContent(base64Content: string): string {
    try {
      return Buffer.from(base64Content, "base64").toString("utf-8")
    } catch (error) {
      throw new Error("Failed to decode Base64 content")
    }
  }

  /**
   * Encode content to Base64 for GitHub
   */
  encodeContent(content: string): string {
    try {
      return Buffer.from(content, "utf-8").toString("base64")
    } catch (error) {
      throw new Error("Failed to encode content to Base64")
    }
  }

  /**
   * Fetch and parse JSON file
   */
  async getJSON<T = any>(filePath: string): Promise<T> {
    try {
      const file = await this.getFile(filePath)
      const decodedContent = this.decodeContent(file.content)
      return JSON.parse(decodedContent)
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error(`Invalid JSON in ${filePath}: ${error.message}`)
      }
      throw error
    }
  }

  /**
   * Fetch and parse JSON file as an array
   */
  async getJSONArray<T = any>(filePath: string): Promise<T[]> {
    const data = await this.getJSON(filePath)
    if (!Array.isArray(data)) {
      throw new Error(`Expected array in ${filePath}, got ${typeof data}`)
    }
    return data
  }

  /**
   * Fetch and parse JSON file as an object/record
   */
  async getJSONObject<T = any>(filePath: string): Promise<Record<string, T>> {
    const data = await this.getJSON(filePath)
    if (typeof data !== "object" || data === null || Array.isArray(data)) {
      throw new Error(`Expected object in ${filePath}`)
    }
    return data
  }

  /**
   * Update or create a file in GitHub repository
   */
  async putFile(
    filePath: string,
    content: string,
    message: string,
    sha?: string
  ): Promise<GithubCommitResponse> {
    const url = `${GITHUB_API_BASE}/repos/${this.config.owner}/${this.config.repo}/contents/${filePath}`

    const encodedContent = this.encodeContent(content)

    const payload = {
      message,
      content: encodedContent,
      branch: this.config.branch,
      ...(sha && { sha }),
    }

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        ...this.getHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      let errBody: any = {}
      try {
        errBody = await response.json()
      } catch (e) {
        // ignore
      }
      const msg = errBody && errBody.message ? String(errBody.message) : "Failed to update file"
      const doc = errBody && errBody.documentation_url ? ` See: ${errBody.documentation_url}` : ""
      const hint = `Possible causes: token missing write access, branch protection, or fine-grained PAT missing repo permission.`
      throw new Error(`GitHub API Error: ${msg} (status ${response.status}).${doc} ${hint}`)
    }

    return response.json()
  }

  /**
   * Update JSON file with new content
   */
  async updateJSON<T = any>(filePath: string, data: T, message: string): Promise<void> {
    try {
      // Try to get current file to obtain SHA. If file not found (404), we'll create it.
      let currentSha: string | undefined = undefined
      try {
        const currentFile = await this.getFile(filePath)
        if (currentFile && typeof currentFile.sha === "string") {
          currentSha = currentFile.sha
        }
      } catch (err: any) {
        // If file missing, GitHub returns 404. Proceed to create new file without SHA.
        const errMsg = err && err.message ? String(err.message) : ""
        if (!errMsg.includes("Not Found")) {
          throw err
        }
      }

      // Convert new data to JSON
      const jsonContent = JSON.stringify(data, null, 2)

      // Update (or create) file. If currentSha is undefined, PUT will create the file.
      await this.putFile(filePath, jsonContent, message, currentSha)
    } catch (error) {
      throw error
    }
  }

  /**
   * Delete a file from GitHub
   */
  async deleteFile(filePath: string, message: string): Promise<GithubCommitResponse> {
    const url = `${GITHUB_API_BASE}/repos/${this.config.owner}/${this.config.repo}/contents/${filePath}`

    // Get current file to get SHA
    const currentFile = await this.getFile(filePath)

    const payload = {
      message,
      sha: currentFile.sha,
      branch: this.config.branch,
    }

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        ...this.getHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      let errBody: any = {}
      try {
        errBody = await response.json()
      } catch (e) {
        // ignore
      }
      const msg = errBody && errBody.message ? String(errBody.message) : "Failed to delete file"
      const doc = errBody && errBody.documentation_url ? ` See: ${errBody.documentation_url}` : ""
      const hint = `Possible causes: token missing write access, branch protection, or fine-grained PAT missing repo permission.`
      throw new Error(`GitHub API Error: ${msg} (status ${response.status}).${doc} ${hint}`)
    }

    return response.json()
  }

  /**
   * Trigger Vercel redeploy via webhook
   */
  async triggerRedeploy(webhookUrl?: string): Promise<void> {
    if (!webhookUrl) {
      console.log("No webhook URL provided for Vercel redeploy")
      return
    }

    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
    } catch (error) {
      console.error("Failed to trigger Vercel redeploy:", error)
    }
  }
}

/**
 * Get configured GitHub client instance
 */
export function getGitHubClient(): GitHubClient {
  const owner = process.env.GITHUB_OWNER
  const repo = process.env.GITHUB_REPO
  const token = process.env.GITHUB_TOKEN

  if (!owner || !repo || !token) {
    throw new Error("Missing GitHub environment variables: GITHUB_OWNER, GITHUB_REPO, GITHUB_TOKEN")
  }

  return new GitHubClient({ owner, repo, token })
}

export { GitHubClient }
