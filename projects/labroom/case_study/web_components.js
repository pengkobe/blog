;
define(function(require, exports, module) {
    var addBox = document.querySelector('add-box');
    var todoList = document.querySelector('todo-list');

    addBox.addEventListener('add-item', function(e) {
        todoList.addItem(e.detail);
    });
});
