let dataJsonProduct;
let countItemCart;
var rowsItem = '';
let customerID;
$(document).ready(function () {
    toastr.options = {
        closeButton: true,
        debug: true,
        newestOnTop: true,
        progressBar: true,
        positionClass: "toast-top-right",
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
    loadProductTopView();
    customerID = $("#customerID").data("id");
    //console.log(customerID);
    countItemCart = parseInt($(".countItem").text());
});
$(".pop").popover({
    html: true,
    content: `<div class="row">
            <div class="cartView">
                <div class="headerText">
                    <p>
                        New products added
                    </p>
                </div>
                <div class="contentItem">
                   <ul class="listItem">
                       ${rowsItem}
                   </ul>
                </div>
                <div>
                    <div class="textTotalItem">
                        <p>113 product in cart</p>
                    </div>
                    <div class="btnViewCart">
                        <button class="btn">View Cart</button>
                    </div>
                </div>
            </div>
        </div>`,
});
//popover cart
$(".pop").popover({ trigger: "manual", html: true, animation: true })
    .on("mouseenter", function () {
        var _this = this;
        $(this).popover("show");
        $(".popover").on("mouseleave", function () {
            $(_this).popover('hide');
        });
    }).on("mouseleave", function () {
        var _this = this;
        setTimeout(function () {
            if (!$(".popover:hover").length) {
                $(_this).popover('hide');
            };
        });
    });


//regex number commas
const numberWithCommas = (number) => { return number.toString().replace("/\B(\d{3}) + (?!\d))/g", ",") };

//load top product view
function loadtopProductView() {
    var index = 0;
    var rows = '';
    for (let item of dataJsonProduct) {
        if (index < 8) {
            let img = "/MyImages/" + item.tbl_imageList[0].name + item.tbl_imageList[0].extendsion;
            console.log(img);
            let price = numberWithCommas(item.price);
            let priceSale = numberWithCommas(item.priceSale);
            let nameProduct = item.name.substring(0, 23).concat('...'); 
            rows += `<div class="col-lg-3 col-md-12 mb-4">

                        <a href="" class="waves-effect waves-light" data-id="${item.productID}" id="clickProductDetailImg">
                            <img src="${img}" class="img-fluid animated pulse slower delay-5s"
                                 alt="" width="100%">
                        </a>

                        <div class="card">
                            <div class="card-body">

                                <p class="mb-1"><a href="" class="font-weight-bold black-text">${nameProduct}</a></p>

                                <p class="mb-1"><small class="mr-1"><s>$${price}</s></small><strong>$${priceSale}</strong></p>


                                <button type="button" id="btnAddToCart" data-id="${item.productID}" data-price="${item.price}" data-priceSale="${item.priceSale}" data-name="${item.name}" data-image="${img}" class="btn btn-black btn-rounded btn-sm px-3">Buy Now</button>
                                <button type="button" id="btnProductDetail" data-id="${item.productID}" class="btn btn-outline-black btn-rounded btn-sm px-3 waves-effect">Details</button>

                            </div>
                        </div>
                    </div>`
        }
        index++;
    }
    $("#hotFlower").html(rows);
}

$(document).on("click", "#btnProductDetail", function (e) {
    e.preventDefault();
    var productID = $(this).data("id");
    window.location.href = "/Home/ProductDetail?productID=" + productID;
});

$(document).on("click", "#clickProductDetailImg", function (e) {
    e.preventDefault();
    var productID = $(this).data("id");
    window.location.href = "/Home/ProductDetail?productID=" + productID;
});



//icon fly to card animate
var addIconCart = function (addToCartBtn) {
    var cartIcon = $(".cart");
    var imageItem = $('<img src="' + addToCartBtn.data("image") + '" alt="violet" width="30px" height="30px">').css({ "position": "fixed", "z-index": "999" });
    addToCartBtn.prepend(imageItem);
    var position = cartIcon.offset();
    imageItem.animate({
        top: position.top,
        left: position.left
    }, 500, "linear", function () {
        imageItem.remove();
    });
};


//btn add to card
$(document).on("click", "#btnAddToCart", function (e) {
    e.preventDefault();
    //count item cart icon
    countItemCart += 1;
    addIconCart($(this));
    $(".countItem").text(countItemCart);
    //count item cart icon

    var productID = $(this).data("id");
    var price = $(this).data("price");
    var priceSale = $(this).data("priceSale");
    var name = $(this).data("name");
    var image = $(this).data("image");
    var data = new Object();

    data.productID = productID;
    //add
    addToCart(productID);

});
//btn redirect cart
$(document).on("click", ".cart", function (e) {
    e.preventDefault();
    window.location.href = "/Home/Cart?customerID=" + customerID;
});

function addToCart(productID) {
    $.ajax({
        url: "/Home/addToCart",
        type: 'POST',
        dataType: 'json',
        contentType: "application/json; charset=UTF-8",
        data: JSON.stringify({ productID: productID, quantity: 1 }),
        success: function (respose) {
            if (respose == 0) {
                //Show toast
                shortCutFunction = "success";
                msg = "add successfully product!";
                title = "successfully!";
                var $toast = toastr[shortCutFunction](msg, title);
                $toastlast = $toast;
                //Show toast
            } else if (respose == 1) {
                //Show toast
                shortCutFunction = "warning";
                msg = "product This product is already in your cart!";
                title = "warning!";
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
};
//func get all item product cart of user
function getAllItemCart(customerID) {
    $.ajax({
        url: "/Home/getItemAll",
        type: 'POST',
        dataType: 'json',
        contentType: "application/json; charset=UTF-8",
        data: JSON.stringify({ customerID: customerID }),
        success: function (respose) {
            if (respose == 1) {

            } else {
                dataItemCartJSON = JSON.parse(respose);
                console.log(respose);
            }
        },
        error: function (respose) {
            if (respose.statusCode == 404) {
                window.location.href = "/Home/error404"
            }
        }
    });
};



function loadProductTopView() {
    $.ajax({
        url: "/Home/getAllProductByView",
        type: 'GET',
        dataType: 'json',
        contentType: "application/json; charset=UTF-8",
        success: function (respose) {
            dataJsonProduct = JSON.parse(respose);
            //console.log(dataJsonProduct);
            //console.log(dataJsonProduct[4].tbl_imageList[0].name);
            loadtopProductView();
        },
        error: function (respose) {
            if (respose.statusCode == 404) {
                window.location.href = "/Home/error404"
            }
        }
    });
};

$(document).on("click", "#btnSubmitLogin", function (e) {
    e.preventDefault();
    var emailName = $("#Form-email5").val();
    var passwordName = $("#Form-pass5").val();
    var findEmailEmpty = emailName.search("@gmail.com");
    if (findEmailEmpty == -1) {
        //Show toast
        shortCutFunction = "error";
        msg = "Invalid Email!";
        title = "Invalid Email!";
        var $toast = toastr[shortCutFunction](msg, title);
        $toastlast = $toast;
        //Show toast
    }
    if (passwordName != "") {
        loginWithEmailPassword(emailName, passwordName);
    }
});

function loginWithEmailPassword(email, password) {
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
                location.reload();
            }
        },
        error: function (respose) {
            if (respose.statusCode == 404) {
                window.location.href = "/Home/error404"
            }
        }
    });
}

$(document).on("click", "#logoutUser", function (e) {
    e.preventDefault();
    logoutUser();
});

function logoutUser() {
    $.ajax({
        url: "/Login/logout",
        type: 'POST',
        dataType: 'json',
        success: function (respose) {
            if (respose == 1) {
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

$(document).on("click", "#forgotPasswordRedirect", function (e) {
    e.preventDefault();
    window.location.href = "/Login/forgotPassword";
});

$(document).on("click", "#googleLogin", function (e) {
    e.preventDefault();
    loginGoole();
});

function loginGoole() {
    $.ajax({
        url: "Login/loginWithGoogle",
        type: 'POST',
        dataType: 'json',
        contentType: "application/json; charset=UTF-8",
        xhrFields: {
            withCredentials: true
        },
        success: function (respose) {
            console.log(respose);
        },
        error: function (respose) {

        }
    });
};

$(document).on("click", "#signUp", function (e) {
    e.preventDefault();
    window.location.href = "/User/SignIn"
});


//redirect Home
$(document).on("click", ".homePage", function (e) {
    e.preventDefault();
    window.location.href = "/Home/Index";
});

//redirect Product
$(document).on("click", "#productPage", function (e) {
    e.preventDefault();
    window.location.href = "/Home/Products";
});
