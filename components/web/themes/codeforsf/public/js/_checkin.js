

/* Matching Hat Client */

(function (MH) {
  
  // namespace: token
  var Checkin = (MH.Checkin = {});

  /*
    checkin click
  */
  //When doc ready set up event handlers
  Checkin.login = function(  ) {
    console.log("checkin click");

    if ( localStorage.getItem("checkedIn") === "true" ) {
      window.alert("You are already checked in using " + localStorage.getItem("emailAddr") );
      
      //window.location.href = "/test/api/projects";
    } else {
      
      // perform the xhr API call
      jQuery.ajax({
        type: 'POST',
        url: '/api/user/create_and_login',
        data: {
          email : $("#email").val(),
          password: ''
        },
      }).done(function (results) {
        console.log('success ', results);
        Checkin.postCheckin(results) ;
        
      }).fail(function (err) {
        console.error(err);

      });
      
    }
    
  }
  
  /*
    reset click
  */
  
  Checkin.reset = function(  ) {

    // perform the xhr API call
    jQuery.ajax({
      type: 'POST',
      url: '/api/user/logoff',
      data: {},
    }).done(function (results) {
      console.log('logoff ', results);
      
      if ( localStorage.getItem("checkedIn") ) {
        localStorage.setItem("checkedIn", false);
        localStorage.setItem("emailAddr", "");
        localStorage.setItem("firstName", "");
        localStorage.setItem("lastName", "");
        console.log("You are now reset to not checked in ")
      }
      
    }).fail(function (err) {
      console.error(err);

    });
    
  }

  var checkedIn = false;

   Checkin.postCheckin = function postCheckin(  ) {
    //var firstNm = $("#first_name").attr("name");
    console.log("checking in now");
    var checkinData = {
      firstName : $("#first_name").val(),
      lastName : $("#last_name").val(),
      emailAddr : $("#email").val()
    };
    $.ajax ( {
      type : "GET",
      url : "/test/api/projects",
      data : checkinData,
      success : Checkin.success(checkinData)
    });
  }

   Checkin.success = function success( checkinData, evt ) {
    checkedIn = "true";
    $("a#ahead").attr("href", "/test/api/projects").removeProp("disabled");
    //check for local storage and store the user checkin info
    if (typeof(Storage) !== "undefined") {
      localStorage.setItem("checkedIn" , "true"); //stored as string
      localStorage.setItem("emailAddr" , checkinData.emailAddr );
      localStorage.setItem("firstName" , checkinData.firstName);
      localStorage.setItem("lastName" , checkinData.lastName);
    } else {
      window.alert("Sorry! No Web Storage support..");
    }
    
    window.location="/test/projectlist";
    
  }
  
  }) (( window.MH=window.MH || {}));