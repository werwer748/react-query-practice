"use client";

import axios from "axios";
import { Fragment, useState } from "react";
import { QueryFunctionContext, useQuery } from "react-query";

interface Post {
  id: number;
  title: string;
  author: string;
  description: string;
}

const getPosts = async ({ queryKey }: QueryFunctionContext) => {
  console.log("queryKey====", queryKey);
  const { data } = await axios.get<Post[]>(
    `http://localhost:3065/posts?_limit=2&_page=${queryKey[1]}`
  );
  return data;
};

export default function Paginated() {
  const [page, setPage] = useState(1);
  const { data: posts, isLoading } = useQuery<Post[], Error>(
    ["paginated", page],
    getPosts,
    {
      keepPreviousData: true, // 새로운 데이터를 가져오기전까지 이전 데이터캐시를 유지해 준다.
    }
  );
  return (
    <>
      <div>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          posts?.map((post) => (
            <Fragment key={post.id}>
              <div>id: {post.id}</div>
              <div>제목: {post.title}</div>
              <div>작성자: {post.author}</div>
              <div>내용: {post.description.slice(0, 100)}...</div>
            </Fragment>
          ))
        )}
        <button
          onClick={() => setPage((page) => page - 1)}
          disabled={page === 1}
        >
          Prev Page
        </button>
        <button
          onClick={() => setPage((page) => page + 1)}
          disabled={page === 5}
        >
          Next Page
        </button>
      </div>
    </>
  );
}
