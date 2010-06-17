function getNumberOfTickets(rule) {
  var tickets = null;
  $.ajax({
    url: "https://leapfile.zendesk.com/rules/"+rule+".json",
    async: false,
    dataType: 'json',
    success: function(json){
      tickets = json.length;
    }
  });
  return tickets;
  // $.getJSON("https://leapfile.zendesk.com/rules/"+list.rule+".json", list, function(json){
    // $('#working').append("Working Tickets ("+json.length+")");
    // $('#main').after('<li><a href="#" id="'+list.name+'">'+list.display+' ('+json.length+')');
  // });
};