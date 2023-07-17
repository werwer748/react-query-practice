"use client";

import axios from "axios";
import { NextPage } from "next";
import { useParams } from "next/navigation";
import { QueryFunctionContext, useQuery, useQueryClient } from "react-query";

interface Post {
  id: number;
  title: string;
  author: string;
  description: string;
}

const getPost = async (query: QueryFunctionContext) => {
  const { data } = await axios.get<Post>(
    `http://localhost:3065/posts/${query.queryKey[1]}`
  );
  return data;
};

export default function PostDetail<NextPage extends unknown>() {
  const params = useParams();
  const { id: postId } = params;
  console.log("useParams로 뽑은 id", postId);

  const queryClient = useQueryClient(); // 홈에서 생성된(?) queryClient를 가져온다.

  const { data: post, isLoading } = useQuery<Post, Error>(
    ["post", postId],
    getPost,
    {
      initialData: () => {
        const posts = queryClient.getQueryData<Post[]>("posts");
        const post = postId ? posts?.find((post) => post.id === +postId) : null;

        if (!post) {
          return undefined;
        }

        return post;
      },
    }
  );

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : post ? (
        <>
          <div>id: {post.id}</div>
          <div>제목: {post.title}</div>
          <div>작성자: {post.author}</div>
          <div>내용: {post.description}</div>
        </>
      ) : null}
    </div>
  );
}
