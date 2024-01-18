import type { SubhostingAPIProject } from "#/lib/subhosting_api/mod.ts";

export const DENO_BLOCKS_KV_KEY_NAMESPACE: Deno.KvKey = ["deno_blocks"];

export enum DenoBlocksKvKeyPrefix {
  USERS_BY_ID = "users_by_id",
  USERS_BY_GITHUB_USER_ID = "users_by_github_user_id",
  USER_IDS_BY_SESSION_ID = "user_ids_by_session_id",
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

// Attention: Read projects by user's projects property.
// Attention: Read deployments from Subhosting API's `getDeployments`.
export interface AddProjectRequest {
  userID: string;
  project: SubhostingAPIProject;
}

export interface DeleteProjectRequest {
  userID: string;
  projectID: string;
}

/**
 * Attention:
 * - Read user projects from user's projects property.
 * - Create projects on Subhosting API's `createProject`.
 * - Delete projects on Subhosting API's `deleteProject`.
 * - Read deployments from Subhosting API's `getDeployments`.
 * - Delete deployments from Subhosting API's `deleteDeployment`.
 * - Read deployment logs with Subhosting API's `getDeploymentAppLogs`.
 */
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

  public async addSession(request: AddSessionRequest): Promise<void> {
    const usersByIDKey = this.k(
      DenoBlocksKvKeyPrefix.USERS_BY_ID,
      request.userID,
    );
    const usersByIDResult = await this.kv.get<DenoBlocksUser>(usersByIDKey);
    if (!usersByIDResult.value) {
      throw new Error("User not found");
    }

    const user = usersByIDResult.value;
    const userIDsBySessionIDKey = this.k(
      DenoBlocksKvKeyPrefix.USER_IDS_BY_SESSION_ID,
      request.sessionID,
    );
    const result = await this.kv.atomic()
      .check(usersByIDResult)
      .set(userIDsBySessionIDKey, user.id)
      .commit();
    if (!result.ok) {
      throw new Error("Failed to add session");
    }
  }

  public async getUserBySessionID(
    request: GetUserBySessionIDRequest,
  ): Promise<DenoBlocksUser | null> {
    const userIDsBySessionIDKey = this.k(
      DenoBlocksKvKeyPrefix.USER_IDS_BY_SESSION_ID,
      request.sessionID,
    );
    const userIDsBySessionIDResult = await this.kv.get<string>(
      userIDsBySessionIDKey,
    );
    if (!userIDsBySessionIDResult.value) {
      return null;
    }

    const usersByIDKey = this.k(
      DenoBlocksKvKeyPrefix.USERS_BY_ID,
      userIDsBySessionIDResult.value,
    );
    const usersByIDResult = await this.kv.get<DenoBlocksUser>(usersByIDKey);
    return usersByIDResult.value;
  }

  public async addProject(request: AddProjectRequest): Promise<void> {
    const usersByIDKey = this.k(
      DenoBlocksKvKeyPrefix.USERS_BY_ID,
      request.userID,
    );
    const usersByIDResult = await this.kv.get<DenoBlocksUser>(usersByIDKey);
    if (!usersByIDResult.value) {
      throw new Error("User not found");
    }

    const user = usersByIDResult.value;
    user.projects.push(request.project);
    const result = await this.kv.atomic()
      .check(usersByIDResult)
      .set(usersByIDKey, user)
      .commit();
    if (!result.ok) {
      throw new Error("Failed to add project");
    }
  }

  public async getProjectsByUserID(userID: string): Promise<
    SubhostingAPIProject[]
  > {
    const usersByIDKey = this.k(
      DenoBlocksKvKeyPrefix.USERS_BY_ID,
      userID,
    );
    const usersByIDResult = await this.kv.get<DenoBlocksUser>(usersByIDKey);
    if (!usersByIDResult.value) {
      throw new Error("User not found");
    }

    return usersByIDResult.value.projects;
  }

  public async deleteProject(request: DeleteProjectRequest): Promise<void> {
    const usersByIDKey = this.k(
      DenoBlocksKvKeyPrefix.USERS_BY_ID,
      request.userID,
    );
    const usersByIDResult = await this.kv.get<DenoBlocksUser>(usersByIDKey);
    if (!usersByIDResult.value) {
      throw new Error("User not found");
    }

    const user = usersByIDResult.value;
    user.projects = user.projects.filter((project) =>
      project.id !== request.projectID
    );
    const result = await this.kv.atomic()
      .check(usersByIDResult)
      .set(usersByIDKey, user)
      .commit();
    if (!result.ok) {
      throw new Error("Failed to delete project");
    }
  }
}
