var data = new Object();
let otpCode;
$(document).ready(function () {
    toastr.options = {
        closeButton: true,
        debug: true,
        newestOnTop: true,
        progressBar: true,
        positionClass: "toast-top-center",
        preventDuplicates: false,
        onclick: null,
        showDuration: 300,
        hideDuration: 1000,
        timeOut: 5000,
        extendedTimeOut: 1000,
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut"
    };
});
$(document).on("click", "#redirectHome", function (e) {
    e.preventDefault();
    window.location.href = "/Home/Index"
});

$(document).on("click", "#redirectForgotPassword", function (e) {
    e.preventDefault();
    window.location.href = "/Login/forgotPassword"
});

$(document).on("click", "#btnSignIn", function (e) {
    e.preventDefault();
    var firstName = $("#firstName").val();
    var lastName = $("#LastName").val();
    var email = $("#email").val();
    var phoneNumber = $("#phoneNumber").val();
    var birthDay = $("#birthDay").val();
    var gender = $("#gender").val();
    var password = $("#password").val();
    var retypePassword = $("#reTypePassword").val();
    var address = $("#address").val();
    var check = true;
    var patternEmail = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i
    if (firstName == "") {
        $("#firstName").css("border", "1px solid red");
        $("#firstNameError").html("Required first name!");
        $("#firstNameError").attr("style", "display: block !important");
        check = false;
    } else if (firstName.length < 4 || firstName > 100) {
        $("#firstName").css("border", "1px solid red");
        $("#firstNameError").html("First Name Minimum length is 4 and maximum is 100 Character!");
        $("#firstNameError").attr("style", "display: block !important");
        check = false;
    } else {
        $("#firstNameError").html("right");
        $("#firstNameError").attr("style", "display: block !important");
        $("#firstNameError").css("color", "#64dd17");
        $("#firstName").css("border", "2px solid #64dd17");
        check = true;
    }
    if (lastName == "") {
        $("#LastName").css("border", "1px solid red");
        $("#lastNameError").html("Required last name!");
        $("#lastNameError").attr("style", "display: block !important");
        check = false;
    } else if (lastName.length < 2 || lastName > 150) {
        $("#LastName").css("border", "1px solid red");
        $("#lastNameError").html("Last Name Minimum length is 2 and maximum is 150 Character!");
        $("#lastNameError").attr("style", "display: block !important");
        check = false;
    } else {
        $("#lastNameError").html("right");
        $("#lastNameError").attr("style", "display: block !important");
        $("#lastNameError").css("color", "#64dd17");
        $("#LastName").css("border", "2px solid #64dd17");
        check = true;
    }
    if (email == "") {
        $("#email").css("border", "1px solid red");
        $("#emailError").html("Required Email!");
        $("#emailError").attr("style", "display: block !important");
        check = false;
    } else if (email.length < 10 || email.length > 100) {
        $("#email").css("border", "1px solid red");
        $("#emailError").html("Email Minimum length is 10 and maximum is 100 Character!");
        $("#emailError").attr("style", "display: block !important");
        check = false;
    } else if (!patternEmail.test(email)) {
        $("#email").css("border", "1px solid red");
        $("#emailError").html("Not a valid e-mail address");
        $("#emailError").attr("style", "display: block !important");
        check = false;
    } else {
        $("#emailError").html("right");
        $("#emailError").attr("style", "display: block !important");
        $("#emailError").css("color", "#64dd17");
        $("#email").css("border", "2px solid #64dd17");
        check = true;
    }

    if (phoneNumber == "") {
        $("#phoneNumber").css("border", "1px solid red");
        $("#phoneNumberError").html("Required Phone Number!");
        $("#phoneNumberError").attr("style", "display: block !important");
        check = false;
    } else if (phoneNumber.length < 3 || phoneNumber.length > 20) {
        $("#phoneNumber").css("border", "1px solid red");
        $("#phoneNumberError").html("Phone Number Minimum length is 3 and maximum is 20 Character!");
        $("#phoneNumberError").attr("style", "display: block !important");
        check = false;
    } else {
        $("#phoneNumberError").html("right");
        $("#phoneNumberError").attr("style", "display: block !important");
        $("#phoneNumberError").css("color", "#64dd17");
        $("#phoneNumber").css("border", "2px solid #64dd17");
        check = true;
    }

    if (password == "") {
        $("#password").css("border", "1px solid red");
        $("#passwordError").html("Required Password!");
        $("#passwordError").attr("style", "display: block !important");
        check = false;
    } else if (password.length < 6 || password.length > 30) {
        $("#password").css("border", "1px solid red");
        $("#passwordError").html("Password Minimum length is 6 and maximum is 30 Character!");
        $("#passwordError").attr("style", "display: block !important");
        check = false;
    } else {
        $("#passwordError").html("right");
        $("#passwordError").attr("style", "display: block !important");
        $("#passwordError").css("color", "#64dd17");
        $("#password").css("border", "2px solid #64dd17");
        check = true;
    }

    if (retypePassword == "") {
        $("#reTypePassword").css("border", "1px solid red");
        $("#retypePasswordError").html("Required retype password!");
        $("#retypePasswordError").attr("style", "display: block !important");
        check = false;
    } else if (retypePassword.length < 6 || retypePassword.length > 30) {
        $("#reTypePassword").css("border", "1px solid red");
        $("#retypePasswordError").html("Password Minimum length is 6 and maximum is 30 Character!");
        $("#retypePasswordError").attr("style", "display: block !important");
        check = false;
    } else {
        $("#retypePasswordError").html("right");
        $("#retypePasswordError").attr("style", "display: block !important");
        $("#retypePasswordError").css("color", "#64dd17");
        $("#reTypePassword").css("border", "2px solid #64dd17");
        check = true;
    }


    if (password != retypePassword) {
        $("#reTypePassword").css("border", "1px solid red");
        $("#retypePasswordError").html("retype password not match password");
        $("#retypePasswordError").attr("style", "display: block !important");
        check = false;
    } else {
        $("#retypePasswordError").html("right");
        $("#retypePasswordError").attr("style", "display: block !important");
        $("#retypePasswordError").css("color", "#64dd17");
        $("#reTypePassword").css("border", "2px solid #64dd17");
        check = true;
    }

    if (address == "") {
        $("#address").css("border", "1px solid red");
        $("#addressError").html("Required retype password!");
        $("#addressError").attr("style", "display: block !important");
        check = false;
    } else if (address.length < 10 || address.length > 250) {
        $("#address").css("border", "1px solid red");
        $("#addressError").html("Password Minimum length is 10 and maximum is 250 Character!");
        $("#addressError").attr("style", "display: block !important");
        check = false;
    } else {
        $("#addressError").html("right");
        $("#addressError").attr("style", "display: block !important");
        $("#addressError").css("color", "#64dd17");
        $("#address").css("border", "2px solid #64dd17");
        check = true;
    }


    if (check == true) {
        data.firstName = firstName;
        data.lastName = lastName;
        data.email = email;
        data.birthDay = birthDay;
        data.phoneNumber = phoneNumber;
        data.gender = (gender == 1 ? true : false);
        console.log(data.gender);
        data.password = password;
        data.address = address;
        checkPhoneNumber(phoneNumber);
    }
});

//event sign up user
function signUp(data) {
    $.ajax({
        url: "/User/SignUp",
        type: 'POST',
        dataType: 'json',
        contentType: "application/json; charset=UTF-8",
        data: JSON.stringify(data),
        success: function (respose) {
            if (respose == 1) {
                //Show toast
                shortCutFunction = "error";
                msg = "Error! Something went wrong.";
                title = "error";
                var $toast = toastr[shortCutFunction](msg, title);
                $toastlast = $toast;
                //Show toast
            }
            else {
                window.location.href = "/Home/Index"
            }
        },
        error: function (respose) {
            if (respose.statusCode == 404) {
                window.location.href = "/Home/error404"
            }
        }
    });
}

//event check email defind
function checkEmail(email) {
    $.ajax({
        url: "/User/checkEmail",
        type: 'POST',
        dataType: 'json',
        contentType: "application/json; charset=UTF-8",
        data: JSON.stringify({ email: email }),
        success: function (respose) {
            if (respose == 1) {
                //Show toast
                shortCutFunction = "error";
                msg = "Error! Something went wrong.";
                title = "error";
                var $toast = toastr[shortCutFunction](msg, title);
                $toastlast = $toast;
                //Show toast
            } else if (respose == 0) {
                $("#otpEmail").modal('show');
                otpEmail(data.email);
            } else {
                var dataJsonDefind = JSON.parse(respose);
                $("#emailLogin").val(dataJsonDefind.email);
            }
        },
        error: function (respose) {
            if (respose.statusCode == 404) {
                window.location.href = "/Home/error404"
            }
        }
    });
}

$(document).on("click", ".sendAgain", function (e) {
    var otpYourInput = $("#OtpResetpassword").val();
    if (otpYourInput == otpCode) {
        signUp(data);
    } else {
        $("#txtErrorOtpResetpassword").attr("style", "display: block");
        $("#txtErrorOtpResetpassword").css("color", "red");
        $("#txtErrorOtpResetpassword").html("OTP code not match!");
    }
});

//event check phone number defind
function checkPhoneNumber(phoneNumber) {
    $.ajax({
        url: "/User/checkPhoneNumber",
        type: 'POST',
        dataType: 'json',
        contentType: "application/json; charset=UTF-8",
        data: JSON.stringify({ phoneNumber: phoneNumber }),
        success: function (respose) {
            if (respose == 1) {
                //Show toast
                shortCutFunction = "error";
                msg = "Error! Something went wrong.";
                title = "error";
                var $toast = toastr[shortCutFunction](msg, title);
                $toastlast = $toast;
                //Show toast
            } else if (respose == 0) {
                checkEmail(data.email);
            }
        },
        error: function (respose) {
            if (respose.statusCode == 404) {
                window.location.href = "/Home/error404"
            }
        }
    });
}
//btn login click submit
$(document).on("click", "#loginSubmit", function (e) {
    e.preventDefault();
    var email = $("#emailLogin").val();
    var password = $("#passwordLogin").val();
    console.log(password);
    if (email == "") {
        $("#emailLogin").css("border", "1px solid red");
    }
    if (password == "") {
        $("#passwordLogin").css("border", "1px solid red");
    } else {
        login(email, password);
    }
});

// event login submit
function login(email, password) {
    $.ajax({
        url: "/Login/LoginUser",
        type: 'POST',
        dataType: 'json',
        contentType: "application/json; charset=UTF-8",
        data: JSON.stringify({ email: email, password: password }),
        success: function (respose) {
            if (respose == 1) {
                window.location.href = "/Home/error404"
            } else if (respose == 0) {
                //Show toast
                shortCutFunction = "error";
                msg = respose.status;
                title = "Invalid Email!";
                var $toast = toastr[shortCutFunction](msg, title);
                $toastlast = $toast;
                //Show toast
            } else if (respose == -1) {
                //Show toast
                shortCutFunction = "error";
                msg = respose.status;
                title = "This account has been locked!";
                var $toast = toastr[shortCutFunction](msg, title);
                $toastlast = $toast;
                //Show toast
            } else if (respose == -2) {
                //Show toast
                shortCutFunction = "error";
                msg = respose.status;
                title = "Invalid Email or Password!";
                var $toast = toastr[shortCutFunction](msg, title);
                $toastlast = $toast;
                //Show toast
            }
            else {
                var dataJsonUser = JSON.parse(respose);
                console.log(dataJsonUser);
                window.location.href = "/Home/Index";
            }
        },
        error: function (respose) {
            if (respose.statusCode == 404) {
                window.location.href = "/Home/error404"
            }
        }
    });
};

$("#otpEmail").on('hidden.bs.modal', function () {
    otpCode = null;
    clearInterval(countdownOTP);
});
//countdown
async function countdownOTP(otp) {
    var timer2 = "5:01";
    await setInterval(function () {
        var timer = timer2.split(":");
        var minutes = parseInt(timer[0], 10);
        var seconds = parseInt(timer[1], 10);
        --seconds;
        minutes = (seconds < 0) ? --minutes : minutes;
        if (minutes < 0) {
            otp = null;
        };
        seconds = (seconds < 0) ? 59 : seconds;
        seconds = (seconds < 10) ? '0' + seconds : seconds;
        $(".countdown").html(minutes + ':' + seconds);
        timer2 = minutes + ':' + seconds;
    }, 1000);
}

//otp EMail 
function otpEmail(email) {
    $.ajax({
        url: "/SMS/sendEmail",
        type: 'POST',
        dataType: 'json',
        contentType: "application/json; charset=UTF-8",
        data: JSON.stringify({ email: email, type: "otp" }),
        success: function (respose) {
            if (respose == 1) {
                //Show toast
                shortCutFunction = "error";
                msg = "Error! An error occurred. Please try again later";
                title = "error";
                var $toast = toastr[shortCutFunction](msg, title);
                $toastlast = $toast;
                //Show toast
            } else {
                countdownOTP(respose);
                otpCode = respose;
            }
        },
        error: function (respose) {
            if (respose.statusCode == 404) {
                window.location.href = "/Home/error404"
            }
        }
    });
}