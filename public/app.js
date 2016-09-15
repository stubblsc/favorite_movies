// function to search the omdb
function search_omdb(title){
  // get search results
  $.get("http://www.omdbapi.com/?s=" + title, function(data){
    // initialize result string
    result = ''
    // check if response good
    if(data["Response"] == 'True'){
      // loop through each movie and add to result string
      $.each(data['Search'],function(key,value){
        result += "<p>"+ key + ") " + '<a onclick="search_omdb_id(\'' + value['imdbID'] + '\')">' + value['Title'] +"</a></p>";
      });
    }
    // post result to the page
    $("#result").html(result);
  });
}

// function to get movie from omdb by id
function search_omdb_id(id){
  $.get("http://www.omdbapi.com/?i=" + id, function(data){
    var result = ''
    $.each(data,function(key,value){
      if(key != 'Response'){
        result += "<p>" + key + " : " + value +"</p>"
      }
    })
    $("#result").html(result)
  })
}

// set onclick function for search button
$(function(){
  $('#search-btn').click(function(){
    var search_term = $('#search-form').val()
    if(search_term == ''){
      alert('Search form can\'t be blank')
    }else{
      search_omdb(search_term)
    }
  })
})
