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
    };
};

function getNumberOfTickets(view) {
  return localStorage.getObject(view).length; 
};

function refreshTickets(view) {
    $.getJSON("https://leapfile.zendesk.com/rules/"+view.rule+".json", function(json){
        localStorage.setObject(view.shortname, json);
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
    views.map(function(a){
       getTickets(a);
    });
    console.log(arr);
    setTimeout(setTicketNumber(arr[2].shortname), 3000);
    console.log("Updating");
};

function setTicketNumber(view) {
    chrome.browserAction.setBadgeText({
        text: getNumberOfTickets(view).toString()
    });
    console.log("Setting Ticket")
}