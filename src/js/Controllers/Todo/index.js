import TodoView from '../../Views/Todo';
import LocalStorage from '../../Models/LocalStorage';

import EventEmitter from '../../Helpers/EventEmitter';

const TODO_START_INDEX = 100;
const DELAY = 0;

class TodoController {
  init() {
    if (!LocalStorage.getIndex()) {
      LocalStorage.setIndex(TODO_START_INDEX);
    }

    TodoView.render(LocalStorage.getTodoList(), LocalStorage.getLanguageObj());

    EventEmitter.subscribe('addTodo', this.onAddTodo);
    EventEmitter.subscribe('removeTodo', this.onRemoveTodo);
    EventEmitter.subscribe('changeDoneStateTodo', (obj) => this.changeDoneStateTodo(obj));
    EventEmitter.subscribe('changeImportantStateTodo', (obj) => this.changeImportantStateTodo(obj));
  }

  onAddTodo(text) {
    const todos = LocalStorage.getTodoList() || [];
    const todo = {
      text,
      important: false,
      done: false,
      index: LocalStorage.increaseIndex(),
    };
    const newTodosList = [...todos, todo];

    LocalStorage.setTodo(newTodosList);
    TodoView.renderSingleTodo(LocalStorage.getLanguageObj(), todo, DELAY);
  }

  onRemoveTodo(index) {
    const newTodosList = LocalStorage.getTodoList().filter(
      (item) => item.index !== parseInt(index, 10),
    );

    LocalStorage.setTodo(newTodosList);

    if (!newTodosList.length) {
      TodoView.setDefaultMsg(LocalStorage.getLanguageObj());
    }
  }

  changeImportantStateTodo(obj) {
    this.changePropertyTodo(LocalStorage.getTodoList(), obj);
  }

  changeDoneStateTodo(obj) {
    this.changePropertyTodo(LocalStorage.getTodoList(), obj);
  }

  changePropertyTodo(todos, { index, propertyName }) {
    const todo = todos.filter((item) => {
      return item.index === parseInt(index, 10);
    });

    todo[0][propertyName] = !todo[0][propertyName];

    LocalStorage.setTodo(todos);
  }
}

export default new TodoController();
