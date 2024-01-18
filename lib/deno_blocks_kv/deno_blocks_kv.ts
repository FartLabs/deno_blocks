import type {
  SubhostingAPIDeployment,
  SubhostingAPIProject,
} from "#/lib/subhosting_api/mod.ts";

export const DENO_BLOCKS_KV_KEY_NAMESPACE: Deno.KvKey = ["deno_blocks"];

export enum DenoBlocksKvKeyPrefix {
  USERS_BY_ID = "users_by_id",
  USERS_BY_GITHUB_USER_ID = "users_by_github_user_id",
  USER_IDS_BY_SESSION_ID = "user_ids_by_session_id",
  DEPLOYMENTS_BY_PROJECT_ID = "deployments_by_project_id",
}

export interface DenoBlocksUser {
  id: string;
  githubUserID: string;
  githubUsername: string;
  projects: SubhostingAPIProject[];
}

export function makeDenoBlocksUser(
  id: string,
  githubUserID: string,
  githubUsername: string,
): DenoBlocksUser {
  return {
    id,
    githubUserID,
    githubUsername,
    projects: [],
  };
}

export interface CreateUserRequest {
  githubUserID: string;
  githubUsername: string;
}

export interface AddSessionRequest {
  sessionID: string;
  userID: string;
}

export interface GetUserBySessionIDRequest {
  sessionID: string;
}

export class DenoBlocksKv {
  constructor(
    private readonly kv: Deno.Kv,
    private readonly kvKeyNamespace: Deno.KvKey = DENO_BLOCKS_KV_KEY_NAMESPACE,
  ) {}

  private k(...key: Deno.KvKey): Deno.KvKey {
    return [...this.kvKeyNamespace, ...key];
  }

  public async createUser(request: CreateUserRequest): Promise<void> {
    const usersByGitHubUserIDKey = this.k(
      DenoBlocksKvKeyPrefix.USERS_BY_GITHUB_USER_ID,
      request.githubUserID,
    );
    const usersByGitHubUserIDResult = await this.kv.get<DenoBlocksUser>(
      usersByGitHubUserIDKey,
    );
    if (usersByGitHubUserIDResult.value) {
      throw new Error("User already exists");
    }

    const user = makeDenoBlocksUser(
      crypto.randomUUID(),
      request.githubUserID,
      request.githubUsername,
    );
    const usersByIDKey = this.k(
      DenoBlocksKvKeyPrefix.USERS_BY_ID,
      user.id,
    );
    const result = await this.kv.atomic()
      .check(usersByGitHubUserIDResult)
      .set(usersByGitHubUserIDKey, user)
      .set(usersByIDKey, user)
      .commit();
    if (!result.ok) {
      throw new Error("Failed to create user");
    }
  }
}
