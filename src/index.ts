import van from "vanjs-core";
import XIcon from "./assets/X.svg";

const { form, div, input, button, ul, li, label, h2, img } = van.tags;

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

  const handleDeleteTodo = (e: InputEvent) => {
    todos.val = todos.val.filter((x) => x.id !== id);
  };

  return div(
    { class: "flex items-center gap-4 rounded-2xl p-2" },
    input({
      type: "checkbox",
      checked: todo?.isDone ?? false,
      id: `todo-${id}`,
      onchange: handleCheckTodo,
      class: "checkbox",
    }),
    label(
      { for: `todo-${id}`, class: "grow flex-shrink truncate" },
      todo?.title ?? ""
    ),
    button(
      {
        onclick: handleDeleteTodo,
        class: "btn btn-sm btn-circle hover:btn-error",
      },
      img({ src: XIcon, class: "w-4 h-4 text-white" })
    )
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
    {
      class:
        "flex flex-col gap-8 max-w-lg mx-auto px-4 py-4 h-full overflow-y-hidden",
    },
    div(
      { class: "grow overflow-y-auto" },
      div(
        { class: "flex flex-col gap-4" },
        h2({ class: "text-2xl font-bold" }, "Todo List"),
        () =>
          ul(
            { class: "flex flex-col gap-2" },
            todos.val
              .filter((todo) => !todo.isDone)
              .map((todo) => li(TodoItem(todo)))
          )
      ),
      div(
        { class: "flex flex-col gap-4" },
        h2({ class: "text-2xl font-bold" }, "Done List"),
        () =>
          ul(
            todos.val
              .filter((todo) => todo.isDone)
              .map((todo) => li(TodoItem(todo)))
          )
      )
    ),
    form(
      { onsubmit: handleTodoSubmit, class: "flex flex-row items-center gap-2" },
      input({
        class: "input input-bordered grow flex-shrink",
        type: "text",
        value: newTodoTitle,
        placeholder: "Add new todo...",
        oninput: (e: Event) =>
          (newTodoTitle.val = (e.target as HTMLInputElement).value),
      }),
      button({ type: "submit", class: "btn" }, "追加")
    )
  );
};

van.add(document.body, App());
