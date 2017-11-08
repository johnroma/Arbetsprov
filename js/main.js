var now_time;
var search_history = [];
var draggers;
var listn4kill = true;


// handling of touch events for search-history
function touchprep(myElement) {
	var mc = new Hammer(myElement, { inputClass: Hammer.SUPPORT_POINTER_EVENTS ? Hammer.PointerEventInput : Hammer.TouchInput });
	mc.on("panleft panright tap press", function(ev) {

		if (ev.type == "tap") {
			myElement.children[0].style.background = "rgba(255, 255, 255, 0.2)";
		} else if (ev.type == "panleft") {
			myElement.children[0].style.background = "rgba(255, 255, 255, 0.2)";
			myElement.children[1].style.display = "block";
			listn4kill = true;
		} else if (ev.type == "panright") {
			myElement.children[0].style.background = "rgba(255, 255, 255, 0)";
			myElement.children[1].style.display = "none";
			listn4kill = false;
		}

	});
}


// formatting of search-history invoked after every search and every delete
function update_history() {

	var formatted_list;
	for (var i = 0; i < search_history.length; i++) {
		search_history[i].listid = i;
		if (i == 0) formatted_list = stylelist_item(i);
		else
			formatted_list += stylelist_item(i);
	}

	if (search_history.length > 0) {
		document.getElementById("history").innerHTML = formatted_list;
		document.getElementById("history").style.display = "block";

		draggers = document.getElementById("history").children;
		for (var i = 0; i < draggers.length; i++) {
			touchprep(draggers[i]);
		}
	} else
		document.getElementById("history").style.display = "none";
}


function stylelist_item(i) {
	var str = "<article><a><h4>" + search_history[i].txt + "</h4><time datetime='"+search_history[i].tim+"'>" + search_history[i].tim + "</time></a><button class='del-history' onclick='killer(" + search_history[i].listid + ")'><img src='img/delete.svg'></button></article>"
	return str;
}


// delete search-history item by removing it from array and refreshing visual list
function killer(n) {
	if (listn4kill) {
		search_history.splice(n, 1);
		update_history();
	}
}


//needed to convert stamp time to local time
function ConvertUTCTimeToLocalTime(UTCDateString) {
	var convertdLocalTime = new Date(UTCDateString);
	var hourOffset = convertdLocalTime.getTimezoneOffset() / 60;

	convertdLocalTime.setHours(convertdLocalTime.getHours() + hourOffset);

	return convertdLocalTime;
}

//ui formatting for stamped time in search history
function timestamp_to_date(timeInMs) {

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

	var formattedDate = year + '-' + month + "-" + day + " " + hrs + ":" + mins;


	return formattedDate
}


$(document).ready(function() {
	var engine = new Bloodhound({
		datumTokenizer: function(d) { return Bloodhound.tokenizers.whitespace(d.value); },
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		remote: {

			url: 'https://api.tomtom.com/search/2/poiSearch/%QUERY.json?key=8z5FWBplukACbwhkk7Pi8FAdQaViLmij&countrySet=SE&typeahead=true',
			wildcard: '%QUERY',

			filter: function(response) { return response.results; }
		}
	});

	engine.initialize();


	$('#searchbox').typeahead({
		hint: true,
		highlight: true,
		minLength: 1
	}, {
		name: 'name',
		displayKey: function(ret) {
			return ret.poi.name;
		},
		source: engine.ttAdapter()
	});


	$('#searchbox').on('typeahead:select', function(event, selection) {

		$('#searchbox').typeahead('val', '');


		now_time = timestamp_to_date(ConvertUTCTimeToLocalTime(Date.now()));
		search_history.unshift({ txt: selection.poi.name, tim: now_time, listid: 0 });
		update_history();
	});


	//In order to detect if user is on touch or Desktop-device, listen to first interaction with input field.. and..
	document.getElementById("searchbox").addEventListener("touchstart", handleStart, false);

	function handleStart(evt) { listn4kill = false; }
	// if on touch device, set start using listn4kill in order to prevent accidental history deletions


	//show search input box when everything i ready
	document.getElementById("search-zone").style.opacity = 1;
});