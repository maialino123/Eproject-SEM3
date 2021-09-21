let valueSelectedDistrict, valueSelectedWard, cartID, customerID, DataJsonMessage;
const arrItem = new Array();
const arrProductNoActive = new Array();
const arrProductActive = new Array();
$(document).ready(function () {
    customerID = $("#customerID").data("id");
    getItem(customerID);
});

async function getItem(customerID) {
    await $.ajax({
        url: "/Home/getItemCart",
        type: 'POST',
        dataType: 'json',
        contentType: "application/json; charset=UTF-8",
        data: JSON.stringify({ customerID: customerID }),
        success: function (respose) {
            if (respose == 1) {
                console.log(respose + ": error!");
            } else {
                dataJsonItem = JSON.parse(respose);
                console.log(dataJsonItem);
                $(".txtCountItem").text(dataJsonItem.length);
                var rows = '';
                for (let item of dataJsonItem) {
                    if (item.Product.quantity == 0) {
                        $("#defaultInline" + item.cartID).prop('checked', false);
                        $("#defaultInline" + item.cartID).attr('disabled', true);
                        arrProductNoActive.push(item.cartID);
                    } else {
                        arrProductActive.push(item);
                    }
                    let img = "/MyImages/" + item.image;
                    let price = item.Product.priceSale == 0 ? item.Product.price : item.Product.priceSale;
                    let totalPrice = price * item.quantity;
                    let addressOrder = item.address + " - " + (item.Ward.name == null ? " " : item.Ward.prefix + " " + item.Ward.name) + " - " + item.District.prefix + " " + item.District.name;
                    rows += ` <tr class="material-tooltip-main" data-toggle="tooltip"
                                data-placement="bottom" title="${addressOrder}">
                                 <td>
                                    <div class="custom-control custom-checkbox custom-control-inline">
                                        <input type="checkbox" data-id="${item.cartID}" data-price="${price}" class="custom-control-input" id="defaultInline${item.cartID}">
                                        <label class="custom-control-label" for="defaultInline${item.cartID}">Buy</label>
                                    </div>
                                </td>
                                <th scope="row">
                                    
                                    <img src="${img}" alt=""
                                         class="img-fluid z-depth-0" id="imageProduct${item.cartID}" data-id="${img}" width="100" height="100">
                                </th>
                                <td>
                                    <h5 class="mt-3">
                                        <strong class="productNameCart${item.cartID}">${item.Product.name}</strong>
                                    </h5>
                                    <p class="text-muted" class="categoryNameCart${item.cartID}">${item.Product.tbl_category.name}</p>
                                </td>
                                <td></td>
                                <td><b style="color: #000;" class="price${item.cartID}">$${price}</b></td>
                                <td class="text-center text-md-left">
                                    <span data-id="${item.cartID}" class="qty${item.cartID}">${item.quantity}</span>
                                    <div class="btn-group radio-group ml-2" data-toggle="buttons">
                                        <label data-id="${item.cartID}" class="btn btn-sm btn-primary btn-rounded btnReduce">
                                            <input type="radio" name="options" id="option1">&mdash;
                                        </label>
                                        <label data-id="${item.cartID}" class="btn btn-sm btn-primary btn-rounded btnAugment">
                                            <input type="radio" name="options" id="option2">+
                                        </label>
                                    </div>
                                </td>
                                <td class="font-weight-bold">
                                    <strong class="Totalprice${item.cartID}">$${totalPrice}</strong>
                                </td>
                                <td>
                                    <button type="button" data-id="${item.cartID}" class="btn btn-sm btn-primary deleteOrderItem" data-toggle="tooltip" data-placement="top"
                                            title="Remove item">
                                        X
                                    </button>
                                    <button type="button" data-id="${item.cartID}" class="btn btn-sm btn-danger" id="btnAddress" data-toggle="tooltip" data-placement="top"
                                            title="">
                                        Add Address
                                    </button>
                                </td>
                            </tr>`;
                }
                $(".bodyCartItemLoad").html(rows);
                $(".material-tooltip-main").tooltip({
                    template: '<div class="tooltip md-tooltip-main"><div class="tooltip-arrow md-arrow"></div><div class="tooltip-inner md-inner-main"></div></div>'
                });
                //btn reduce quantity and price
                $(document).on("click", ".btnReduce", function (e) {
                    e.preventDefault();
                    var orderDetailIDReduce = $(this).data("id");
                    var quantity = parseInt($(".qty" + orderDetailIDReduce).text());
                    var price = parseFloat($(".price" + orderDetailIDReduce).text().split("$")[1]);
                    if (quantity > 0) {
                        var quantityReduce = quantity - 1;
                        var totalPrice = parseFloat(price * quantityReduce);
                        $(".qty" + orderDetailIDReduce).text(quantityReduce);
                        if (quantityReduce == 0) {
                            $(".Totalprice" + orderDetailIDReduce).text("$0");
                        } else {
                            $(".Totalprice" + orderDetailIDReduce).text("$" + totalPrice);
                        }

                        if ($("#defaultInline" + orderDetailIDReduce).is(":checked")) {
                            if (quantityReduce == 0) {
                                $("#defaultInline" + orderDetailIDReduce).prop('checked', false);
                            }
                            var TxtTotalPrice = parseFloat($(".txtTotalPriceProductSelect").text().split("$")[1]);
                            TxtTotalPrice -= price;
                            $(".txtTotalPriceProductSelect").text("$" + TxtTotalPrice);
                        }
                    }
                });
                //btn augment quantity and price
                $(document).on("click", ".btnAugment", function (e) {
                    e.preventDefault();
                    var orderDetailIDAugment = $(this).data("id");
                    var quantity = parseInt($(".qty" + orderDetailIDAugment).text());
                    var price = parseFloat($(".price" + orderDetailIDAugment).text().split("$")[1]);
                    if (quantity < 9999) {
                        var quantityInt = quantity + 1;
                        var totalPrice = parseFloat(price * quantityInt);
                        $(".qty" + orderDetailIDAugment).text(quantityInt);
                        $(".Totalprice" + orderDetailIDAugment).text("$" + totalPrice);


                        if ($("#defaultInline" + orderDetailIDAugment).is(":checked")) {
                            var TxtTotalPrice = parseFloat($(".txtTotalPriceProductSelect").text().split("$")[1]);
                            TxtTotalPrice += price;
                            $(".txtTotalPriceProductSelect").text("$" + TxtTotalPrice);
                        }
                    }
                });
                //btn click add address

                $(document).on("click", "#btnAddress", function (e) {
                    e.preventDefault();
                    cartID = $(this).data("id");
                    getAllDistrict();
                    $("#modalAddress").modal('show');
                    var districtSelected = $("#district option:selected").val();
                    if (districtSelected == "") {
                        $("#ward").attr("disabled", "disabled");
                    }
                });
            }
        },
        error: function (respose) {
            if (respose.statusCode == 404) {
                window.location.href = "/Home/error404"
            }
        }
    });


};


//btn click advanced address
$(document).on("click", "#advancedAddress", function (e) {
    e.preventDefault();
    if (arrItem.length > 0) {
        var rowsProduct = '';
        for (let item of arrItem) {
            var image = $("#imageProduct" + item).data("id");
            var name = $(".productNameCart" + item).text();
            var category = $(".categoryNameCart" + item).text();
            rowsProduct += ` <!--Grid row-->
                                            <div class="row">

                                                <!--Grid column-->
                                                <div class="col-md-5 mb-4">

                                                    <img src="${image}" class="img-fluid z-depth-1-half"
                                                         alt="Second sample image">
                                                    <hr class="mb-3">
                                                    <h4>${name}</h4>
                                                    <h5>${category}</h5>

                                                </div>
                                                <!--Grid column-->
                                                <!--Grid column-->
                                                <div class="col-md-7 mb-4">

                                                    <div class="row mt-3">
                                                        <div class="col-md-6">
                                                            <input type="text" class="form-control" id="fullNameReceiving${item}" placeholder="Enter your full name..." />
                                                        </div>
                                                        <div class="col-md-6">
                                                            <input type="text" id="phoneReceiving${item}" class="form-control" placeholder="Enter your phone..." />
                                                        </div>
                                                    </div><!--Grid row-->
                                                    <hr class="mb-4">
                                                    <div class="col-md-12">
                                                        <select class="custom-select d-block w-100 messageSelect" id="cardMessage${item}" required>
                                                            <option value="">Choose message...</option>

                                                        </select>
                                                    </div>
                                                    <hr class="mb-2">

                                                    <div class="col-md-12">
                                                        <div class="form-group shadow-textarea">
                                                            <textarea class="form-control z-depth-1" id="exampleFormControlTextarea6${item}" rows="3" placeholder="Write note something here..."></textarea>
                                                        </div>
                                                    </div>
                                                    <hr class="mb-2">
                                                </div>
                                                <!--Grid column-->

                                            </div>
                                            <!--Grid row-->
                                            <hr class="mb-1">`;
            allItemMessage(item);
        }
        $("#tabCheckoutAddons123").html(rowsProduct);
        $("#tabCheckoutAddons123").append(`<div class="btnNextStep">
                                                <hr class="mb-4">
                                                <button class="btn btn-primary btn-lg btn-block b-next btnNextStep3" id="next" type="submit">Next step</button>
                                            </div>`);
    }
});



//btn click next step payment

$(document).on("click", ".btnNextStep3", function (e) {
    e.preventDefault();
    $("#reviewItemCart").addClass('active');
    $("#ReceivingAddress").removeClass('active');

    // Adds class to make nodes green
    $(".nConfirm" + 2).each(function () {
        $(this).addClass("done");
    });

    // Progress bar animation
    var pBar = (2 / 3) * 100;
    $(".pBar").css("width", `${pBar}%`);

    var Data = new Array();
    for (let item of arrItem) {
        var valData = new Object();
        var fullName = $("#fullNameReceiving" + item).val();
        var phone = $("#phoneReceiving" + item).val();
        var messageID = $("#cardMessage" + item).val();
        var note = $("#exampleFormControlTextarea6" + item).val();
        var quantity = $(".qty" + item).text();
        valData.cartID = item;
        valData.fullName = fullName;
        valData.phone = phone;
        valData.messageID = messageID;
        valData.note = note;
        valData.quantity = quantity;
        if (Data.includes(item) == false) {
            Data.push(valData);
        }
    }

    if (Data.length > 0) {
        addItemToPayment(Data);
    }

});

//change address default
$(document).on("change", "#safeTheInfo", function (e) {
    e.preventDefault();
    if ($(this).is(":checked")) {
        $(".useAddressDefault").removeAttr("style");
    } else {
        $(".useAddressDefault").attr("style","display: none");
    }
});

//func add item to payment
function addItemToPayment(valData) {
    $.ajax({
        url: "/Home/updateItemCart",
        type: 'POST',
        dataType: 'json',
        contentType: "application/json; charset=UTF-8",
        data: JSON.stringify(valData),
        success: function (respose) {
            console.log(respose);
        }
    });
};






//change cardmessage
$(document).on("change", ".messageSelect", function (e) {
    e.preventDefault();
    valueCardSelected = $(this).val();
    if (valueCardSelected != "") {
        $("#modalCardBirthDay").modal('show');
        var message = '';
        var rowsMessageModal = '';
        for (let item of DataJsonMessage) {
            if (item.messageID == valueCardSelected) {
                message = item.message;
                rowsMessageModal += `<div class="cardMessage">
                        <div class="back"></div>
                        <div class="front">
                            <div class="imgset">
                                <img width="100%" src="https://1.bp.blogspot.com/-Mgj9-rbs65E/XfMoPSD5gtI/AAAAAAAAURk/NBokE2gSS2cTSJ2em5lZ5hJDuTtRN7UVwCLcBGAsYHQ/s1600/2713997.png">
                            </div>
                        </div>
                        <div class="text-container">
                            <p id="head">${item.name}</p>
                            <p>${message}</p>
                            <p>Hope your day goes great!</p>
                        </div>
                    </div>`;
                $("#bodyMessageShow").html(rowsMessageModal);
                break;
            }
        }
    }
});

//get all item message
function allItemMessage(cartID) {
    $.ajax({
        url: "/Home/getAllMessage",
        type: 'GET',
        dataType: 'json',
        contentType: "application/json; charset=UTF-8",
        success: function (respose) {
            DataJsonMessage = JSON.parse(respose);
            console.log(DataJsonMessage);
            var rowsMessage = '';
            for (let item of DataJsonMessage) {
                rowsMessage += `<option value="${item.messageID}">${item.name}</option>`;
            }
            $("#cardMessage" + cartID).html(rowsMessage);
        },
        error: function (respose) {
            if (respose.statusCode == 404) {
                window.location.href = "/Home/error404"
            }
        }
    });
};

//checked change all items
$(document).on("change", "#ChangeAllItems", function (e) {
    e.preventDefault();
    if ($(this).is(":checked")) {
        for (let item of arrProductActive) {
            var _this = $("#defaultInline" + item.cartID);
            if (_this.is(":checked") == false) {
                _this.prop("checked", true);
                var price = _this.data("price");
                var quantity = parseInt($(".qty" + item.cartID).text());
                if (quantity == 0) {
                    _this.prop('checked', false);
                } else {
                    var txtTotalProduct = parseInt($("#txtCountProductSelect").text());
                    var TxtTotalPrice = parseFloat($(".txtTotalPriceProductSelect").text().split("$")[1]);
                    var totalPrice = parseFloat(price * quantity);
                    var totalPriceNew = TxtTotalPrice + totalPrice;
                    $("#txtCountProductSelect").text(parseInt(txtTotalProduct + 1) + " ");
                    $(".txtTotalPriceProductSelect").text("$" + totalPriceNew);

                    //add to array
                    if (arrItem.includes(item.cartID) == false) {
                        arrItem.push(item.cartID);
                    }
                }
            }
        }
    } else {
        for (let item of arrProductActive) {
            var _this = $("#defaultInline" + item.cartID);
            _this.prop("checked", false);
            var txtTotalProduct = parseInt($("#txtCountProductSelect").text());
            $("#txtCountProductSelect").text(parseInt(txtTotalProduct - 1) + " ");
            var price = _this.data("price");
            var quantity = parseInt($(".qty" + item.cartID).text());
            var TxtTotalPrice = parseFloat($(".txtTotalPriceProductSelect").text().split("$")[1]);
            var totalPrice = parseFloat(price * quantity);
            var totalPriceNew = TxtTotalPrice - totalPrice;
            $(".txtTotalPriceProductSelect").text("$" + totalPriceNew);

            //remove item in array

            var index = arrItem.indexOf(item.cartID);
            if (index > -1) {
                arrItem.splice(index, 1);
            }
        }
    }
});

//btn add address config item order
$(document).on("click", ".btnShopping", function (e) {
    e.preventDefault();
    if (arrItem.length > 0) {
        $("#ReceivingAddress").addClass('active');
        $("#cartOrder").removeClass('active');
        getUser(customerID);
        getAllDistrict();
        if (arrProductActive.length > 0) {
            var rowSum = '';
            var totalPrice = $(".txtTotalPriceProductSelect").text().split("$")[1];
            console.log(arrItem);
            for (let item of arrItem) {
                console.log(item);
                var totalPriceProduct = $(".Totalprice" + item).text();
                var productName = $(".productNameCart" + item).text();
                rowSum += `<hr>
                                            <dl class="row">
                                                <dd class="col-sm-8">
                                                    ${productName}
                                                </dd>
                                                <dd class="col-sm-4">
                                                   ${totalPriceProduct}
                                                </dd>
                                            </dl>`;
            }
            $(".listProductOrder").html(rowSum);
            $("#totalPriceUserPRoduct").html("$" + totalPrice);
        }
    } else {

    }
});

//get user
function getUser(customerID) {
    $.ajax({
        url: "/Home/getUserByID",
        type: 'POST',
        dataType: 'json',
        contentType: "application/json; charset=UTF-8",
        data: JSON.stringify({ customerID: customerID }),
        success: function (respose) {
            dataJsonUser = JSON.parse(respose);
            console.log(dataJsonUser);
            $("#firstName").val(dataJsonUser.firstName);
            $("#lastName").val(dataJsonUser.lastName);
            $("#addressUser").val(dataJsonUser.address);
            $("#phone").val(dataJsonUser.phoneNumber);
        },
        error: function (respose) {
            if (respose.statusCode == 404) {
                window.location.href = "/Home/error404"
            }
        }
    });
};

$(document).on("click", ".btnRedirectOrder", function (e) {
    e.preventDefault();
    $("#ReceivingAddress").removeClass('active');
    $("#cartOrder").addClass('active');
});

//btn delete item product no active
$(document).on("click", ".deleteItemNoActive", function (e) {
    e.preventDefault();
    if (arrProductNoActive.length != 0) {
        deleteItemProduct(arrProductNoActive);
    }
});

//btn delete item selected
$(document).on("click", ".deleteItem", function (e) {
    e.preventDefault();
    if (arrItem.length != 0) {
        deleteItemProduct(arrItem);
    }
});

function deleteItemProduct(arrCartID) {
    $.ajax({
        url: "/Home/removeItem",
        type: 'POST',
        dataType: 'json',
        contentType: "application/json; charset=UTF-8",
        data: JSON.stringify(arrCartID),
        success: function (respose) {
            if (respose == 0) {
                location.reload();
            } else {
                //Show toast
                shortCutFunction = "error";
                msg = respose.status;
                title = "Please try again!";
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

//check product checked
$(document).on("change", "input[type=checkbox]", function (e) {
    e.preventDefault();
    if ($(this).is(":checked")) {
        var cartID = $(this).data("id");
        if (cartID != undefined) {
            var price = $(this).data("price");
            var quantity = parseInt($(".qty" + cartID).text());
            if (quantity == 0) {
                $(this).prop('checked', false);
                //Show toast
                shortCutFunction = "warning";
                msg = "Add quantity to product";
                title = "Please try again!";
                var $toast = toastr[shortCutFunction](msg, title);
                $toastlast = $toast;
                //Show toast
            } else {
                var txtTotalProduct = parseInt($("#txtCountProductSelect").text());
                var TxtTotalPrice = parseFloat($(".txtTotalPriceProductSelect").text().split("$")[1]);
                var totalPrice = parseFloat(price * quantity);
                var totalPriceNew = TxtTotalPrice + totalPrice;
                $("#txtCountProductSelect").text(parseInt(txtTotalProduct + 1) + " ");
                $(".txtTotalPriceProductSelect").text("$" + totalPriceNew);

                //add to array
                if (arrItem.includes("cartID") == false) {
                    arrItem.push(cartID);
                }
            }
        }
    } else {
        var cartID = $(this).data("id");
        if (cartID != undefined) {
            var txtTotalProduct = parseInt($("#txtCountProductSelect").text());
            $("#txtCountProductSelect").text(parseInt(txtTotalProduct - 1) + " ");
            var price = $(this).data("price");
            var quantity = parseInt($(".qty" + cartID).text());
            var TxtTotalPrice = parseFloat($(".txtTotalPriceProductSelect").text().split("$")[1]);
            var totalPrice = parseFloat(price * quantity);
            var totalPriceNew = TxtTotalPrice - totalPrice;
            $(".txtTotalPriceProductSelect").text("$" + totalPriceNew);

            //remove item in array

            var index = arrItem.indexOf(cartID);
            if (index > -1) {
                arrItem.splice(index, 1);
            }
        }
    }
});

//btn click drop item
$(document).on("click", ".deleteOrderItem", function (e) {
    e.preventDefault();
    var cartID = $(this).data("id");
    $.ajax({
        url: "/Home/removeItem",
        type: 'POST',
        dataType: 'json',
        contentType: "application/json; charset=UTF-8",
        data: JSON.stringify({ cartID: cartID }),
        success: function (respose) {
            if (respose == 0) {
                location.reload();
            } else {
                //Show toast
                shortCutFunction = "error";
                msg = respose.status;
                title = "Please try again!";
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
});

//func get all district
function getAllDistrict() {
    $.ajax({
        url: "/Home/getAllDistrict",
        type: 'GET',
        dataType: 'json',
        contentType: "application/json; charset=UTF-8",
        success: function (respose) {
            dataJsonDistrict = JSON.parse(respose);
            console.log(dataJsonDistrict);
            if (dataJsonDistrict != undefined) {
                var rowsOption = '';
                for (let item of dataJsonDistrict) {
                    rowsOption += `<option value="${item.districtID}">${item.name}</option>`
                }
                $("#district").append(rowsOption);
                $("#districtUser").append(rowsOption);
                $('#district').selectize({
                    sortField: 'text'
                });

                //select change district
                $(document).on("change", "#district", function (e) {
                    var optionSelected = $("option:selected", this);
                    valueSelectedDistrict = $(this).val();
                    if (valueSelectedDistrict != "") {
                        $("#ward").removeAttr("disabled");
                        var wards = dataJsonDistrict[valueSelectedDistrict].tbl_ward;
                        var wardRow = '';
                        for (let item of wards) {
                            wardRow += `<option value="${item.wardID}">${item.name}</option>`
                        }
                        $("#ward").html(wardRow);
                    }
                });

                //select change district
                $(document).on("change", "#districtUser", function (e) {
                    valueSelectedDistrict = $(this).val();
                    if (valueSelectedDistrict != "") {
                        $("#wardUser").removeAttr("disabled");
                        var wards = dataJsonDistrict[valueSelectedDistrict].tbl_ward;
                        var wardRow = '';
                        for (let item of wards) {
                            wardRow += `<option value="${item.wardID}">${item.name}</option>`
                        }
                        $("#wardUser").html(wardRow);
                    }
                });
            }
        },
        error: function (respose) {
            if (respose.statusCode == 404) {
                window.location.href = "/Home/error404"
            }
        }
    });
};

//func get value ward select
$(document).on("change", "#ward", function (e) {
    e.preventDefault();
    valueSelectedWard = $(this).val();
    if (valueSelectedWard == "") {
        $(this).css("border", "1px solid red");
        //Show toast
        shortCutFunction = "error";
        msg = "ward required!";
        title = "Please select ward!";
        var $toast = toastr[shortCutFunction](msg, title);
        $toastlast = $toast;
        //Show toast
    }
});
//btn add  click

$(document).on("click", "#BtnAddAddress", function (e) {
    e.preventDefault();
    valueSelectedWard = $("#ward option:selected").val();
    if (valueSelectedDistrict == undefined || valueSelectedWard == undefined) {
        //Show toast
        shortCutFunction = "error";
        msg = "district and ward required!";
        title = "Please select ward!";
        var $toast = toastr[shortCutFunction](msg, title);
        $toastlast = $toast;
        //Show toast
    } else {
        var address = $("#address").val();
        if (address == "") {
            //Show toast
            shortCutFunction = "error";
            msg = "address required!";
            title = "Please enter address!";
            var $toast = toastr[shortCutFunction](msg, title);
            $toastlast = $toast;
            //Show toast
        } else {
            updateAddress(cartID, valueSelectedDistrict, valueSelectedWard, address);
        }
    }
});

//func update address cart
function updateAddress(cartID, districtID, wardID, address) {
    $.ajax({
        url: "/Home/addAddressOrderDetail",
        type: 'POST',
        dataType: 'json',
        contentType: "application/json; charset=UTF-8",
        data: JSON.stringify({ cartID: cartID, districtID: districtID, wardID: wardID, address: address }),
        success: function (respose) {
            console.log(respose);
            if (respose == 1) {
                //Show toast
                shortCutFunction = "error";
                msg = "No add new address!";
                title = "Please enter address!";
                var $toast = toastr[shortCutFunction](msg, title);
                $toastlast = $toast;
                //Show toast
            } else {
                location.reload();
            }
        },
        error: function (respose) {
            if (respose.statusCode == 404) {
                window.location.href = "/Home/error404"
            };
        }
    });
};

//btn redirect add Address
$(document).on("click", ".btnRedirectAddress", function (e) {
    e.preventDefault();
    // removes class that makes nodes green
    $(".nConfirm" + 2).each(function () {
        $(this).removeClass("done");
    });

    // Progress bar animation
    var pBar = (1 / 3) * 100;
    $(".pBar").css("width", `${pBar}%`);

    $("#reviewItemCart").removeClass('active');
    $("#ReceivingAddress").addClass('active');
});

var state = 0;
var stateMax = 3;

function next() {
    console.log("Next", state);
    // browser side functions here
}

function back() {
    console.log("Back", state);
    // browser side functions here
}

$("#next").click(function () {
    if (state < stateMax) {
        next();

        state += 1;

        // Enables 'back' button if disabled
        $("#back").removeClass("disabled");

        // Adds class to make nodes green
        $(".nConfirm" + state).each(function () {
            $(this).addClass("done");
        });

        // Progress bar animation
        var pBar = (state / stateMax) * 100;
        $(".pBar").css("width", `${pBar}%`);

        // Disables 'next' button if end of steps
        if (state == 3) {
            $("#next").addClass("disabled");
        }
    }
});

$("#back").click(function () {
    if (state > 0) {
        back();


        // Enables 'next' button if disabled
        $("#next").removeClass("disabled");

        // removes class that makes nodes green
        $(".nConfirm" + state).each(function () {
            $(this).removeClass("done");
        });

        state -= 1;

        // Progress bar animation
        var pBar = (state / stateMax) * 100;
        $(".pBar").css("width", `${pBar}%`);

        // Disables 'back' button if end of steps
        if (state == 0) {
            $("#back").addClass("disabled");
        }
    }
});



