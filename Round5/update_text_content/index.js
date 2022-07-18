var form = document.getElementById('form');
var inp = document.getElementById('type-input');
var outp = document.getElementById('receive-input');

function submitHandler(e) {
  e.preventDefault();
  var text = inp.value;
  if (text.trim() != '') {
    outp.textContent = text;
    inp.value = '';
  }
}

form.addEventListener('submit', submitHandler);
