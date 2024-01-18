export const GITHUB_API_URL = "https://api.github.com";

export function makeGitHubAPIURL(path: string): string {
  return `${GITHUB_API_URL}${path}`;
}

export interface GitHubAPIUser {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
}

export async function getGitHubAPIUserByAccessToken(
  accessToken: string,
): Promise<GitHubAPIUser> {
  const response = await fetch(makeGitHubAPIURL("/user"), {
    headers: {
      "Authorization": `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) {
    await response.body?.cancel();
    throw new Error(`Failed to get user: ${response.statusText}`);
  }

  return await response.json() as GitHubAPIUser;
}
