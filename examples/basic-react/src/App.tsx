import { useEffect, useReducer, useState } from "react";
import { useQuery } from "query";

const API_URL = "https://jsonplaceholder.typicode.com/posts";

type Post = { id: number; title: string };

async function getPosts(): Promise<Post[]> {
  const response = await fetch(API_URL);
  if (response.ok) {
    const posts: Post[] = await response.json();
    return posts;
  } else {
    return Promise.reject(new Error("unable to fetch"));
  }
}

const responseCache = new Map<string, Promise<any>>();

function App() {
  const apiResponse = useQuery<Post[]>("posts", getPosts);
  if (apiResponse.status === "idle") {
    return <div>No action!</div>;
  }
  if (apiResponse.status === "loading") {
    return <div>Loading...</div>;
  }
  if (apiResponse.status === "error") {
    return <div>Error occured</div>;
  }
  return (
    <div className="bg-gray-200 min-h-screen pt-4">
      <ul className="w-1/2 mx-auto flex flex-col gap-2">
        {apiResponse.data.map((post) => {
          return (
            <li
              key={post.id}
              className="text-center bg-green-500 rounded-md p-4 text-white"
            >
              {post.title}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;
