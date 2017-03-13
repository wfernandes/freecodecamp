$(document).ready(function() {
  //$(".thumbnail").hide();

})

function searchToggle(obj, evt) {
  var container = $(obj).closest('.search-wrapper');
  console.log("is active", container.hasClass('active'))
  if (!container.hasClass('active')) {
    container.addClass('active');
    evt.preventDefault();
  } else if (container.hasClass('active') && $(obj).closest('.input-wrapper').length == 0) {
    container.removeClass('active');
    // clear input
    container.find('.search-input').val('');
    // clear results
    //$(".results").empty();
  }
}

function submitFn(obj, evt) {
  value = $(obj).find('.search-input').val().trim();

  if (!value.length) {
    clearResults();
    return;
  } else {
    // clear them hard
    $('.results').empty();
  }

  var api = "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages|extracts&generator=search&pilimit=max&exsentences=1&exlimit=max&exintro=1&explaintext=1&gsrsearch=";
  var cb = '&callback=JSON_CALLBACK';
  var page = 'https://en.wikipedia.org/?curid=';

  var originalReq = $.ajax({
    url: api+value,
    dataType: 'jsonp'
  });

  originalReq.then(function(data) {
    var results = [];
    var pages = data.query.pages;
    $.each(pages, function(k,v){
      var r = {
        title: v.title,
        body: v.extract,
        page: page + v.pageid
      };
      if (v.thumbnail) {
        r.img = v.thumbnail.source;
      }
      results.push(r);
    });
    return results;
  }, function reject(reason){
    console.log("Wiki Req failed: ", reason);
  }).then(function(results){
    showResults(results);
  });
  evt.preventDefault();
}

function showResults(data) {
  var placeholder = $("#placeholder");

  for (var i = 0; i < data.length; i++) {
    var item = placeholder.clone(false);
    var v = data[i];
    item.attr("id", "result" + i);
    item.find("h3").text(v.title);
    item.find("#content").html(v.body);
    item.find("a").attr("href", v.page);
    if(v.img){
      item.find("img").attr("src", v.img);
    }else{
      item.find("img").remove();
    }
    $(".results").append(item);
  }
  // Once the results are on the DOM, then fade them in.
  $('.results').find('.thumbnail').each(
    function(idx) {
      $(this).delay(100 * idx).fadeIn(100);
    }
  );
}

function search(searchQuery) {}

function clearResults() {
  $('.results').find('.thumbnail').each(
    function(idx) {
      $(this).delay(50 * idx).fadeOut(100);
    }
  );

}
