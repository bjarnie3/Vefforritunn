document.addEventListener('DOMContentLoaded',function() {
  Forum.init();
});
/**
 * Virkni fyrir spjallborÃ°. Geymum fÃ¦rslur Ã­ fylki Ã¾ar sem hver fÃ¦rsla er
 * {
 *    name: 'Nafn',
 *    text: 'Texti',
 *    replies: [
 *      {
 *        name: 'Nafn 2',
 *        text: 'Texti 2'
 *      },
 *      ...
 *    ]
 *  }
 */
var Forum = (function() {

  /**
   * Lykill fyrir localstorage, geymum *allar* fÃ¦rslur undir Ã¾essum lykli Ã­
   * fylki sem er breytt Ã­ JSON streng meÃ° JSON.stringify() og til baka Ã­ fylki
   * meÃ° JSON.parse()
   */
  var LOCALSTORAGE = 'forum';

  /**
   * Inngangur Ã­ forrit, viljum:
   *  1. Athuga hvort viÃ° eigum vistuÃ° gÃ¶gn Ã­ localStorage, ef svo er,
   *     hlaÃ°a Ã¾eim inn (yfir allt sem er til staÃ°ar nÃº Ã¾egar)
   *  2. Ef engin gÃ¶gn, finna gÃ¶gn sem eru nÃº Ã¾egar til staÃ°ar og vista Ã¾au Ã­
   *     localStorage
   *  3. Binda event handlera viÃ° nÃ½ja fÃ¦rslu form og nÃ½tt svar form
   *  4. Binda "takmarkara" viÃ° alla reiti
   *
   * Ãžegar nÃ½ fÃ¦rsla eÃ°a nÃ½tt svar er bÃºiÃ° til, er gÃ³Ã° leiÃ° aÃ° finna _allar_
   * fÃ¦rslur og svÃ¶r Ãºr DOM og vista Ã¾aÃ°, getum Ã¾Ã¡ samnÃ½tt fall Ãºr 1. Ã­ Ã¾aÃ° og
   * losnum viÃ° tvÃ¶falt bÃ³khald, eitt Ã­ DOM og annaÃ° Ã­ kÃ³Ã°a.
   */
  function init() {

    var newEntryForm = document.getElementById('new-entry');
    newEntryForm.addEventListener('submit', newEntryHandler);

    var entries = localStorage.getItem(LOCALSTORAGE);

    if (entries)
    {
      clearEntries();
      entriesArray = JSON.parse(entries);
      for (var i = 0; i < entriesArray.length; i++){

        var repliesNodes = addEntry(entriesArray[i].name, entriesArray[i].text);

        for (var j = 0; j < entriesArray[i].replies.length; j++){
          addReply(repliesNodes, entriesArray[i].replies[j].name,entriesArray[i].replies[j].text);
        }

      }

    }else{
      save(LOCALSTORAGE, parseEntries());
    }

  }

  function clearEntries(){
    var entries = document.querySelector('.entries');
    while ( entries.hasChildNodes() ){
      entries.removeChild(entries.lastChild);
    }
  }

  /**
   * Finnur svÃ¶r viÃ° fÃ¦rslum Ãºr DOMi
   *
   * @param {node} element DOM element fyrir fÃ¦rslum
   *
   * @return {array} Fylki af svÃ¶rum, tÃ³mt ef engin svÃ¶r
   */
  function parseReplies(element) {

    var repliesNode = element.querySelectorAll('.replies-node .row');

    var repliesArray = new Array();

    for (var i=0; i < repliesNode.length; i++)
    {
      var name = repliesNode[i].querySelector('.col-xs-12 .panel .panel-heading h3').textContent;
      var text = repliesNode[i].querySelector('.col-xs-12 .panel .panel-body').textContent;
      var reply = {};
      reply.name = name;
      reply.text = text;
      repliesArray.push(reply);
    }

    return repliesArray;

  }


  /**
   * Finnur nÃºverandi fÃ¦rslur Ã¡ sÃ­Ã°u og skilar Ã­ gagnastrÃºktÃºr
   *
  * @return {array} Fylki af fÃ¦rslum Ã¡ nÃºverandi sÃ­Ã°u Ã­ gagnastrÃºktÃºr
   */
  function parseEntries() {

    var entries = document.querySelectorAll('.entry-node');
    var entriesArray = new Array();

    for (var i = 0; i < entries.length; i++){
      var name = entries[i].querySelector('.row .col-xs-12 h2').textContent;
      var text = entries[i].querySelector('.row .col-xs-12 p').textContent;
      var entry = {};
      entry.name = name;
      entry.text = text;
      entry.replies = parseReplies(entries[i]);
      entriesArray.push(entry);
    }

    return entriesArray;

  }

  /**
   * BÃ¦tir nÃ½rri fÃ¦rslu viÃ° DOM
   *
   * @param {string} name Nafn fyrir fÃ¦rslu
   * @param {string} text Texti Ã¡ fÃ¦rslu
   *
   * @return {node} DOM element fyrir replies-node
   */
  function addEntry(name, text) {

    var entriesNode = document.querySelector('.entries');

    var entryNode = document.createElement('div');
    entryNode.classList.add('entry-node');

    var row = document.createElement('div');
    row.classList.add('row');

    var col = document.createElement('div');
    col.classList.add('col-xs-12');

    var nameElement = document.createElement('h2');
    nameElement.appendChild(document.createTextNode(name));

    var textElement = document.createElement('p');
    textElement.appendChild(document.createTextNode(text));

    var repliesNode = document.createElement('div');
    repliesNode.classList.add('replies-node');

    col.appendChild(nameElement);
    col.appendChild(textElement);

    row.appendChild(col);
    entryNode.appendChild(row);
    entryNode.appendChild(repliesNode);

    entriesNode.appendChild(entryNode);

    entryNode.appendChild(createReplyForm());

    return repliesNode;

  }


  /**
   * BÃ¦tir nÃ½ju svari viÃ° DOM undir repliesNode
   *
   * @param {string} name Nafn fyrir svar
   * @param {string} text Texti Ã¡ svar
   */
  function addReply(repliesNode, name, text) {

    var row = document.createElement('div');
    row.classList.add('row');

    var col = document.createElement('div');
    col.classList.add('col-xs-12');

    var panel = document.createElement('div');
    panel.classList.add('panel', 'panel-success');

    var panelHeading = document.createElement('div');
    panelHeading.classList.add('panel-heading');

    var nameElement = document.createElement('h3');
    nameElement.classList.add('panel-title');
    nameElement.appendChild(document.createTextNode(name));

    var textElement = document.createElement('div');
    textElement.classList.add('panel-body');
    textElement.appendChild(document.createTextNode(text));

    panelHeading.appendChild(nameElement);
    panel.appendChild(panelHeading);
    panel.appendChild(textElement);
    col.appendChild(panel);
    row.appendChild(col);

    repliesNode.appendChild(row);

  }


  /**
   * Event handler fyrir nÃ½ja fÃ¦rslu. BÃ¦tir nÃ½rri fÃ¦rslu viÃ° DOM.
   * Setur nafn Ã­ alla aÃ°ra input reiti
   *
   * @param {object} e Event frÃ¡ formi
   */
  function newEntryHandler(e) {
    e.preventDefault();
    var name = e.target.elements["name"].value;
    var text = e.target.elements["text"].value;
    addEntry(name, text);

  }
  /**
   * BÃ½r til DOM trÃ© fyrir reply form. NÃ½tir createFormGroup fall til aÃ° bÃºa til
   * input, bÃ¦tir viÃ° takka meÃ° icon.
   * Hint: Til aÃ° laga spacing mÃ¡l er nÃ³g aÃ° bÃ¦ta viÃ° ' ' Ã¡ eftir form-group
   *
   * @return {node} DOM node fyrir reply form
   */
  function createReplyForm() {
    var form = document.createElement('form');
    var row = document.createElement('div');
    row.classList.add('row');

    form.appendChild(createFormGroup('Nafn', 'name'));
    form.appendChild(createFormGroup('Svar', 'text'));

    var button = document.createElement('button');
    var icon = document.createElement('i');
    icon.classList.add('glyphicon', 'glyphicon-pencil');

    button.appendChild(icon);
    button.classList.add('btn', 'btn-primary');
    button.type="submit";

    var buttonContainer = document.createElement('div');
    buttonContainer.classList.add('col-lg-2');

    buttonContainer.appendChild(button);

    button.appendChild(document.createTextNode('Svara'));
    form.appendChild(buttonContainer);
    row.appendChild(form);

    form.addEventListener('submit', newReplyHandler);


    return row;
  }

  /**
   * BÃ½r til DOM trÃ© fyrir form group.
   *
   * @param {string} label Label Ã¡ form
   * @param {string} name Nafn Ã¡ input
   *
   * @return {node} DOM node fyrir form group
   */
  function createFormGroup(label, name) {
    var col = document.createElement('div');
    col.classList.add('col-lg-2');

    var input = document.createElement('input');
    input.classList.add('form-control');
    input.type = "text";
    input.placeholder = label;
    input.name = name;
    input.autocomplete = "off";

    col.appendChild(input);

    return col;
  }

  /**
   * Event handler fyrir nÃ½tt svar. BÃ¦tir nÃ½rri fÃ¦rslu viÃ° DOM ÃºtfrÃ¡ e.target
   * Setur nafn Ã­ alla aÃ°ra input reiti
   *
   * @param {object} e Event frÃ¡ formi
   */
  function newReplyHandler(e) {

    e.preventDefault();
    var name = e.target.elements["name"].value;
    var text = e.target.elements["text"].value;
    var entryNode = e.target.parentNode.parentNode;
    var repliesNode = entryNode.querySelector('.replies-node');

    addReply(repliesNode, name, text);


  }

  /**
   * Vistar fÃ¦rslur Ã¡Â­ localStorage.
   *
   * @param {string} key Lykill sem viÃ° notum Ã¡ localStorage
   * @param {array} Fylki af fÃ¦rslum til aÃ° vista
   */
  function save(key, items) {

    var oldEntries = localStorage.getItem(key);
    var entriesArray = new Array();

    if (oldEntries)
      entriesArray = JSON.parse(oldEntries);

    for (var i = 0; i < items.length; i++){

      entriesArray.push(items[i]);

    }

    localStorage.setItem(key, JSON.stringify(entriesArray));

  }

  /**
   * SÃ¦kir fÃ¦rslur Ãºr localStorage og skilar Ã­ fylki
   *
   * @param {string} key Lykill sem viÃ° notum Ã­ localStorage
   *
   * @return {array} Fylki af fÃ¦rslum Ã­ localStorage ef einhverjar
   * @return {null} Ef engin fÃ¦rsla til staÃ°ar Ã­ localStorage
   */
  function load(key) {
  }

  /**
   * Event handler fyrir skrif Ã­ box, leyfir ekki aÃ° skrifa ef stafir eru fleiri
   * en maxChars og birtir Ã¾Ã¡ skilaboÃ° um Ã¾aÃ°.
   * Hint: Getum notaÃ° constrainText.bind(null, 100) Ã­ addEventListener
   *
   * @param {number} maxChars HÃ¡mark stafa sem mÃ¡ vera
   * @param {object} e Event frÃ¡ formi
   */
  function constrainText(maxChars, e) {
    var input= e.target.value;
    if (input.length>maxChars){
      alert('Of margir stafir.');
      e.target.value=e.target.value.subset(0, maxChars);
      e.preventDefault();
    }

  }

  function setName(name) {
    var nameInputs = document.querySelectorAll('[name="name"]');

    for(var i = 0; i<nameInputs.length; i++) {
      nameInputs[i].value = name;
    }
  }

  return {
    init: init
  };
})();