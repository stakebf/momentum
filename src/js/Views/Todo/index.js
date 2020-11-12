import AppView from '../App';
import createNode from '../../Helpers/createNode';
import EventEmitter from '../../Helpers/EventEmitter';

class TodoView {
  todosWrapper = createNode('div', 'todo__wrapper');
  todosList = createNode('ul', 'todo__list');
  todoControls = createNode('div', 'todo__controls');
  addTodoBtn = createNode('button', 'todo__btn-add');
  addTodoInput = createNode('input', 'todo__input-add');

  render(todos, lang) {
    const { messages } = lang;
    this.addTodoInput.setAttribute('type', 'text');
    this.addTodoInput.setAttribute('placeholder', messages.addTodoInput);

    this.addTodoBtn.innerText = messages.addTodoBtn;
    this.todoControls.append(this.addTodoInput, this.addTodoBtn);

    this.todosList.append(...this.renderTodos(todos, lang));

    if (!this.todosList.children.length) {
      this.todosList.classList.add('hidden');

      setTimeout(() => {
        this.todosList.classList.remove('hidden');
      }, 550);
    }

    this.todosWrapper.append(this.todoControls, this.todosList);
    AppView.getContainer().append(this.todosWrapper);

    this.addTodoBtnClickHandler();
    this.addTodoKeydownHandler();
    this.onTodoInputHandle();

    setTimeout(() => {
      this.todoControls.classList.add('todo__controls_visible');
    }, 500);
  }

  onTodoInputHandle = () => {
    this.addTodoInput.addEventListener('input', (e) => {
      if (e.target.value.trim()) {
        this.addTodoBtn.style.background = '#55bf55';
      } else {
        this.addTodoBtn.style.background = 'red';
      }
    });
  }

  renderTodos(todos, lang) {
    if (todos && todos.length) {
      return todos.map((todo, index) => {
        return this.createTodo(lang, todo, index);
      });
    }
    return lang.messages.emptyTodo;
  }

  addTodoKeydownHandler = () => {
    this.addTodoInput.addEventListener('keydown', (e) => {
      if (e.keyCode === 13 || e.which === 13) {
        this.addTodo();
      }
    });
  }

  addTodoBtnClickHandler = () => {
    this.todosWrapper.addEventListener('click', (e) => {
      if (e.target === this.addTodoBtn) {
        this.addTodo();
      }

      if (e.target.classList.contains('todo__item-delete')) {
        const todoItem = e.target.closest('.todo__item');
        EventEmitter.publish('removeTodo', todoItem.dataset.index);
        todoItem.classList.remove('visibleTodo');

        setTimeout(() => {
          todoItem.remove();
        }, 150);
        return;
      }

      if (e.target.classList.contains('todo__item-important')) {
        this.addClassTodo(e, 'changeImportantStateTodo', 'important');
      }

      if (e.target.classList.contains('todo__item-done')) {
        this.addClassTodo(e, 'changeDoneStateTodo', 'done');
      }
    });
  }

  addTodo() {
    if (this.addTodoInput.value.trim().length) {
      EventEmitter.publish('addTodo', this.addTodoInput.value);
      this.addTodoInput.value = '';
      this.addTodoBtn.style.background = 'red';
    } else {
      this.addTodoInput.value = '';
    }
  }

  addClassTodo(e, eventName, propertyName) {
    const todoItem = e.target.closest('.todo__item');

    EventEmitter.publish(eventName, {
      index: todoItem.dataset.index,
      propertyName,
    });

    if (todoItem.classList.contains(propertyName)) {
      todoItem.classList.remove(propertyName);
    } else {
      todoItem.classList.add(propertyName);
    }
  }

  createTodo(lang, {
    important, index, text, done,
  }, delay) {
    const { messages } = lang;
    const importantClass = important ? 'important' : '';
    const doneClass = done ? 'done' : '';
    const classes = [doneClass, importantClass].filter((item) => item !== '');
    const todoItem = createNode('li', 'todo__item', ...classes);
    const todoItemControls = createNode('div', 'todo__item-controls');

    const deleteBtn = createNode('button', 'todo__item-delete');
    deleteBtn.innerText = messages.deleteTodoItem;

    const markAsImportantBtn = createNode('button', 'todo__item-important');
    markAsImportantBtn.innerText = messages.markAsImportantTodo;

    const markAsDone = createNode('button', 'todo__item-done');
    markAsDone.innerText = messages.markAsDoneTodo;

    todoItemControls.append(markAsDone, markAsImportantBtn, deleteBtn);

    setTimeout(() => {
      todoItem.classList.add('visibleTodo');
    }, (delay + 0.5) * 100);

    todoItem.setAttribute('data-index', index);
    todoItem.innerText = text;
    todoItem.append(todoItemControls);

    return todoItem;
  }

  renderSingleTodo(lang, todo, delay) {
    if (!this.todosList.children.length) {
      this.todosList.innerHTML = '';
    }
    this.todosList.append(this.createTodo(lang, todo, delay));
  }

  setDefaultMsg(lang) {
    this.todosList.innerHTML = lang.messages.emptyTodo;
  }
}

export default new TodoView();
