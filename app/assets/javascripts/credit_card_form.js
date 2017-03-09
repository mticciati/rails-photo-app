$(document).ready(function() {

  var show_error, stripeResponseHandler, submitHandler;

  submitHandler = function(e) {

    var $form = $(e.target);
    $form.find('input[type=submit]').prop('disabled', true);

    if (Stripe) {
      Stripe.card.createToken($form, stripeResponseHandler);
    }
    else {
      show_error('Failed to load credit card proccessing functionality. Please refresh and try again');
    }

    return false;

  };

  stripeResponseHandler = function(status, response) {
    var token, $form;

    $form = $('.cc-form');

    if (response.error) {
      console.log(response.error.message);
      show_error(response.error.message);
      $form.find('input[type=submit]').prop('disabled', false);
    }
    else {
      token = response.id;
      $form.append('<input type="hidden" name="payment[]" />').val(token);
      $('[data-stripe=number]').remove();
      $('[data-stripe=cvv]').remove();
      $('[data-stripe=exp-month]').remove();
      $('[data-stripe=exp-year]').remove();
      $('[data-stripe=label]').remove();
      $form.get(0).submit();
    }

    return false;
    
  };

  show_error = function(message) {
    if($("#flash-messages").size() < 1){
      $('div.container.main div:first').prepend("<div id='flash-messages'></div>")
    }

    $("#flash-messages").html('<div class="alert alert-warning"><a class="close" data-dismiss="alert">×</a><div id="flash_alert">' + message + '</div></div>');

    $('.alert').delay(5000).fadeOut(3000);

    return false;
  };

  $('.cc-form').on('submit', submitHandler);

});