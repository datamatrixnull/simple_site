/*CSRF Code */

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
function sameOrigin(url) {
    // test that a given url is a same-origin URL
    // url could be relative or scheme relative or absolute
    var host = document.location.host; // host + port
    var protocol = document.location.protocol;
    var sr_origin = '//' + host;
    var origin = protocol + sr_origin;
    // Allow absolute or scheme relative URLs to same origin
    return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
        (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
        // or any other URL that isn't scheme relative or absolute i.e relative.
        !(/^(\/\/|http:|https:).*/.test(url));
}

/* End CSRF Code */

$(document).ready(function() {
	$('.login-btn').click(function(event) {
		var username = $('#username').val();
		var password = $('#password').val();
        var remember_me = $('#remember-me').is(':checked');
        var csrftoken = $('[name="csrfmiddlewaretoken"]').val();

		if (username && password) {
			event.preventDefault();
			var data = {username, password, remember_me};
			$.ajax({
	            url: "/sign-in-api",
	            type: "POST",
	            dataType: 'text',
	            beforeSend: function(xhr, settings) {
	                if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
	                    // Send the token to same-origin, relative URLs only.
	                    // Send the token only if the method warrants CSRF protection
	                    // Using the CSRFToken value acquired earlier
	                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
	                }
	            },
	            data: data,
	            success: function(response, status, xhr){
	                if (xhr.status == 202) {
	                	document.location.href = '/';
	                } else {
                        // ¯\_(ツ)_/¯
	                }
	            },
				error: function (xhr, status, error) {
					$('.errors').empty();
					errors = '';
					dict_errors = JSON.parse(xhr['responseText']);
					for (const [key, value] of Object.entries(dict_errors)) {
						for (i in value) {
							text = `<p class="text-danger">${key} : ${value[i]} </p>`;
							if (errors.includes(text)){
								console.log('skip')
							} else {
								errors += text;
							}
						}							
					}
					$('.errors').append(errors);

	            }
			});
	        
	        /* End Ajax Call */
		}
	});
});