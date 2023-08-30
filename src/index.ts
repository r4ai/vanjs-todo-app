import van from "vanjs-core";

const { form, div, input, button, ul, li, label } = van.tags;

type Todo = {
  id: number;
  title: string;
  isDone: boolean;
};

const todos = van.state<Todo[]>([
  {
    id: 1,
    title: "Buy milk",
    isDone: true,
  },
  {
    id: 2,
    title: "Learn VanJS",
    isDone: false,
  },
]);

const TodoItem = ({ id }: Todo) => {
  const todo = todos.val.find((x) => x.id === id);

  const handleCheckTodo = (e: InputEvent) => {
    todos.val = todos.val.map((x) => {
      if (x.id === id) {
        return { ...x, isDone: (e.target as HTMLInputElement).checked };
      }
      return x;
    });
  };

  return div(
    input({
      type: "checkbox",
      checked: todo?.isDone ?? false,
      id: `todo-${id}`,
      onchange: handleCheckTodo,
    }),
    label({ for: `todo-${id}` }, todo?.title ?? "")
  );
};

const App = () => {
  const newTodoTitle = van.state("");

  const handleTodoSubmit = (e: Event) => {
    e.preventDefault();
    todos.val = [
      ...todos.val,
      { id: todos.val.length + 1, title: newTodoTitle.val, isDone: false },
    ];
    console.log(todos.val);
    newTodoTitle.val = "";
  };

  return div(
    () => ul(todos.val.map((todo) => li(TodoItem(todo)))),
    form(
      { onsubmit: handleTodoSubmit },
      input({
        type: "text",
        value: newTodoTitle,
        oninput: (e: Event) =>
          (newTodoTitle.val = (e.target as HTMLInputElement).value),
      }),
      button({ type: "submit" }, "追加")
    )
  );
};

van.add(document.body, App());
