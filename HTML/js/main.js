
var now_time;
var search_history = [];

function update_history()
{
	
	
	var formatted_list = search_history[0].txt +" - "+ search_history[0].tim +"<br>";
	for (var i=1; i<search_history.length; i++)
	{

		 formatted_list += search_history[i].txt +" - "+ search_history[1].tim +"<br>";

		
	}


	document.getElementById("history").innerHTML = formatted_list;
}

//timeInMs = Date.now();

now_time = timestamp_to_date(Date.now())
function timestamp_to_date(timeInMs)
{
	
	var date = new Date(timeInMs);
	var year = date.getUTCFullYear();
	var month = date.getUTCMonth();
	var day = date.getUTCDate();
	var hrs = date.getHours();
	var mins = date.getMinutes();
	
	year = year.toString();
	month = ("0" + (month + 1)).slice(-2);
	day = ("0" + (day + 1)).slice(-2);
	hrs = ("0" + (hrs + 1)).slice(-2);
	mins = ("0" + (mins + 1)).slice(-2);

	var formattedDate = year + '-' + month + "-" + day + " " + hrs + ":" + mins ;
 

	return formattedDate
}


$(document).ready(function()
{
  var engine = new Bloodhound(
  {
	datumTokenizer: function(d) { return Bloodhound.tokenizers.whitespace(d.value); },
	queryTokenizer: Bloodhound.tokenizers.whitespace,
	remote:
		{

			url: 'https://api.tomtom.com/search/2/poiSearch/%QUERY.json?key=8z5FWBplukACbwhkk7Pi8FAdQaViLmij&countrySet=SE&typeahead=true',
			wildcard: '%QUERY',             
			
			//url: "http://vocab.nic.in/rest.php/country/json",
			filter: function(response) { return response.results; }
		}
  });

	engine.initialize();
	
	
	$('#searchbox').typeahead(
	{
		hint: true,
		highlight: true,
		minLength: 1
	  }, 
	  {
	  name: 'name',
	  displayKey: function(ret) {
		return ret.poi.name;        
	  },
	  source: engine.ttAdapter()
	});


	$('#searchbox').on('typeahead:select', function(event, selection) {

	  $('#searchbox').typeahead('val', '');

		now_time = timestamp_to_date(Date.now());
		search_history.unshift({txt:selection.poi.name, tim:now_time});
	  	update_history();
	});

	document.getElementById("search-zone").style.opacity = 1;
	
});


/*
$('.typeahead').on('keydown', function(e) {
  if (e.keyCode == 13) {
    var ta = $(this).data('typeahead');
    var val = ta.$menu.find('.active').data('value');
    if (!val)
      $('#your-form').submit();
  }
}
*/