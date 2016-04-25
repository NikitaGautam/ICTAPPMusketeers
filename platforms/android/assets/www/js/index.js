/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */


var globalVictimTypeValidator;
globalVictimTypeValidator = $('#get-victim-form').validate({
    rules: {
        Who: {required: true},
        Where : {required: true},
        outside : {required: true},
        Why: {required: true},
        howViolence:  {required: true}
    },
    errorPlacement: function( error, element ) {
        error.insertAfter( element.parent());
    },
    highlight: function (element) {
        $(element).parent().addClass('error')
    },
    unhighlight: function (element) {
        $(element).parent().removeClass('error')
    }
});

var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener("backbutton", this.onBackKeyDown, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        //db = window.openDatabase("RegistrationDB", "1.0", "Registration", 200000);
        $.mobile.defaultDialogTransition = "none";
        $.mobile.defaultPageTransition = "none";

        $('.togglemenu').click(function () {
            $('.slidemenu').toggle();
            $('.overlayMenu').toggle();
        });
        $('.hidemenu, .overlayMenu').click(function () {
            $('.slidemenu').hide();
            $('.overlayMenu').hide();
        });

        $(".homepage").click(function () {
            resetForm();
        });

        $('.back1').on('click', function () {
            navigator.app.backHistory();
            resetForm();
        });


        $('#vButton').on("click", function () {
            window.location.hash = "#victimDistinction";
        });

        // Code by Ruby \
        $("#Where").change(function () {
            if ($("#Where").val() == 2) {

                $("#outside").show();
                $("input[type='radio']").attr('required', 'required');
            }
            else {
                $("#outside").hide();

            }
        });


        var requiredCheckboxes = $('input:checkbox[required]');
        requiredCheckboxes.change(function () {
            if (requiredCheckboxes.is(':checked')) {
                requiredCheckboxes.removeAttr('required');
            } else {
                requiredCheckboxes.attr('required', 'required');
            }
        });

        $('#submit').on("click", function () {
            var pform = $('#get-victim-form');
            pform.validate();

            if (!pform.valid()) {
                globalVictimTypeValidator.focusInvalid();
                return; //Do not save anything, since the form is not valid.
            }
            else {
                var who = $("#Who").val();
                var where = $("#Where").val();
                var story = $("#outside input[type='radio']:checked").val();
                var cause = $("#Why").val();
                var how = $("input:checkbox:checked").map(function () {
                    return $(this).val();
                }).get();
                //alert(who + "----" + where + " ----" + story + "----" + cause + "----" + how + how.indexOf(4));
                //resetForm();
                var decision = "";
                if (who == 1) {
                    decision = "Intimate Partner Violence";
                    //alert (decision);
                } else if (who == 2 && where == 1 && cause != 2) {
                    decision = "Domestic Violence";
                    //alert (decision);
                    window.location.hash = "#domesticViolencePage";

                } else if (who != 1 && (where == 1 || (where == 2 && story == 4)) && cause == 2 && how.indexOf(4) == -1) {
                    decision = "Sexual Violence";
                    //alert (decision);
                } else {
                    decision = "Woman Trafficking";
                    //alert (decision);
                    window.location.hash = "#humanTraffickingPage";
                }
                //alert (decision);
            }

        }).done(function () {
            resetForm();
        });



    },
    // Update DOM on a Received Event
    onBackKeyDown: function () {
        var hashId = window.location.hash;
        if (hashId == null || hashId == "" || hashId == "#homeScreen" || hashId == "#login") {
            // Define the Dialog and its properties.
//            if(confirm('Do you want to exit application?')){
//                navigator.app.exitApp();
//            }
            navigator.notification.confirm(
                'Do you want to exit application?',  // message
                function (result) {
                    if (result == 1) {
                        navigator.app.exitApp();
                    }
                }
            );
        } else {
            navigator.app.backHistory();
        }
    }
}

function resetForm(){
    $("#get-victim-form")[0].reset();
}


function showSpinner(){
   // $.mobile.loading("show");
    $('.ajax-panel').html('<div class="overlay"></div><div class="loading">&nbsp;</div>');
}

function hideSpinner(){
    //$.mobile.loading("hide");
    $('.ajax-panel').html('');
}


function checkAndSendEmail(contactData){
    cordova.plugins.email.isAvailable(
        function (isAvailable) {
            if(isAvailable)
                sendEmail(contactData)
            else
                alert("Error: Unable to send email. Please install an email app and configure your email.");
        }
    );
}

function sendEmail(contactData){

        if(check == 'call'){
            var text = 'Hello,<br/><br/> My information is as follows:<br/><br/>' +
                '<br/><b> First Name: </b>'+ contactData.first_name  +'<br/><br/>' +
                '<b>Last Name: </b>'+ contactData.last_name +'<br/><br/>' +
                '<b>Phone: </b>'+ contactData.phone +'<br/><br/>' +
                '<b>Email: </b>'+ contactData.email +'<br/><br/>' +
                '<br/> Thanks!<br/>' + contactData.first_name +' '+contactData.last_name;

            var email = {
                //to: 'nikita.gautam@deerwalk.edu.np',
                to: _emailRecipient,
                subject: 'Request for Call',
                body: text,
                isHtml: true
            }
            cordova.plugins.email.open(email, function(){
                var result = '';
                result = 'Thank you, '+ contactData.first_name +' '+ contactData.last_name +', for contacting Deerwalk Tours and Travels. Our representative will call you as soon as possible.';
                $('#content').html(result);
                window.location.hash = '#callText';
            }, this);

        }

        else if(check == 'message'){
            var msg = $('#msg').val();
            var text = 'Hello,<br/><br/> My information and message are as follows:<br/><br/>' +
//                'Hello,<br/><br/> Information about user sending message is as follows:<br/><br/>' +
                '<b>First Name: </b>'+ contactData.first_name  +'<br/><br/>' +
                '<b>Last Name: </b>'+ contactData.last_name +'<br/><br/>' +
                '<b>Phone: </b>'+ contactData.phone +'<br/><br/>' +
                '<b>Email: </b>'+ contactData.email +'<br/><br/>' +
                '<b>Message: </b>'+ contactData.msg +'<br/><br/>' +
                '<br/> Thanks!<br/>' + contactData.first_name +' '+contactData.last_name;
            var email = {
                to: _emailRecipient,
                subject: 'Message From User: ' + contactData.first_name +' '+contactData.last_name,
                body: text,
                isHtml: true
            }
            cordova.plugins.email.open(email, function(){
                var result = '';
                result =  'Thank you, '+ contactData.first_name +' '+ contactData.last_name +', for contacting Deerwalk Tours and Travels. Our representative will contact you as soon as possible.';
                $('#msgText').html(result);
                window.location.hash = '#messageText';
                $("#msg-form")[0].reset();
                $("#get-quote-form")[0].reset();
            }, this);

        }
        else if (check == 'quote')
        {
            var trip = $('#tripName :radio:checked').val();
            var departure = $('#departure').val();
            var destination = $('#destination').val();
            var from = $('#from').val();
            var returningDate = $('#to').val();
            var dflex = $('#selectNative').val();
            var aflex = $('#selectNative1').val();
            var adult= $('#adultRange').val();
            var children= $('#childrenRange').val();
            var infant= $('#infantRange').val();
            var msg = $('#quotemsg').val();

            var text = 'Hello,<br/><br/> My information and request for quote are as follows:<br/><br/>' +
//                'Hello,<br/><br/> Information about user requesting the quote is as follows:<br/><br/>' +
                '<b>Trip Details: </b>' + trip+ '<br><br>'+
                '<b>Departure City: </b>'+ departure +'<br><br>' +
                '<b>Destination City: </b>'+  destination+ '<br><br>'+
                '<b>Departure Date: </b>'+ from+ '<br><br>' +
                '<b>Returning Date: </b>'+ returningDate+'<br><br>' +
                '<b>Departure Flexibility: </b>'+  dflex+ '<br><br>' +
                '<b>Arrival Flexibility: </b>'+  aflex+ '<br><br>' +
                '<b>First Name: </b>'+  contactData.first_name +'<br><br>' +
                '<b>Last Name: </b>'+ contactData.last_name + '<br><br>' +
                '<b>Email: </b>'+ contactData.email +'<br><br>' +
                '<b>Phone: </b>'+  contactData.phone + '<br><br>'+
                '<b>No. of Adult: </b>'+  adult+ '<br><br>' +
                '<b>No. of Children: </b>'+  children+ '<br><br>' +
                '<b>No. of Infant: </b>'+ infant+ '<br><br>'+
                '<b>Message: </b>'+  msg+ '<br/><br/> Thanks! <br/>'+ contactData.first_name +' '+contactData.last_name;
            var email = {
                to: _emailRecipient,
                subject: 'Quote Request',
                body: text,
                isHtml: true
            }
            cordova.plugins.email.open(email, function(){
                var result = '';
                result = 'Thank you, '+ contactData.first_name +' '+ contactData.last_name+ ',  for requesting quote from Deerwalk Tours and Travels. Our representative will get back to you as soon as possible.';
                $('#quoteT').html(result);
                window.location.hash = '#quoteText';
                $("#msg-form")[0].reset();
                $("#get-quote-form")[0].reset();
            }, this);


        }



}

app.initialize();
