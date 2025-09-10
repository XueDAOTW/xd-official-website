export class JobsError extends Error {
  constructor(message: string, public code?: string) {
    super(message)
    this.name = 'JobsError'
  }
}

export class JobNotFoundError extends JobsError {
  constructor(jobId: string) {
    super(`Job with ID ${jobId} not found`, 'JOB_NOT_FOUND')
    this.name = 'JobNotFoundError'
  }
}

export class JobStatusUpdateError extends JobsError {
  constructor(jobId: string, status: string) {
    super(`Failed to update job ${jobId} to ${status} status`, 'JOB_STATUS_UPDATE_FAILED')
    this.name = 'JobStatusUpdateError'
  }
}

export class JobDeleteError extends JobsError {
  constructor(jobId: string) {
    super(`Failed to delete job ${jobId}`, 'JOB_DELETE_FAILED')
    this.name = 'JobDeleteError'
  }
}

export class JobsFetchError extends JobsError {
  constructor(status?: string) {
    const message = status ? `Failed to fetch ${status} jobs` : 'Failed to fetch jobs'
    super(message, 'JOBS_FETCH_FAILED')
    this.name = 'JobsFetchError'
  }
}

export const handleJobsError = (error: unknown): string => {
  if (error instanceof JobsError) {
    return error.message
  }
  
  if (error instanceof Error) {
    return error.message
  }
  
  return 'An unexpected error occurred'
}