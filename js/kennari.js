
document.addEventListener('DOMContentLoaded',function() {
  List.init();
});

var List = (function() {

  function init() {
    var form = document.getElementById('form'); // eÃ°a document.querySelector
    var button = form.querySelector('button');
    var list = document.querySelector('.list');

    form.addEventListener('submit', submitHandler);
    addDelete(list);

    var savedData = load('data');

    console.log('Ã¡ vistaÃ°', savedData);
    
    save('data', [1, 2, 3]);
  }

  function submitHandler(e) {
    // ekki submita formi Ã¡ form[action], Ã¦tlum aÃ° hÃ¶ndla sjÃ¡lf
    e.preventDefault();

    var form = e.target;
    var entry = form.querySelector('input[name="entry"]');

    // NÃ½tum aÃ° entry er truthy ef Ã¾aÃ° fannst, annars falsy, pÃ¶ssum upp Ã¡ aÃ°
    // fÃ¡ ekki null reference
    var text = entry ? entry.value : '';

    var node = createEntryNode(text, new Date());
    addDeleteToNode(node);

    var list = document.querySelector('.list');

    list.appendChild(node);

    // hreinsa input
    entry.value = '';

    window.setTimeout(clearNewFromNode.bind(node), 1000);
  }

  // bÃºum til DOM trÃ© fyrir entry
  function createEntryNode(text, date) {
    var entry = document.createElement('li');
    entry.classList.add('item', 'item--new');
    entry.dataset.date = date;

    var dateNode = document.createElement('strong');
    dateNode.classList.add('date')
    dateNode.appendChild(document.createTextNode(formatDate(date)));

    var textNode = document.createElement('span');
    textNode.classList.add('text')
    textNode.appendChild(document.createTextNode(' ' + text));

    entry.appendChild(dateNode);
    entry.appendChild(textNode);

    return entry;
  }


  function clearNewFromNode() {
    var node = this;

    node.classList.remove('item--new');
  }

  function addDelete(list) {
    var nodes = list.querySelectorAll('.item');

    for (var i = 0; i<nodes.length; i++) {
      addDeleteToNode(nodes[i]);
    }
  }

  function addDeleteToNode(node) {
    var deleteNode = document.createElement('form');
    deleteNode.classList.add('form-inline');
    deleteNode.setAttribute('method', 'post');
    deleteNode.setAttribute('action', '');
    deleteNode.addEventListener('submit', deleteHandler.bind(null, node));

    var formGroup = document.createElement('div');
    formGroup.classList.add('form-group');
    var deleteButton = document.createElement('button');
    deleteButton.classList.add('btn', 'btn-warning', 'pull-rightas');
    deleteButton.appendChild(document.createTextNode('EyÃ°a'));
    formGroup.appendChild(deleteButton);
    deleteNode.appendChild(formGroup);

    node.appendChild(deleteNode);
  }

  function deleteHandler(node, e) {
    e.preventDefault();
    node.parentNode.removeChild(node);
  }

  function save(key, value) {
    var jsonValue = JSON.stringify(value);

    window.localStorage.setItem(key, jsonValue);
  }

  function load(key) {
    var data = window.localStorage.getItem(key);

    if (!data) {
      return null;
    }

    return JSON.parse(data);
  }

  /**
   * Birtir Date sem mm.dd.yyyy hh:mm
   */
  function formatDate(s) {
    var date = new Date(s);

    if (isNaN(date)) {
      return '';
    }

    function zeropad(n) {
      return n.toString().length === 1 ? '0' + n : n.toString();
    }

    return zeropad(date.getDate()) + '.' +
           zeropad(date.getMonth() + 1) + '.' +
           date.getFullYear() + ' ' +
           zeropad(date.getHours()) + ':' +
           zeropad(date.getMinutes());
  }

  return {
    init: init
  }
})();