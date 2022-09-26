import { useEffect, useState } from "react";

type API_RESPONSE<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };

type Result<T> = { error: string } | T;
function createCache<T>() {
  const cache = new Map<string, Result<T>>();
  function addCache(key: string, promise: Promise<T>) {
    promise.then(
      (value) => {
        cache.set(key, value);
      },
      () => {
        cache.set(key, { error: "error resolving the promise" });
      }
    );
  }
  function read(key: string): Result<T> {
    const result = cache.get(key);
    if (!!result) {
      return result;
    } else {
      throw new Error("no such query");
    }
  }
  return {
    addCache,
    read,
  };
}

function useQuery<T>(_key: string, asyncFunc: () => Promise<T>) {
  const [currentResponseState, setApiResponse] = useState<API_RESPONSE<T>>({
    status: "idle",
  });
  useEffect(() => {
    async function getResponse() {
      try {
        setApiResponse({ status: "loading" });
        const promise = asyncFunc();
        const data = await promise;
        setApiResponse({ status: "success", data });
      } catch {
        setApiResponse({
          status: "error",
          message: "unable to get requested data",
        });
      }
    }
    getResponse();
  }, []);
  return currentResponseState;
}

export { useQuery };
