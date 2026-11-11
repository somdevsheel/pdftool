// Turns an API error response into a sentence a user can act on, instead of
// "Cannot POST /jobs/split: {"statusCode":400,...}".
export function friendlyApiError(status: number | undefined, body: unknown): string {
  const raw = (body as { message?: unknown } | null)?.message;
  const message = Array.isArray(raw) ? raw.join('. ') : typeof raw === 'string' ? raw : '';

  if (!status) return 'Could not reach the server. Check your internet connection and try again.';
  if (status === 413) return 'This file is too large. The maximum size is 100 MB.';
  if (status === 429) return "You're going a little fast. Please wait a minute and try again.";
  if (status === 404) return message || 'This file has expired. Please upload it again.';
  if (status >= 500) return 'Something went wrong on our side. Please try again in a moment.';
  return message || 'Something went wrong. Please try again.';
}

/** Reads a fetch() error response body (JSON or text) and returns a friendly Error. */
export async function errorFromResponse(res: Response): Promise<Error> {
  let body: unknown = null;
  try {
    body = await res.json();
  } catch {
    /* not JSON */
  }
  return new Error(friendlyApiError(res.status, body));
}
