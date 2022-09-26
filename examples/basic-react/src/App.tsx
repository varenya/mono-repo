import { useQuery } from "query";
import { useState } from "react";

const API_URL = "https://jsonplaceholder.typicode.com/posts";

type Post = { id: number; title: string; body: string };

async function getPosts(): Promise<Post[]> {
  const response = await fetch(API_URL);
  if (response.ok) {
    const posts: Post[] = await response.json();
    return posts;
  } else {
    return Promise.reject(new Error("unable to fetch"));
  }
}

function Posts({ onClick }: { onClick: (id: number) => void }) {
  const apiResponse = useQuery<Post[]>(getPosts);
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
            <li key={post.id} className="text-center">
              <a
                href={`/posts/${post.id}`}
                className="underline"
                onClick={(e) => {
                  e.preventDefault();
                  onClick(post.id);
                }}
              >
                {post.title}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
async function getByPostId(id: number): Promise<Post> {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}`
  );
  if (response.ok) {
    const data: Post = await response.json();
    return data;
  } else {
    throw new Error("couldn't get the post information");
  }
}

function Post({ id }: { id: number }) {
  const postResponse = useQuery(() => getByPostId(id));
  if (postResponse.status === "idle") {
    return <div>No action!</div>;
  }
  if (postResponse.status === "loading") {
    return <div>Loading...</div>;
  }
  if (postResponse.status === "error") {
    return <div>Error occured</div>;
  }
  return (
    <div className="p-4">
      <h1>{postResponse.data.title}</h1>
      <p>{postResponse.data.body}</p>
    </div>
  );
}

function App() {
  const [postId, setPostId] = useState(-1);
  return (
    <div>
      {postId === -1 ? (
        <Posts onClick={setPostId}></Posts>
      ) : (
        <>
          <button onClick={() => setPostId(-1)}>Back</button>
          <Post id={postId} />
        </>
      )}
    </div>
  );
}

export default App;
