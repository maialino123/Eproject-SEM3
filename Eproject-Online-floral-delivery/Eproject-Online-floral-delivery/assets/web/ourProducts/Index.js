
let DataResposeJsonProduct, minPrice;
$(document).ready(function (e) {
    allProduct();
    allCategory();
});


$(".profile").on("click", function (e) {
    e.preventDefault();
    var className = $(".menu").attr('class');
    if (className.search("active") != -1) {
        $(".menu").removeClass('active');
    } else {
        $(".menu").addClass('active');
    }
    e.stopPropagation();
});
$(window).click(function (e) {
    $(".menu").removeClass('active');
});

//get all product and pagging 
async function allProduct() {
    await $.ajax({
        url: "/Home/ourProduct",
        type: 'GET',
        dataType: 'json',
        contentType: "application/json; charset=UTF-8",
        success: function (respose) {
            DataResposeJsonProduct = JSON.parse(respose);
            console.log(DataResposeJsonProduct);
            minPrice = DataResposeJsonProduct[0].price;
            $("input[type=range]").attr("min", DataResposeJsonProduct[0].price);
            $("#resellerEarnings").text("$" + DataResposeJsonProduct[0].price);
            $("input[type=range]").attr("max", DataResposeJsonProduct[Object.keys(DataResposeJsonProduct).length - 1].price);
            $("#clientPrice").text("$" + DataResposeJsonProduct[Object.keys(DataResposeJsonProduct).length - 1].price);
            $("#pagination-container").pagination({
                dataSource: DataResposeJsonProduct,
                totalNumber: Object.keys(DataResposeJsonProduct).length,
                pageSize: 12,
                showPageNumbers: true,
                showPrevious: true,
                showNext: true,
                showNavigator: true,
                showFirstOnEllipsisShow: true,
                showLastOnEllipsisShow: true,
                ajax: {
                    beforeSend: function () {
                        $("#contentProduct").html(`<div class="spinner-border text-dark" role="status">
                                                        <span class="sr-only">Loading...</span>
                                                    </div>`);
                    }
                },
                callback: function (DataResposeJsonProduct, pagination) {
                    console.log(DataResposeJsonProduct,pagination);
                    var html = templateHTML(DataResposeJsonProduct);
                    $("#contentProduct").html(html);
                    $("#paginationjs-pages").attr("style", "display: inline-block");
                    
                }
            });
        },
        error: function (respose) {
            window.location.href = "/Home/error404"
        }
    });

};
const numberWithCommas = (number) => { return number.toString().replace("/\B(\d{3}) + (?!\d))/g", ",") };
function templateHTML(data) {
    var html = '';
    for (let item of data) {
        let img = "/MyImages/" + item.tbl_imageList[0].name + item.tbl_imageList[0].extendsion;
        let price = numberWithCommas(item.price);
        let priceSale = numberWithCommas(item.priceSale);
        let nameProduct = item.name.substring(0, 23).concat('...');
        html += `<div class="col-lg-3 col-md-12 mb-4">

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
    return html;
}


//range price
$(document).on('change', '#rangePrice', function (e) {
    e.preventDefault();
    console.log($(this).val());
    var priceMaxFill = $(this).val();
    $.ajax({
        url: "/Home/productByPrice",
        type: 'POST',
        dataType: 'json',
        contentType: "application/json; charset=UTF-8",
        data: JSON.stringify({ min: minPrice, max: priceMaxFill }),
        success: function (respose) {
            DataFilterJsonPrice = JSON.parse(respose);
            $("#pagination-container").pagination({
                dataSource: DataFilterJsonPrice,
                totalNumber: Object.keys(DataFilterJsonPrice).length,
                pageSize: 12,
                showPageNumbers: true,
                showPrevious: true,
                showNext: true,
                showNavigator: true,
                showFirstOnEllipsisShow: true,
                showLastOnEllipsisShow: true,
                ajax: {
                    beforeSend: function () {
                        $("#contentProduct").html(`<div class="spinner-border text-dark" role="status">
                                                        <span class="sr-only">Loading...</span>
                                                    </div>`);
                    }
                },
                callback: function (DataFilterJsonPrice, pagination) {
                    console.log(DataFilterJsonPrice, pagination);
                    var html = templateHTML(DataFilterJsonPrice);
                    $("#contentProduct").html(html);
                    $("#paginationjs-pages").attr("style", "display: inline-block");
                }
            });
        }
    });
});

//get all category
function allCategory() {
    $.ajax({
        url: "/Admin/CategoryAll",
        type: 'GET',
        dataType: 'json',
        contentType: "application/json; charset=UTF-8",
        success: function (respose) {
            DataJsonCategory = JSON.parse(respose);
            var rows = `<div class="form-check pl-0 mb-2">
                                            <input type="radio" class="form-check-input" id="materialGroupExample1" name="groupOfMaterialRadios" checked>
                                            <label class="form-check-label" for="materialGroupExample1">All</label>
                                        </div>`;
            for (let item of DataJsonCategory) {
                rows += `<div class="form-check pl-0 mb-2">
                                            <input type="radio" data-id="${item.categoryID}" class="form-check-input" id="categorySelect${item.categoryID}" name="groupOfMaterialRadios"
                                                   >
                                            <label class="form-check-label" for="categorySelect${item.categoryID}">${item.name}</label>
                                        </div>`;
            }
            $("#categoryAll").html(rows);
        }
    });
};

$(document).on("change", "input[type=radio]", function (e) {
    e.preventDefault();
    if ($(this).is(":checked")) {
        var categoryID = $(this).data("id");
        console.log(categoryID);
        if (categoryID == undefined) {
            allProduct();
        } else {
            getProductByCate(categoryID);
        }
    }
});

//func get products by category
function getProductByCate(categoryID) {
    $.ajax({
        url: "/Home/getProductByCategoryID",
        type: 'POST',
        dataType: 'json',
        contentType: "application/json; charset=UTF-8",
        data: JSON.stringify({ categoryID: categoryID }),
        success: function (respose) {
            DataJsonProductByCategory = JSON.parse(respose);
            $("#pagination-container").pagination({
                dataSource: DataJsonProductByCategory,
                totalNumber: Object.keys(DataJsonProductByCategory).length,
                pageSize: 12,
                showPageNumbers: true,
                showPrevious: true,
                showNext: true,
                showNavigator: true,
                showFirstOnEllipsisShow: true,
                showLastOnEllipsisShow: true,
                ajax: {
                    beforeSend: function () {
                        $("#contentProduct").html(`<div class="spinner-border text-dark" role="status">
                                                        <span class="sr-only">Loading...</span>
                                                    </div>`);
                    }
                },
                callback: function (DataJsonProductByCategory, pagination) {
                    console.log(DataJsonProductByCategory, pagination);
                    var html = templateHTML(DataJsonProductByCategory);
                    $("#contentProduct").html(html);
                    $("#paginationjs-pages").attr("style", "display: inline-block");
                }
            });
        }
    });
};

//btn show view 
$(document).on("click", "#Popularity", function (e) {
    e.preventDefault();
    $.ajax({
        url: "/Home/getAllProductByView",
        type: 'GET',
        dataType: 'json',
        contentType: "application/json; charset=UTF-8",
        success: function (respose) {
            DataJsonProductCountView = JSON.parse(respose);
            $("#pagination-container").pagination({
                dataSource: DataJsonProductCountView,
                totalNumber: Object.keys(DataJsonProductCountView).length,
                pageSize: 12,
                showPageNumbers: true,
                showPrevious: true,
                showNext: true,
                showNavigator: true,
                showFirstOnEllipsisShow: true,
                showLastOnEllipsisShow: true,
                ajax: {
                    beforeSend: function () {
                        $("#contentProduct").html(`<div class="spinner-border text-dark" role="status">
                                                        <span class="sr-only">Loading...</span>
                                                    </div>`);
                    }
                },
                callback: function (DataJsonProductCountView, pagination) {
                    var html = templateHTML(DataJsonProductCountView);
                    $("#contentProduct").html(html);
                    $("#paginationjs-pages").attr("style", "display: inline-block");
                }
            });
        }
    });
});
//btn default 
$(document).on("click", "#default", function (e) {
    e.preventDefault();
    allProduct();
});
//btn click sort price desc
$(document).on("click", "#sortPriceDesc", function (e) {
    e.preventDefault();
    $.ajax({
        url: "/Home/sortProductByPrice",
        type: 'POST',
        dataType: 'json',
        contentType: "application/json; charset=UTF-8",
        data: JSON.stringify({ type: "desc" }),
        success: function (respose) {
            dataProductSortAsc = JSON.parse(respose);
            $("#pagination-container").pagination({
                dataSource: dataProductSortAsc,
                totalNumber: Object.keys(dataProductSortAsc).length,
                pageSize: 12,
                showPageNumbers: true,
                showPrevious: true,
                showNext: true,
                showNavigator: true,
                showFirstOnEllipsisShow: true,
                showLastOnEllipsisShow: true,
                ajax: {
                    beforeSend: function () {
                        $("#contentProduct").html(`<div class="spinner-border text-dark" role="status">
                                                        <span class="sr-only">Loading...</span>
                                                    </div>`);
                    }
                },
                callback: function (dataProductSortAsc, pagination) {
                    console.log(dataProductSortAsc, pagination);
                    var html = templateHTML(dataProductSortAsc);
                    $("#contentProduct").html(html);
                    $("#paginationjs-pages").attr("style", "display: inline-block");
                }
            });
        }
    });
});

//btn click sort
$(document).on("click", "#sortPriceAsc", function (e) {
    e.preventDefault();
    $.ajax({
        url: "/Home/sortProductByPrice",
        type: 'POST',
        dataType: 'json',
        contentType: "application/json; charset=UTF-8",
        data: JSON.stringify({ type: "asc" }),
        success: function (respose) {
            dataProductSortAsc = JSON.parse(respose);
            $("#pagination-container").pagination({
                dataSource: dataProductSortAsc,
                totalNumber: Object.keys(dataProductSortAsc).length,
                pageSize: 12,
                showPageNumbers: true,
                showPrevious: true,
                showNext: true,
                showNavigator: true,
                showFirstOnEllipsisShow: true,
                showLastOnEllipsisShow: true,
                ajax: {
                    beforeSend: function () {
                        $("#contentProduct").html(`<div class="spinner-border text-dark" role="status">
                                                        <span class="sr-only">Loading...</span>
                                                    </div>`);
                    }
                },
                callback: function (dataProductSortAsc, pagination) {
                    console.log(dataProductSortAsc, pagination);
                    var html = templateHTML(dataProductSortAsc);
                    $("#contentProduct").html(html);
                    $("#paginationjs-pages").attr("style", "display: inline-block");
                }
            });
        }
    });
});