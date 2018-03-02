// Truncate String Function
function truncateString(myString, limit) {
  const shortened = myString.indexOf(' ', limit);
  if (shortened == -1) return myString;
  return myString.substring(0, shortened);
}

// Call reddit API through Ajax
function ajaxReq(query, limit, sortby, time) {
  $.ajax({
    url: "https://www.reddit.com/search.json?q=" + query + "&limit=" + limit + "&sort=" + sortby + "&t=" + time,
    type:"GET",
    dataType:"JSON"
  }).then(function(res) {

    $('#entries table tbody').html('');
    $('#entries .records-count span').html(res.data.children.length);

    for (var i = 0; i < res.data.children.length; i++) {
      var subreddit_data = res.data.children[i].data.subreddit;
      var subreddit = '<td><a href="https://www.reddit.com/r/' + subreddit_data + '" target="_blank">' + subreddit_data + '</a></td>';

      var upvotes = '<td class="votes"><i class="fas fa-arrow-up"></i> ' + res.data.children[i].data.ups;
      var downvotes = res.data.children[i].data.downs + ' <i class="fas fa-arrow-down"></i></td>';
      var votes = upvotes + ' / ' + downvotes;

      var nsfw_data = res.data.children[i].data.over_18;
      var nsfw = '<td>' + nsfw_data + '</td>';

      var post_url_data = res.data.children[i].data.url;
      var title_data = res.data.children[i].data.title;
      var media = '<td><a href="' + post_url_data + '" target="_blank">' + truncateString(title_data, 80) + '</a></td>';

      $('#entries table tbody').append('<tr>'
      + media
      + votes
      + nsfw
      + subreddit
      + '</tr>');
    }

    if (res.data.children.length == 0) {
      $('#entries table tbody').html('<p class="display-4 no-records">Buhuu... No records found. Try again? :)</p>');
    }
    
  }).fail(function(res) {
    console.log("Something gone wrong...");
  });
}

$(document).ready(function() {

  // Run the Ajax function
  ajaxReq("all", "25", "hot", "week");

  // When form is submitted get values
  // from the form fields and run the Ajax call
  $("#search-form").on("submit", function(e) {
    e.preventDefault();

    var query = $(".query").val();
    var limit = $(".limit").val();
    var sortby = $(".sortby").val();
    var time = $(".time").val();

    // Run the Ajax function
    ajaxReq(query, limit, sortby, time);
  });
});
