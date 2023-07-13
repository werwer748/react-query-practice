"use client";

import axios from "axios";
import { QueryFunctionContext, useQuery } from "react-query";

interface Post {
  id: number;
  title: string;
  author: string;
  description: string;
}

interface User {
  nickname: string;
  email: string;
  postId: number;
}

const getPost = async ({ queryKey }: QueryFunctionContext) => {
  const { data } = await axios.get<Post>(
    `http://localhost:3065/posts/${queryKey[1]}`
  );
  return data;
};

const getUser = async ({ queryKey }: QueryFunctionContext) => {
  const { data } = await axios.get<User>(
    `http://localhost:3065/users/${queryKey[1]}`
  );
  return data;
};

export default function DependentQueriesPage() {
  const { data: user } = useQuery(["user", "kkiri@example.com"], getUser);
  const { data: post } = useQuery(["post", user?.postId], getPost, {
    enabled: !!user?.postId, // user?.postId가 존재할 때만 실행 => enabled에 따라서 쿼리가 실행되는 것을 조절할 수 있다.
  });
  /*
   * 해당 두번째 useQuery는 첫번째 useQuery가 성공적으로 끝나고 실행된다.
   * 두번째 useQuery가 첫번째 useQuery에 의존적이기 때문에 Dependent Queries라고 부른다.
   */

  console.log("user === ", user);
  console.log("post ===", post);
  return <div>Dependent Queries Page</div>;
}
