// function to search the omdb
function search_omdb(search, page){
  // get search results
  $.get("http://www.omdbapi.com/?s=" + search + "&page=" + page.toString(), function(data){
    // initialize result string
    // check if response good
    result = ''
    if(data["Response"] == 'True'){
      // initialize result string with table open and table header
      result += generate_table_html(data['Search'], page, false)
    }
    // post result to the page
    render('result', result)

    // figure out if needs pages
    // get number of results
    var num_pages = parseInt(data['totalResults'])
    // get number of pages
    var pages = Math.ceil(num_pages / 10)
    if(pages > 1){
      // generate and render pagination
      setup_pagination(search, pages, page, false)
    }
  })
}

// generate table
function generate_table_html(data, page, is_favorites){
  // initialize result string with table open and table header
  result = '<table class="table table-condensed table-bordered table-striped"><thead><th></th><th>Title</th>'
  // if not favorites page then add column for year and favorite button
  if(!is_favorites){
    result += '<th>Year</th><th></th>'
  }
  // close table header and start table body
  result += '</thead><tbody>'
  // loop through each movie and add to result string
  $.each(data,function(key,value){
    // generate table row
    result += generate_table_row_html(key, value, page, is_favorites)
  })
  // table end tag
  result += '</tbody></table>'

  // return table html
  return result
}

// generate table row html
function generate_table_row_html(key, value, page, is_favorites){
  // table row start tag
  result = "<tr>"
  // result number column
  result += "<td><p>" + (((page - 1) * 10) + parseInt(key) + 1).toString() + ")</p></td>"
  // result add title as link to full info
  result += '<td><a onclick="search_omdb_id(\'' + value['imdbID'] + '\')">' + value['Title'] +"</a></td>"
  // if not favorites page show year and favorite button
  if(!is_favorites){
    // add year movie was released
    result += '<td><p>' + value['Year'] + '</p></td>'
    // add favorite button
    result += '<td class="text-center"><a class="btn btn-xs btn-primary btn-favorite text-center" onclick="add_favorite(\'' + value['Title'] + '\', \'' + value['imdbID'] + '\')">Favorite</a></td>'
  }
  // row end tag
  result += "</tr>"

  // return result
  return result
}

// function to get movie from omdb by id
function search_omdb_id(id){
  // get results for id
  $.get("http://www.omdbapi.com/?i=" + id, function(data){
    // initialize result string
    var result = ''
    // loop throguh attribute hash and add to result string
    $.each(data,function(key,value){
      // don't add response/success var
      if(key != 'Response'){
        result += "<p>" + key + " : " + value +"</p>"
      }
    })
    // render results to page
    render('result', result)
  })
}

// method to figure out which pages need to be shown in pagination and render pagination div
function setup_pagination(search, num_pages, current_page_number){
  // initialize pagination html with previous button and opening tags
  var pagination_html = ''

  // if first page disable previosu button
  if(current_page_number == 1){
    pagination_html = '<nav aria-label="Page navigation"><ul class="pagination"><li class="disabled"><a href="#" aria-label="Previous" ><span aria-hidden="true">&laquo;</span></a></li>'
  }else{
    pagination_html = '<nav aria-label="Page navigation"><ul class="pagination"><li><a href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>'
  }

  // initialize first and last page vars
  var first_page = -1
  var last_page = -1

  // set first and last page shown in pagination setup
  // only showing 5 pages at a time
  // if 5 pages or less show all
  if(num_pages <= 5){
    first_page = 1
    last_page = num_pages
  // if more than 5 pages
  }else{
    // if first 3 pages
    if(current_page_number - 3 < 1){
      first_page = 1
      last_page = 5
    // if last 3 pages
    }else if(current_page_number + 3 > num_pages){
      first_page = current_page_number
      last_page = num_pages
    // everything else
    }else{
      first_page = current_page_number - 2
      last_page = current_page_number + 2
    }
  }

  // add pages
  for(var i = first_page; i <= last_page; i++){
    // if current page set as active
    if(i == current_page_number){
      pagination_html += '<li class="active"><a href="#" onclick="search_omdb(\'' + search + '\', ' + i.toString() + ')">' +  i.toString() + '</a></li>'
    }else{
      pagination_html += '<li><a href="#" onclick="search_omdb(\'' + search + '\', ' + i.toString() + ')">' +  i.toString() + '</a></li>'
    }
  }

  // add closing tags and next button
  // if last page disable next button
  if(current_page_number == num_pages){
    pagination_html += '<li class="disabled"><a href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li></ul>'
  }else{
    pagination_html += '<li><a href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li></ul>'
  }

  // render
  render('pagination', pagination_html)
}

// method to render html to a specific div container
function render(id, html){
  $('#' + id).html(html)
}

// mark movie as favorite
function add_favorite(title, oid){
  $.post("/favorites", {name: title, oid: oid})
}

// set onclick functions -- set on load
$(function(){
  // onclick function for search
  $('#search-btn').click(function(){
    // set search term var to val of search box
    var search_term = $('#search-form').val()
    // if search box empty show alert to fill in
    if(search_term == ''){
      alert('Search form can\'t be blank')
    // else perform search
    }else{
      search_omdb(search_term, 1)
    }
  })

  // onclick function for favorites
  $('#favorites').click(function(){
    // get favorites and render out
    $.get("/favorites", function(data){
      // build favorites html string
      table_html = generate_table_html(data, 1, true)

      // render table
      render('result', table_html)
    })
  })
})
