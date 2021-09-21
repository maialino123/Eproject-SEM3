let intRegex = /^\d+$/;
let floatRegex = /^((\d+(\.\d *)?)|((\d*\.)?\d+))$/;
let otpCode, customerID;
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
$(document).on("click", ".homeRedirect", function (e) {
    e.preventDefault();
    window.location.href = "/Home/Index";
});
$(document).on("click", "#btnLogin", function (e) {
    var email = $("#emailLoginInput").val();
    var password = $("#passwordLoginInput").val();
    console.log(email);
    if (email == "") {
        $("#emailLoginInput").css("border", "1px solid red");
    }
    if (password == "") {
        $("#passwordLoginInput").css("border", "1px solid red");
    } else {
        login(email, password);
    }
});

$(document).on("click", "#redirectFindAccount", function (e) {
    e.preventDefault();
    window.location.reload();
});

$(document).on("click", ".btnCancel", function (e) {
    e.preventDefault();
    window.location.href = "/Home/Index"
});

$(document).on("click", ".btnFind", function (e) {
    e.preventDefault();

    var phoneOrEmail = $("#forgotPhoneOrEmailInput").val();
    console.log(phoneOrEmail);
    var emptyEmail = phoneOrEmail.search("@gmail.com");
    if (phoneOrEmail == "") {
        $("#forgotPhoneOrEmailInput").css("border", "1px solid red");
        //Show toast
        shortCutFunction = "error";
        msg = "Required Email or Phone Number";
        title = "Required Email or Phone Number";
        var $toast = toastr[shortCutFunction](msg, title);
        $toastlast = $toast;
        //Show toast
    }
    if (emptyEmail != -1) {
        checkRoleAccount(phoneOrEmail, null);
    } else if (intRegex.test(phoneOrEmail) || floatRegex.test(phoneOrEmail)) {
        checkRoleAccount(null, phoneOrEmail);
    } else {
        $("#forgotPhoneOrEmailInput").css("border", "1px solid red");
        //Show toast
        shortCutFunction = "error";
        msg = "Invalid Email or Phone Number";
        title = "Invalid Email or Phone Number";
        var $toast = toastr[shortCutFunction](msg, title);
        $toastlast = $toast;
        //Show toast
    }
});

$(document).on("click", "#continue", function (e) {
    e.preventDefault();
    var codeResultInput = $("#inputOTPresult").val();
    if (codeResultInput == "") {
        $("#inputOTPresult").css("border", "1px solid red");
        //Show toast
        shortCutFunction = "error";
        msg = "Error! Required otp code";
        title = "error";
        var $toast = toastr[shortCutFunction](msg, title);
        $toastlast = $toast;
        //Show toast
    } else if (intRegex.test(codeResultInput) || floatRegex.test(codeResultInput)) {
        if (codeResultInput == otpCode) {
            otpCode = null;
            console.log(customerID);
            window.location.href = "/Login/newPassword?id=" + customerID;
        } else {
            //Show toast
            shortCutFunction = "error";
            msg = "Error! OTP is not correct";
            title = "error";
            var $toast = toastr[shortCutFunction](msg, title);
            $toastlast = $toast;
            //Show toast
        }
    } else {
        //Show toast
        shortCutFunction = "error";
        msg = "Error! Invalid OTP CODE";
        title = "error";
        var $toast = toastr[shortCutFunction](msg, title);
        $toastlast = $toast;
        //Show toast
    }
});

$("#exampleModalCenter").on('hidden.bs.modal', function () {
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
        $(".txtTime").html(minutes + ':' + seconds);
        timer2 = minutes + ':' + seconds;
    }, 1000);
}

//login
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
}

//otp phone number
function otpPhoneNumber(phoneNumber) {
    $.ajax({
        url: "/SMS/SendSMS",
        type: 'POST',
        dataType: 'json',
        contentType: "application/json; charset=UTF-8",
        data: JSON.stringify({ phoneNumber: phoneNumber }),
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
                console.log(respose);
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

//otp email
function otpEmail(email) {
    $.ajax({
        url: "/SMS/sendEmail",
        type: 'POST',
        dataType: 'json',
        contentType: "application/json; charset=UTF-8",
        data: JSON.stringify({ email : email, type: "otp" }),
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

//check account role
function checkRoleAccount(email, phoneNumber) {
    $.ajax({
        url: "/Login/checkRoleAccount",
        type: 'POST',
        dataType: 'json',
        contentType: "application/json; charset=UTF-8",
        data: JSON.stringify({ email: email, phoneNumber: phoneNumber }),
        success: function (respose) {
            if (respose == 1) {
                //Show toast
                shortCutFunction = "error";
                msg = "Invalid Email or Phone Number";
                title = "Invalid Email or Phone Number";
                var $toast = toastr[shortCutFunction](msg, title);
                $toastlast = $toast;
                //Show toast
            }
            var dataJsonAccount = JSON.parse(respose);
            //console.log(dataJsonAccount);
            if (dataJsonAccount != null) {
                customerID = dataJsonAccount[0].customerID;
                if (phoneNumber != null) {
                    $("#txtOTP").html("Check mobile and enter the confirmation code");
                    $("#exampleModalCenter").modal("toggle");
                    otpPhoneNumber(dataJsonAccount[0].phoneNumber);
                } else if (email != null) {
                    $("#exampleModalCenter").modal("toggle");
                    $("#txtOTP").html("Check gmail and enter the confirmation code");
                    //console.log(dataJsonAccount[0].email);
                    otpEmail(dataJsonAccount[0].email);
                }
            } else {
                //Show toast
                shortCutFunction = "error";
                msg = "Invalid Email or Phone Number";
                title = "Invalid Email or Phone Number";
                var $toast = toastr[shortCutFunction](msg, title);
                $toastlast = $toast;
                //Show toast
            }
        },
        error: function (respose) {
            if (respose.statusCode == 404) {
                window.location.href = "/Home/error404"
            }
        }
    });
}