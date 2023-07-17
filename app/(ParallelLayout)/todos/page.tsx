"use client";

import axios from "axios";
import { FormEvent, Fragment, useCallback, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

interface Todo {
  id: number;
  todo: string;
  done: boolean;
}

const getTodos = async () => {
  const { data } = await axios.get<Todo[]>(`http://localhost:3065/todos`);
  return data;
};

const addTodo = async (todo: string) => {
  const { data } = await axios.post<Todo>(`http://localhost:3065/todos`, {
    todo,
    done: false,
  });
  return data;
};

export default function TodosPage() {
  const [todo, setTodo] = useState("");
  const queryClient = useQueryClient();

  const {
    data: todos,
    isLoading,
    isError,
    error,
  } = useQuery<Todo[], Error>("todos", getTodos, {
    refetchOnWindowFocus: false,
  });

  const { mutate } = useMutation<
    Todo,
    Error,
    string,
    { previousTodos: Todo[] | undefined } // Optimistic Update(낙관적 업데이트)를 위해 타입 설정
  >(addTodo, {
    // invalidateQuerys, setQueryData에서 onSuccess 사용하여 처리
    // onSuccess: (data) => {
    //   /*
    //   ==== 쿼리 무효화 ====
    //    1. queryClient.invalidateQueries("todos");
    //   'todos'를 쿼리키로 가지는 캐시를 모두 무효화 시킨다.
    //   데이터가 무효화되면, refetch(재요청)이 일어나고 그로인해 UI가 업데이트 된다.
    //   작성 클릭 > mutate 호출 > addTodo 호출(POST 요청) > onSuccess호출 > 'todos' 쿼리키를 갖는 쿼리 데이터 무효화 > 'todos' 쿼리키를 갖는 쿼리 refetch > getTodos 호출(GET 요청)

    //   post 후 get요청을 하는 방식이 낭비를 일으키기 때문에 두번째 방식을 시도
    //   */
    //   /*
    //  ==== setQueryData ====
    //   queryClient.setQueryData<Todo[]>("todos", (oldData) => {
    //     if (!oldData) {
    //       return [];
    //     }

    //     return [...oldData, { id: data.id, todo: data.todo, done: data.done }];
    //   });
    //   */
    // },
    //Optimistic Update(낙관적 업데이트)를 위해 설정
    onMutate: async (newTodo) => {
      await queryClient.cancelQueries("todos");

      const previousTodos = queryClient.getQueryData<Todo[]>("todos");

      queryClient.setQueryData<Todo[]>("todos", (oldData) => {
        if (!oldData) {
          return [];
        }

        return [...oldData, { id: Date.now(), todo: newTodo, done: false }];
      });

      return { previousTodos };
    },

    onError: () => {},
    onSettled: () => {},
  });

  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      mutate(todo);
      setTodo("");
    },
    [mutate, todo]
  );

  if (isError) {
    return <div>{error?.message}</div>;
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <label>할 일: </label>
        <input
          type="text"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
        />
        <button type="submit">작성</button>
      </form>

      <br />

      <div>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          todos?.map((todo) => (
            <Fragment key={todo.id}>
              <div>ID: {todo.id}</div>
              <div>할 일: {todo.todo}</div>

              <br />
              <hr />
            </Fragment>
          ))
        )}
      </div>
    </div>
  );
}
