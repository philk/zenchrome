// Taken from http://stackoverflow.com/questions/2010892/storing-objects-in-html5-localstorage/2010994#2010994
Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
};

Storage.prototype.getObject = function(key) {
    return JSON.parse(this.getItem(key));
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

function getNumberOfTickets(view) {
    return localStorage.getObject(view).length;
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

function delViewById(viewId){
    var views = localStorage.getObject("views");
    views.splice(viewId, viewId);
    localStorage.setObject("views", views);
};

function getAllTickets(){
    var views = localStorage.getObject("views");
    console.log(views);
    views.map(refreshView);
    setTimeout(setTicketNumber(views[0].viewName), 5000);
    console.log("Updating All");
};

function setTicketNumber(view) {
    chrome.browserAction.setBadgeText({
        text: getNumberOfTickets(view).toString()
    });
    console.log("Setting Ticket")
};

function addRow(view){
    console.log("Adding...");
    var rowId = $("#rules_table tbody tr").length;
    if (view == undefined) {
        $("#rules_table tbody").append('<tr id="row'+rowId+'"><td class="dragHandle"></td><td><input type="text" class="input_display" id="inputName'+rowId+'" value=""></td><td><input type="text" class="input_rule" id="inputNumber'+rowId+'" value=""></td><td><a href="#" onClick=\'delRow('+rowId+');\'><img src="img/list-remove.png"/></a></td></tr>');
    }else{
        $("#rules_table tbody").append('<tr id="row'+rowId+'"><td class="dragHandle"></td><td><input type="text" class="input_display" id="inputname'+rowId+'" value="'+view.viewName+'"></td><td><input type="text" class="input_rule" id="inputNumber'+rowId+'" value="'+view.viewNumber+'"></td><td><a href="#" onClick=\'delRow('+rowId+');\'><img src="img/list-remove.png"/></a></td></tr>');
    };
};

function delRow(row){
    var viewName = $('#inputName'+row).val();
    console.log(viewName);
    if (viewName != undefined) {
        console.log("View Exists")
        delViewById(row);
    };
    $('#row'+row).remove();
};