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
        var first_name = $('#first-name').val();
        var last_name = $('#last-name').val();
        var email = $('#email').val();
		var username = $('#username').val();
		var password = $('#password').val();
		var confirm_password = $('#password-2').val();
        var remember_me = $('#remember-me').is(':checked');
        var csrftoken = $('[name="csrfmiddlewaretoken"]').val();

        if (password === confirm_password){
            var password_match = true;
        } else {
            var password_match = false;
        }

		if (username && email && first_name && last_name && password_match && password) {
			event.preventDefault();
			var data = {username, password, first_name, last_name, email};
			$.ajax({
	            url: "/sign-up-api",
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
						if (key.includes('error')){
							for (i in value) {
								errors+= `<p class="text-danger"> ${value[i]} </p>`;
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