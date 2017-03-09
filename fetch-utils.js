export function clear() {
  delete global.fetch;
}

export function setupFetch(data) {
  global.fetch = () => Promise.resolve({
    ok: true,
    json: () => Promise.resolve(data)
  });
}

export function setupFetchError(err) {
  global.fetch = () => Promise.resolve({
    ok: false,
    json: () => Promise.resolve(err)
  });
}
