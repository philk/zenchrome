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

function getAllTickets(){
    var views = localStorage.getObject("views");
    console.log(views);
    views.map(refreshView);
    setTimeout(setTicketNumber(views[0].viewName), 3000);
    console.log("Updating All");
};

function setTicketNumber(view) {
    chrome.browserAction.setBadgeText({
        text: getNumberOfTickets(view).toString()
    });
    console.log("Setting Ticket")
};