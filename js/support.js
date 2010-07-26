// Taken from http://stackoverflow.com/questions/2010892/storing-objects-in-html5-localstorage/2010994#2010994
Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
};

Storage.prototype.getObject = function(key) {
    return JSON.parse(this.getItem(key));
};
// --

// Borrowed from http://www.mediacollege.com/internet/javascript/text/case-capitalize.html
String.prototype.capitalize = function(){
    return this.charAt(0).toUpperCase() + this.slice(1);
};
// --

function initializeExt(){
    if (localStorage.views == undefined) {
        console.log("No Views");
        localStorage.setObject("views", []);
    }else{
        console.log("Views Here");
        getAllTickets();
    };
};

function startPolling(){
    getAllTickets();
    setTimeout(function(){
        startPolling();
    }, 300000);
};

function refreshView(view) {
    console.log("Refreshing: "+view.viewNumber);
    $.getJSON("https://leapfile.zendesk.com/rules/"+view["viewNumber"]+".json", function(json){
        localStorage.setObject(view["viewName"], json);
    });
};

function addView(view){
    var views = localStorage.getObject("views");
    views.push(view);
    localStorage.setObject("views", views);
};

function delView(viewName){
    var views = localStorage.getObject("views");
    views = views.filter(function(element, index, array){
        return (element["viewName"] != viewName);
    });
    localStorage.setObject("views", views);
};

function saveView(viewId, viewName, viewNumber){
    var views = localStorage.getObject("views");
    if (views[viewId] == undefined) { views[viewId] = {}};
    if (viewName) {
        console.log("ViewName");
        views[viewId]["viewName"] = viewName;
    };
    if (viewNumber) {
        console.log("ViewNumber");
        views[viewId]["viewNumber"] = viewNumber;
    };
    console.log(views);
    localStorage.setObject("views", views);
};

function delViewById(viewId){
    var views = localStorage.getObject("views");
    views.splice(viewId, viewId);
    localStorage.setObject("views", views);
};

function getAllTickets(){
    var views = localStorage.getObject("views");
    console.log(views);
    views.map(refreshView);
    setTicketNumber(views[0].viewName);
    console.log("Updating All");
};

function getNumberOfTickets(view) {
    var view = localStorage.getObject(view)
    if (view == null) {
        return "!";
    }else{
        return view.length;
    };
};

function setTicketNumber(viewName) {
    var number = getNumberOfTickets(viewName);
    chrome.browserAction.setBadgeText({
        text: number.toString()
    });
    console.log("Setting Ticket")
};

function addRow(view){
    $(":input").unbind();
    console.log("Adding...");
    var rowId = $("#rules_table tbody tr").length;
    if (view == undefined) {
        $("#rules_table tbody").append('<tr id="row'+rowId+'"><td class="dragHandle"></td><td><input type="text" class="input_display" id="inputName'+rowId+'" value=""></td><td><input type="text" class="input_rule" id="inputNumber'+rowId+'" value=""></td><td><a href="#" onClick=\'delRow('+rowId+');\'><img src="img/list-remove.png"/></a></td></tr>');
    }else{
        $("#rules_table tbody").append('<tr id="row'+rowId+'"><td class="dragHandle"></td><td><input type="text" class="input_display" id="inputname'+rowId+'" value="'+view.viewName+'"></td><td><input type="text" class="input_rule" id="inputNumber'+rowId+'" value="'+view.viewNumber+'"></td><td><a href="#" onClick=\'delRow('+rowId+');\'><img src="img/list-remove.png"/></a></td></tr>');
    };
    $(":input").focusout(fieldUpdated);
};

function delRow(row){
    delViewById(row);
    $('#row'+row).remove();
};

function fieldUpdated(){
    var self = $(this);
    var rowId = parseInt(self.attr("id").match(/\d/));
    console.log($(this));
    console.log(rowId);
    if (self.hasClass("input_display")) {
        saveView(rowId, self.val(), undefined);
        console.log("Name");
    }else if (self.hasClass("input_rule")) {
        saveView(rowId, undefined, self.val());
        console.log("Rule");
    };
};

function refreshPopup(){
    getAllTickets();
};

// Stolen from Yermah plugin
function isZendeskUrl(url) {
    return false;
};

function goToZendesk(rule) {
    var url = 'http://leapfile.zendesk.com/rules/'+rule;
    chrome.tabs.getAllInWindow(undefined, function(tabs) {
      for(var i = 0, tab; tab = tabs[i]; i++) {
        if(tab.url && isZendeskUrl(tab.url)) {
          chrome.tabs.update(tab.id, { selected: true });
          return;
        }
      }
      chrome.tabs.create({url: url});
    });
};
// --