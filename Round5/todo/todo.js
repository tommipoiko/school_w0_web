var form = document.getElementById('form');
var inp = document.getElementById('type-input');
var ul = document.getElementById('todo');

function addListItem(text) {
  var li = document.createElement('li');
  li.appendChild(document.createTextNode(text));
  li.addEventListener('click', listClickHandler);
  ul.appendChild(li);
};

function submitHandler(e) {
  e.preventDefault();
  if (inp.value.trim() != '') {
    addListItem(inp.value);
    inp.value = '';
  }
}

function listClickHandler(e) {
  e.preventDefault();
  if (e.target.classList.contains('done')) {
    e.target.remove();
  } else {
    e.target.classList.add('done');
  }
}

form.addEventListener('submit', submitHandler);
