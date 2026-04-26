function buildRequestConfig(options = {}) {
  const { body, headers, ...rest } = options;
  const resolvedHeaders = {
    Accept: 'application/json',
    ...headers,
  };

  const config = {
    ...rest,
    headers: resolvedHeaders,
  };

  if (body !== undefined) {
    config.body = JSON.stringify(body);
    if (!resolvedHeaders['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }
  }

  return config;
}

async function parseResponseBody(response) {
  const rawBody = await response.text();

  if (!rawBody) {
    return null;
  }

  try {
    return JSON.parse(rawBody);
  } catch {
    return rawBody;
  }
}

function getErrorMessage(parsedBody, fallbackMessage) {
  if (!parsedBody) {
    return fallbackMessage;
  }

  if (typeof parsedBody === 'string') {
    return parsedBody;
  }

  if (typeof parsedBody.error === 'string') {
    return parsedBody.error;
  }

  if (typeof parsedBody.message === 'string') {
    return parsedBody.message;
  }

  if (typeof parsedBody.error?.message === 'string') {
    return parsedBody.error.message;
  }

  return fallbackMessage;
}

export async function requestJson(url, options = {}) {
  let response;

  try {
    response = await fetch(url, buildRequestConfig(options));
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Network request failed. Check your backend URL and connection.'
    );
  }

  const parsedBody = await parseResponseBody(response);

  if (!response.ok) {
    throw new Error(
      getErrorMessage(parsedBody, `Request failed with status ${response.status}`)
    );
  }

  return parsedBody;
}
