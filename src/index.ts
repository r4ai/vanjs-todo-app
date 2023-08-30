import van from "vanjs-core";

const { form, div, input, button, ul, li, label, h2, h1 } = van.tags;

type Todo = {
  id: number;
  title: string;
  isDone: boolean;
};

const todos = van.state<Todo[]>([]);

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

  const handleDeleteTodo = (e: InputEvent) => {};

  return div(
    input({
      type: "checkbox",
      checked: todo?.isDone ?? false,
      id: `todo-${id}`,
      onchange: handleCheckTodo,
    }),
    label({ for: `todo-${id}` }, todo?.title ?? ""),
    button({ onclick: handleDeleteTodo }, "×")
  );
};

const App = () => {
  const newTodoTitle = van.state("");

  // Get initial todos from localStorage
  todos.val = JSON.parse(localStorage.getItem("todos") ?? "[]");

  // Save todos to localStorage
  van.derive(() => {
    localStorage.setItem("todos", JSON.stringify(todos.val));
  });

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
    div(h2("Todo List"), () =>
      ul(
        todos.val
          .filter((todo) => !todo.isDone)
          .map((todo) => li(TodoItem(todo)))
      )
    ),
    div(h2("Done List"), () =>
      ul(
        todos.val
          .filter((todo) => todo.isDone)
          .map((todo) => li(TodoItem(todo)))
      )
    ),
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
