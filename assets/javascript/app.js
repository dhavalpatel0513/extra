// show alert when page is refreshed
$(document).ready(function() {
    alert("Put In Your Favorite Artist!!");
    search(inputArtist);
    $("#locations").append(`<h4 id="locationsTitle">Event locations:</h4>`);
    searchEvent(inputArtist);
    searchyoutube(inputArtist);
    videoArtist = inputArtist;

  });
  //set variables for artist names
var venueLatitude;
var venueLongitude;
var artistName; 
var contentVisible; //holds true or false value for function to show or hide content


// Google/Youtube video finder AJAX - API

var videoArtist;

$("#search-btn").on("click", function() {
    videoArtist =$("#query").val();
});


var gapikey = 'AIzaSyCKMpw2nmPnon_gkh4EIXnbiAmrZNw-v4M';

$(function() {

    $('#search-form').submit( function(e) {
        e.preventDefault();
    });

});

function searchyoutube(artist) {

    // clear 
    $('#results').html('');
    $('#buttons').html('');
    
    // get form input
    q = $('#query').val();

    $.ajax({
        method: 'GET',
        url: `https://www.googleapis.com/youtube/v3/search?part=snippet,id&q=${artist}&type=video&key=${gapikey}`,
        headers: 'Access-Control-Allow-Origin'
    }).done((data)=>{
        console.log(data);
        var nextPageToken = data.nextPageToken;
            var prevPageToken = data.prevPageToken;
            
            // Log data
            console.log(data);
            
            $.each(data.items, function(i, item) {
                
                // Get Output
                var output = getOutput(item);
                
                // display results
                $('#results').append(output);
            });
            
            var buttons = getButtons(prevPageToken, nextPageToken);
            
            // Display buttons
            $('#buttons').append(buttons);
    });
 };

// Next page function
function nextPage() {
    var token = $('#next-button').data('token');
    var q = $('#next-button').data('query');
    
    
    // clear 
    $('#results').html('');
    $('#buttons').html('');
    
    // get form input
    q = $('#query').val();  
    
    // run get request on API
    $.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet,id&q=${videoArtist}&type=video&key=${gapikey}`, {
            part: 'snippet, id',
            q: q,
            pageToken: token,
            type: 'video',
            key: gapikey
        }, function(data) {
            
            var nextPageToken = data.nextPageToken;
            var prevPageToken = data.prevPageToken;
            
            // Log data
            console.log(data);
            
            $.each(data.items, function(i, item) {
                
                // Get Output
                var output = getOutput(item);
                
                // display results
                $('#results').append(output);
            });
            
            var buttons = getButtons(prevPageToken, nextPageToken);
            
            // Display buttons
            $('#buttons').append(buttons);
        });    
};

// Previous page function
function prevPage() {
    var token = $('#prev-button').data('token');
    var q = $('#prev-button').data('query');
    
    
    // clear 
    $('#results').html('');
    $('#buttons').html('');
    
    // get form input
    q = $('#query').val();
    
    // run get request on API
    $.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet,id&q=${videoArtist}&type=video&key=${gapikey}`, {
            part: 'snippet, id',
            q: q,
            pageToken: token,
            type: 'video',
            key: gapikey
        }, function(data) {
            
            var nextPageToken = data.nextPageToken;
            var prevPageToken = data.prevPageToken;
            
            // Log data
            console.log(data);
            
            $.each(data.items, function(i, item) {
                
                // Get Output
                var output = getOutput(item);
                
                // display results
                $('#results').append(output);
            });
            
            var buttons = getButtons(prevPageToken, nextPageToken);
            
            // Display buttons
            $('#buttons').append(buttons);
        });    
};

// Build output
function getOutput(item) {

    var videoID = item.id.videoId;
    var title = item.snippet.title;
    var description = item.snippet.description;
    var thumb = item.snippet.thumbnails.high.url;
    var channelTitle = item.snippet.channelTitle;
    var videoDate = item.snippet.publishedAt;
    
    // Build output string
    var output = 	'<li>' +
                        '<div class="list-left">' +
                            '<img src="' + thumb + '">' +
                        '</div>' +
                        '<div class="list-right">' +
                            '<h3><a data-fancybox-type="iframe" class="fancyboxIframe" href="https://youtube.com/embed/' + videoID + '?rel=0" target="new">' + title + '</a></h3>' +
                            '<small>By <span class="cTitle">' + channelTitle + '</span> on ' + videoDate + '</small>' +
                            '<p>' + description + '</p>' +
                        '</div>' +
                    '</li>' +
                    '<div class="clearfix"></div>' +
                    '';
    return output;
};

function getButtons(prevPageToken, nextPageToken) {
    if(!prevPageToken) {
        var btnoutput = 	'<div class="button-container">' +
                                '<button id="next-button" class="paging-button" data-token="' + nextPageToken + '" data-query="' + q + '"' +
                                    'onclick = "nextPage();">Next Page</button>' +
                            '</div>';
    } else {
        var btnoutput = 	'<div class="button-container">' +
                                '<button id="prev-button" class="paging-button" data-token="' + prevPageToken + '" data-query="' + q + '"' +
                                    'onclick = "prevPage();">Prev Page</button>' +            
                                '<button id="next-button" class="paging-button" data-token="' + nextPageToken + '" data-query="' + q + '"' +
                                    'onclick = "nextPage();">Next Page</button>' +
                            '</div>';        
    }
    
    return btnoutput;
};




// Last.fm AJAX - API

function search(artist) {
    
// Querying  api for the input artist
var inputArtist;

var queryURL = 'http://ws.audioscrobbler.com/2.0/?method=album.search&album=' + artist + '&api_key=4b65d4702229dfc7814d6f12bc1000d6&format=json';
    $.ajax({
        url: queryURL,
        method: "GET"
    }).done(function(response) {
        contentVisible = true;
        showOrHide();
        // Printing the entire object to console
        console.log(response);


       // artistName = $("<h1>").text(response.results.albummatches.album[0].artist);
        artistName = $("<h1>").text(response.results.albummatches.album[0].artist);
        
        var name = $("<h2>").text(response.results.albummatches.album[0].name);
        var artistURL = $("<a>").attr("href",response.results.albummatches.album[0].url).append(artistName);
        var artistImage = $("<img>").attr("src", response.results.albummatches.album[0]);
        
        // Empty the contents of the artist-div, append the new artist content
        $("#dataDrop1").empty();
        $("#dataDrop1").append(artistURL, artistImage);
        
      });
  };
  
     $("#search-btn").on("click", function(event) {
        event.preventDefault();
        var inputArtist =$("#query").val().trim();
        console.log(inputArtist);
        search(inputArtist);
        
         //clearing events div and appending title
        $("#locations").empty();
        $("#locations").append(`<h4 id="locationsTitle">Event locations:</h4>`);
        searchEvent(inputArtist);
        searchyoutube(inputArtist);
        
  });


 function searchEvent(artist) {

    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"

$.ajax({
    url: queryURL,
    method: "GET"

}).done(function(response) {
    contentVisible = true;
    showOrHide();
    console.log(response);

    var eventInfo;
    var eventDate;
    var mapLink;
    var eventDateFormat;
    var getTickets;
    var TicketLink = $("<a>")
    

        for (var index = 0; index < response.length; index++) {
        
        venueName = response[index].venue.name;
        eventDate = response[index].datetime;
        venueCity = response[index].venue.city;
        venueCountry = response[index].venue.country;
        getTickets = response[index].url;
        TicketLink.attr("href",getTickets);
        TicketLink.html(getTickets);
        venueLatitude = parseFloat(response[index].venue.latitude);
        venueLongitude = parseFloat(response[index].venue.longitude);
        eventDateFormat = moment(eventDate).format("MMMM DD YYYY HH:mm");


        eventInfo1 = (`<h4> Country: ${venueCountry} </h4>`);
        eventInfo2 = (`<h4> City: ${venueCity}</h4>`);
        eventInfo3 = (`<h4> Venue Name: ${venueName} </h4>`);
        eventInfo4 =(`<h4> Date: ${eventDateFormat} </h4>`);
        eventInfo5 =(`<h4> Ticket Link: ${getTickets} </h4>`);
       
        //appending events   
        $("#locations").append(eventInfo1,eventInfo2,eventInfo3,eventInfo4,eventInfo5);

        // creating map buttons  
        var mapBtn = $("<button>").text("See it on map");
        mapBtn.addClass("map-btn");
        mapBtn.attr('data-lat', venueLatitude);
        mapBtn.attr('data-long', venueLongitude);
        $("#locations").append(mapBtn);


        
        }; // loop closing
            
            //function to show a specific map for each button 
            $(".map-btn").on("click", function(){
            const lat = $(this).attr('data-lat')
            const long = $(this).attr('data-long');

            initMap(+lat, +long);

            }); 
    
            // what happens if the artist has no upcoming events
            if (response.length === 0) {
            $("#locations").empty();
            $("#locations").html(`<h3 id="locationsTitle">This band has no upcoming events but you can check out their amazing videos below</h3>`);
        };

    })
     
     // function to deal with empty input 
     .fail(function(){
    contentVisible = false;
    showOrHide();
    
    $("#dataDrop1").empty();
    // $("#dataDrop2").empty();
    $("#dataDrop1").html(`<h3 id="failArtist">Artist not found</h3>`);
    $("#locations").empty();
    });
    


};


//Map function
      function initMap(latitude = 39.7392, longitude = -104.9903){
          
        // Map Options
        var mapOptions = {
          zoom: 15,
          center: {lat: latitude, lng: longitude}
        }

        //New map
        var map = new google.maps.Map(document.getElementById('maps'), mapOptions);
          
        //New Marker
         var marker = new google.maps.Marker({
          position: {lat: latitude, lng: longitude},
          map: map
        });

      }    
  
// function to hide all content if there is no input or no artist found 
 function showOrHide() {

     if (contentVisible == false) {

        $("#events").hide();
        $("#dataDrop3").hide();
    }

    if (contentVisible == true) {
        $("#events").show();
        $("#dataDrop3").show();
    }

}; 




  



 


