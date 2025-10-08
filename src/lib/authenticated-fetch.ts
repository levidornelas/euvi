export async function authenticatedFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
    
  let res = await fetch(input, {
    ...init,
    credentials: "include",
  });

  if (res.status === 401) {
    const refreshRes = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (!refreshRes.ok) {
      return res;
    }

    res = await fetch(input, {
      ...init,
      credentials: "include",
    });
  }

  return res;
}
