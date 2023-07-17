"use client";

import axios from "axios";
import { Fragment } from "react";
import { QueryFunctionContext, useInfiniteQuery } from "react-query";

interface Post {
  id: number;
  title: string;
  author: string;
  description: string;
}

const getPosts = async ({ pageParam = 1 }: QueryFunctionContext) => {
  const { data } = await axios.get<Post[]>(
    `http://localhost:3065/posts?_limit=2&_page=${pageParam}`
  );
  return data;
};

export default function Infinite() {
  const {
    data: postPages,
    isLoading,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery<Post[], Error>(
    "paginated", // 첫번째 인자: query key
    getPosts, // 두번쨰 인자 : fetch 함수인 query function
    {
      // 세번째는 옵션

      getNextPageParam: (_lastPage, pages) => {
        if (pages.length === 5) {
          return undefined;
        }
        return pages.length + 1;
      },
    }
  );
  return (
    <>
      <div>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          postPages?.pages.map((posts, i) => (
            <Fragment key={i}>
              {posts?.map((post) => (
                <Fragment key={post.id}>
                  <div>id: {post.id}</div>
                  <div>제목: {post.title}</div>
                  <div>작성자: {post.author}</div>
                  <div>내용: {post.description.slice(0, 100)}...</div>
                  <br />
                </Fragment>
              ))}
            </Fragment>
          ))
        )}
        <button onClick={() => fetchNextPage()} disabled={!hasNextPage}>
          Load More
        </button>
      </div>
    </>
  );
}
