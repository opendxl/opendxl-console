isc.Button.create({
    title: "Login",
    click : function () {
        isc.showLoginDialog(function (credentials, dialogCallback) {
            // In a real application, we would obviously contact the server here to validate 
            // the user's credentials.  For this demo, there is only one valid user/password  
            // and it is hard-coded here
            if (credentials.username == "barney" && credentials.password == "rubble") {
                var loginOK = true;
            } else {
                loginOK = false;
            }
            dialogCallback(loginOK);
        },{dismissable:true, loginFormProperties: {width: 270, titleWidth: 70} });
    }
});
