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
    $('#dtBasicExample').DataTable();
    $('.dataTables_length').addClass('bs-select');
    
    loadOrder();
});


function loadOrder() {
    $.ajax({
        url: "/Admin/Orders",
        type: 'GET',
        dataType: 'json',
        contentType: "application/json; charset=UTF-8",
        success: function (respose) {
            DataOrderJson = JSON.parse(respose);
            console.log(DataOrderJson);
            var index = 1;
            var indexDetail = 1;
            var rows = ``;
            for (let item of DataOrderJson) {
                rows += `<tr data-tt-id="${index}">
                    <td>${item.orderID}</td>
                    <td>...</td>
                    <td>${item.tbl_customer.firstName + " " + item.tbl_customer.lastName}</td>
                    <td>${item.tbl_customer.phoneNumber}</td>
                    <td>${item.tbl_customer.address}</td>
                    <td>...</td>
                    <td>${item.dateOfStart}</td>
                    <td>...</td>
                    <td>${item.tbl_statusOrder.name}</td>
                </tr>`;
                for (let itemDetail of item.tbl_orderDetail) {
                    rows += `<tr data-tt-id="${index + "." + indexDetail}" data-tt-parent-id="${index}">
                    <td>...</td>
                    <td>${itemDetail.tbl_product.name}</td>
                    <td>${itemDetail.fullName}</td>
                    <td>${itemDetail.phone}</td>
                    <td>${itemDetail.address}</td>
                    <td>${itemDetail.quantity}</td>
                    <td>...</td>
                    <td>$${itemDetail.unitPrice}</td>
                    <td>${item.tbl_statusOrder.name}</td>
                </tr>`;
                    indexDetail++;
                }
                index++;
            }
            $("#contentOrder").html(rows);
            $("#dtBasicExample").treetable({
                expandable: true
            });
        },
        error: function (respose) {
            window.location.href = "/Home/error404"
        }
    });
};


