import { useEffect, useState } from "react";

type API_RESPONSE<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };

function useQuery<T>(key: string, asyncFunc: () => Promise<T>) {
  const [currentResponseState, setApiResponse] = useState<API_RESPONSE<T>>({
    status: "idle",
  });
  useEffect(() => {
    async function getResponse() {
      try {
        setApiResponse({ status: "loading" });
        const promise = asyncFunc();
        setApiResponse({ status: "success", data: await promise });
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
