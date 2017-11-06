
var now_time;
var search_history = [];
var trash_btns;

function update_history()
{

	var formatted_list;// = "<div>" +  search_history[0].txt +" - "+ search_history[0].tim +"</div>";
	for (var i=0; i<search_history.length; i++)
	{
		 search_history[i].listid = i;
		 if(i==0) formatted_list = stylelist_item(i);
		 else
			formatted_list += stylelist_item(i);
	}

	document.getElementById("history").innerHTML = (search_history.length >0)? formatted_list:'';
	 
}


function stylelist_item(i)
{
	var str = "<div><a><span>"+search_history[i].txt+"</span><span>"+search_history[i].tim+"</span></a><a class='del-history' onclick='killer("+search_history[i].listid+")'><img src='img/search.svg'></a></div>"
	return str;
}

function killer (n){
	search_history.splice(n, 1);
	update_history();
}



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
		search_history.unshift({txt:selection.poi.name, tim:now_time, listid:0});
	  	update_history();
	});

	document.getElementById("search-zone").style.opacity = 1;
	
});

