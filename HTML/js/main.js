
var now_time;
var search_history = [];
var draggers;


function touchprep(myElement)
{
	var mc = new Hammer(myElement, {
	inputClass: Hammer.SUPPORT_POINTER_EVENTS ? Hammer.PointerEventInput : Hammer.TouchInput
	});
	mc.on("panleft panright tap press", function(ev) {
	if(ev.type == "tap" || ev.type == "panleft")
	{
		console.log (ev.type + "-"+ myElement.children[1]);
		myElement.children[0].style.background = "rgba(255, 255, 255, 0.2)";
		myElement.children[1].style.opacity = 1;
	}
	else if(ev.type == "panright")
	{
		myElement.children[0].style.background = "rgba(255, 255, 255, 0)";
		myElement.children[1].style.opacity = 0;
	}

  
 });
}


function update_history()
{

	var formatted_list;
	for (var i=0; i<search_history.length; i++)
	{
		 search_history[i].listid = i;
		 if(i==0) formatted_list = stylelist_item(i);
		 else
			formatted_list += stylelist_item(i);
	}

	 if (search_history.length >0){
		document.getElementById("history").innerHTML = formatted_list;
		document.getElementById("history").style.display = "block";
		
		draggers = document.getElementById("history").children;
		for (var i=0; i<draggers.length; i++)
		{
			touchprep(draggers[i]);
		}
	}
	else
		document.getElementById("history").style.display = "none";
}


function stylelist_item(i)
{
	var str = "<div><a><span>"+search_history[i].txt+"</span><span>"+search_history[i].tim+"</span></a><a class='del-history' onclick='killer("+search_history[i].listid+")'><img src='img/delete.svg'></a></div>"
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

