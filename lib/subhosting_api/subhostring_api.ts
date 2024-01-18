const API_URL = "https://api.deno.com/v1";

export interface SubhostingAPIProject {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubhostingAPIDeployment {
  id: string;
  projectId: string;
  description: string;
  status: string;
  domains: string[];
  databases: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

/**
 * SubhostingAPIBaseOptions are the base API client options.
 *
 * Subhosting docs: https://docs.deno.com/deploy/manual/subhosting/
 */
export default interface SubhostingAPIBaseOptions {
  /**
   * accessToken is a valid Deno Deploy access token.
   */
  accessToken: string;

  /**
   * organizationID is a unique ID for your subhosting org - used in many resource URLs.
   */
  organizationID: string;

  /**
   * endpoint is the endpoint to use for the client.
   */
  endpoint?: string;

  /**
   * fetch is the fetch implementation to use for the client.
   */
  fetch?: typeof fetch;
}

function getSubhostingAPIBaseOptions(options: SubhostingAPIBaseOptions) {
  const endpoint = options.endpoint ?? API_URL;
  const fetch = options.fetch ?? window.fetch.bind(window);
  return { ...options, endpoint, fetch };
}

export interface SubhostingAPIGetProjectsOptions
  extends SubhostingAPIBaseOptions {
  /**
   * The page number to return.
   */
  page?: number;

  /**
   * The maximum number of projects to return per page.
   */
  limit?: number;

  /**
   * Query by project name or project ID.
   */
  q?: string;

  /**
   * The field to sort by, either `name` or `updated_at`. Defaults to `updated_at`.
   */
  sort?: "name" | "updated_at";

  /**
   * The sort order, either `asc` or `desc`. Defaults to `asc`.
   */
  order?: "asc" | "desc";
}

export type SubhostingAPIGetProjectsResult = SubhostingAPIProject[];

/**
 * Get a list of projects for the configured org, with optional query params:
 * https://docs.deno.com/deploy/api/rest/organizations#list-projects-for-an-organization
 */
export async function getProjects(
  options: SubhostingAPIGetProjectsOptions,
): Promise<SubhostingAPIGetProjectsResult[]> {
  const baseOptions = getSubhostingAPIBaseOptions(options);
  const url = new URL(
    `${baseOptions.endpoint}/organizations/${baseOptions.organizationID}/projects`,
  );
  if (options.page) {
    url.searchParams.set("page", options.page.toString());
  }

  if (options.limit) {
    url.searchParams.set("limit", options.limit.toString());
  }

  if (options.q) {
    url.searchParams.set("q", options.q);
  }

  if (options.sort) {
    url.searchParams.set("sort", options.sort);
  }

  if (options.order) {
    url.searchParams.set("order", options.order);
  }

  const response = await baseOptions.fetch(url, {
    headers: {
      Authorization: `Bearer ${baseOptions.accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return await response.json();
}

export interface SubhostingAPICreateProjectOptions
  extends SubhostingAPIBaseOptions {
  /**
   * Project name.
   */
  name?: string;

  /**
   * Project description.
   */
  description?: string;
}

export type SubhostingAPICreateProjectResult = SubhostingAPIProject;

/**
 * Create a project within the configured organization for the client. Docs:
 * https://docs.deno.com/deploy/api/rest/organizations#create-a-new-project-for-an-organization
 */
export async function createProject(
  options: SubhostingAPICreateProjectOptions,
): Promise<SubhostingAPICreateProjectResult> {
  const baseOptions = getSubhostingAPIBaseOptions(options);
  const url = new URL(
    `${baseOptions.endpoint}/organizations/${baseOptions.organizationID}/projects`,
  );
  const response = await baseOptions.fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${baseOptions.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: options.name,
      description: options.description,
    }),
  });
  return await response.json();
}

export interface SubhostingAPIDeleteProjectOptions
  extends SubhostingAPIBaseOptions {
  projectId: string;
}

export type SubhostingAPIDeleteProjectResult = void;

/**
 * Delete a project by ID.
 * https://docs.deno.com/deploy/api/rest/projects#delete-a-project
 */
export async function deleteProject(
  options: SubhostingAPIDeleteProjectOptions,
): Promise<SubhostingAPIDeleteProjectResult> {
  const baseOptions = getSubhostingAPIBaseOptions(options);
  const url = new URL(
    `${baseOptions.endpoint}/projects/${options.projectId}`,
  );
  const response = await baseOptions.fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${baseOptions.accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return await response.json();
}

export interface SubhostingAPIGetDeploymentsOptions
  extends SubhostingAPIBaseOptions {
  /**
   * Project ID.
   */
  projectId: string;

  /**
   * The page number to return.
   */
  page?: number;

  /**
   * The maximum number of projects to return per page.
   */
  limit?: number;

  /**
   * Query by deployment ID.
   */
  q?: string;

  /**
   * The field to sort by, either `name` or `updated_at`. Defaults to `updated_at`.
   */
  sort?: "name" | "updated_at";

  /**
   * The sort order, either `asc` or `desc`. Defaults to `asc`.
   */
  order?: "asc" | "desc";
}

export type SubhostingAPIGetDeploymentsResult = SubhostingAPIDeployment[];

/**
 * Get a list of deployments for the given project, with optional query params:
 * https://docs.deno.com/deploy/api/rest/projects#get-project-deployments
 */
export async function getDeployments(
  options: SubhostingAPIGetDeploymentsOptions,
): Promise<SubhostingAPIGetDeploymentsResult> {
  const baseOptions = getSubhostingAPIBaseOptions(options);
  const url = new URL(
    `${baseOptions.endpoint}/projects/${options.projectId}/deployments`,
  );
  if (options.page) {
    url.searchParams.set("page", options.page.toString());
  }

  if (options.limit) {
    url.searchParams.set("limit", options.limit.toString());
  }

  if (options.q) {
    url.searchParams.set("q", options.q);
  }

  if (options.sort) {
    url.searchParams.set("sort", options.sort);
  }

  if (options.order) {
    url.searchParams.set("order", options.order);
  }

  const response = await baseOptions.fetch(url, {
    headers: {
      Authorization: `Bearer ${baseOptions.accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return await response.json();
}

export interface SubhostingAPICreateDeploymentOptions
  extends SubhostingAPIBaseOptions {
  projectId: string;
  entrypointUrl: string;
  assets: object[];
  importMapUrl: string | null;
  lockFileUrl: string | null;
  compilerOptions: object | null;
  envVars?: Record<string, string>;
  databases?: Record<string, string>;
  description?: string;
}

export type SubhostingAPICreateDeploymentResult = SubhostingAPIDeployment;

/**
 * Create a new deployment for the given project by ID. Docs:
 * https://docs.deno.com/deploy/api/rest/deployments
 */
export async function createDeployment(
  options: SubhostingAPICreateDeploymentOptions,
): Promise<SubhostingAPICreateDeploymentResult> {
  const baseOptions = getSubhostingAPIBaseOptions(options);
  const url = new URL(
    `${baseOptions.endpoint}/projects/${options.projectId}/deployments`,
  );
  const response = await baseOptions.fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${baseOptions.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      entrypointUrl: options.entrypointUrl,
      assets: options.assets,
      importMapUrl: options.importMapUrl,
      lockFileUrl: options.lockFileUrl,
      compilerOptions: options.compilerOptions,
      envVars: options.envVars,
      databases: options.databases,
      description: options.description,
    }),
  });
  return await response.json();
}

export interface SubhostingAPIDeleteDeploymentOptions
  extends SubhostingAPIBaseOptions {
  deploymentId: string;
}

export type SubhostingAPIDeleteDeploymentResult = void;

/**
 * Delete a deployment by ID.
 */
export async function deleteDeployment(
  options: SubhostingAPIDeleteDeploymentOptions,
): Promise<SubhostingAPIDeleteDeploymentResult> {
  const baseOptions = getSubhostingAPIBaseOptions(options);
  const url = new URL(
    `${baseOptions.endpoint}/deployments/${options.deploymentId}`,
  );
  const response = await baseOptions.fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${baseOptions.accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return await response.json();
}

export interface SubhostingAPIGetDeploymentAppLogsOptions
  extends SubhostingAPIBaseOptions {
  /**
   * Text to search for in log message.
   */
  q: string;

  /**
   * Log level(s) to filter logs by.
   *
   * Defaults to all levels (i.e. no filter applied).
   *
   * Multiple levels can be specified using comma-separated format.
   */
  level?: string;

  /**
   * Region(s) to filter logs by.
   *
   * Defaults to all regions (i.e. no filter applied).
   *
   * Multiple regions can be specified using comma-separated format.
   */
  region?: string;

  /**
   * Start time of the time range to filter logs by.
   *
   * Defaults to the Unix Epoch (though the log retention period is 2 weeks as of now).
   *
   * If neither since nor until is specified, real-time logs are returned.
   */
  since?: string;

  /**
   * End time of the time range to filter logs by.
   *
   * Defaults to the current time.
   *
   * If neither since nor until is specified, real-time logs are returned.
   */
  until?: string;

  /**
   * Maximum number of logs to return in one request.
   *
   * This is only effective for the past log mode.
   */
  limit?: number;

  /**
   * The field to sort by. Currently only time is supported.
   *
   * This is only effective for the past log mode.
   */
  sort?: string;

  /**
   * Sort order, either asc or desc. Defaults to desc.
   *
   * For backward compatibility, timeAsc and timeDesc are also supported, but deprecated.
   *
   * This is only effective for the past log mode.
   */
  order?: string;

  /**
   * Opaque value that represents the cursor of the last log returned in the previous request.
   *
   * This is only effective for the past log mode.
   */
  cursor?: string;

  /**
   * Deployment ID.
   */
  deploymentId: string;
}

export interface SubhostingAPIGetDeploymentAppLogsResult {
  time: string;
  level: string;
  message: string;
  region: string;
}

export async function getDeploymentAppLogs(
  options: SubhostingAPIGetDeploymentAppLogsOptions,
): Promise<SubhostingAPIGetDeploymentAppLogsResult[]> {
  const baseOptions = getSubhostingAPIBaseOptions(options);
  const url = new URL(
    `${baseOptions.endpoint}/deployments/${options.deploymentId}/app_logs`,
  );
  url.searchParams.set("q", options.q);
  if (options.level) {
    url.searchParams.set("level", options.level);
  }

  if (options.region) {
    url.searchParams.set("region", options.region);
  }

  if (options.since) {
    url.searchParams.set("since", options.since);
  }

  if (options.until) {
    url.searchParams.set("until", options.until);
  }

  if (options.limit) {
    url.searchParams.set("limit", options.limit.toString());
  }

  if (options.sort) {
    url.searchParams.set("sort", options.sort);
  }

  if (options.order) {
    url.searchParams.set("order", options.order);
  }

  if (options.cursor) {
    url.searchParams.set("cursor", options.cursor);
  }

  const response = await baseOptions.fetch(url, {
    headers: {
      Authorization: `Bearer ${baseOptions.accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return await response.json();
}

// TODO: Add more API methods e.g. create kv database, delete kv database, etc.
// https://docs.deno.com/deploy/api/rest
// https://docs.deno.com/deploy/api/rest/databases#list-an-organizations-kv-databases
//
