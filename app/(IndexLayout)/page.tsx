"use client";

import type { NextPage } from "next";
import { useQuery } from "react-query";
import axios from "axios";
import { Fragment } from "react";
import Link from "next/link";

interface Post {
  id: number;
  title: string;
  author: string;
  description: string;
}

const getPosts = async () => {
  const { data } = await axios.get<Post[]>("http://localhost:3065/posts");
  return data;
};

const Home: NextPage = () => {
  const {
    data: posts,
    isLoading,
    isError,
    error,
  } = useQuery<Post[], Error>("posts", getPosts, {
    staleTime: 3 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: true, // 브라우저의 이 탭이 포커스가 되었을 때!
    refetchInterval: false,
  });

  if (isError) {
    return <div>{error.message}</div>;
  }

  return (
    <>
      <div>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          posts?.map((post) => (
            <Fragment key={post.id}>
              <br />
              <Link href={`/post/${post.id}`}>
                <div>id: {post.id}</div>
                <div>제목: {post.title}</div>
                <div>작성자: {post.author}</div>
                <div>내용: {post.description.slice(0, 100)}...</div>
              </Link>
              <br />
              <hr />
            </Fragment>
          ))
        )}
      </div>
    </>
  );
};

export default Home;
