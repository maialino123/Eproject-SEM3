using Eproject_Online_floral_delivery.common.payment;
using Eproject_Online_floral_delivery.DAL;
using Eproject_Online_floral_delivery.Models;
using Eproject_Online_floral_delivery.Repository;
using PayPal.Api;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Eproject_Online_floral_delivery.Controllers
{
    public class PaymentController : Controller
    {
        private GenericUnitOfWork _unitOfWork = new GenericUnitOfWork();
        private Eproject_FloralEntities DbEntities = new Eproject_FloralEntities();
        // GET: Payment
        public ActionResult PaymentWithPayPal(string Cancel = null)
        {
            //Initialize APIContext
            APIContext apiContext = PaypalConfiguration.GetAPIContext();
            try
            {
                string PayerId = Request.Params["PayerID"];
                if (string.IsNullOrEmpty(PayerId))
                {
                    string baseURI = Request.Url.Scheme + "://" + Request.Url.Authority + "/Payment/PaymentWithPayPal?";
                    var guid = Convert.ToString((new Random()).Next(100000));
                    var createPayment = this.CreatePayment(apiContext, baseURI + "guid=" + guid);

                    var links = createPayment.links.GetEnumerator();
                    string paypalRedirectURL = null;

                    while (links.MoveNext())
                    {
                        Links lnk = links.Current;

                        if (lnk.rel.ToLower().Trim().Equals("approval_url"))
                        {
                            paypalRedirectURL = lnk.href;
                        }
                    }
                    Session.Add(guid, createPayment.id);
                    return Redirect(paypalRedirectURL);
                }
                else
                {
                    var guid = Request.Params["guid"];
                    var executePayment = ExecutePayment(apiContext, PayerId, Session[guid] as string);
                    if (executePayment.state.ToLower() != "approved")
                    {
                        return View("FailureView");
                    }
                }
            }
            catch (PayPal.PaymentsException ex)
            {
                ViewBag.errorPayment = ex.Response;
                return View("FailureView");
            }
            Hashtable orderTable = new Hashtable();
            DateTime nowDate = DateTime.Now;
            foreach (var item in (List<PaymentModel>)Session["cart"])
            {
                var checkOrder = DbEntities.tbl_order.Where(x => x.customerID == item.customerID && x.status == true && x.statusOrderID == 1).ToList();
                if (checkOrder.Count == 0)
                {
                    tbl_order order = new tbl_order
                    {
                        userName = item.fullName,
                        dateOfStart = nowDate,
                        dateOffinish = null,
                        status = true,
                        shippingTypeID = 1,
                        customerID = item.customerID,
                        promotionPrice = item.promotionPrice,
                        paymentTypeID = 1,
                        statusOrderID = 1
                    };
                    _unitOfWork.GetRepositoryInstance<tbl_order>().Add(order);

                    tbl_orderDetail orderDetailADD = new tbl_orderDetail
                    {
                        productID = item.productID,
                        messageID = item.messageID,
                        districtID = item.districtID,
                        orderID = order.orderID,
                        unitPrice = item.unitPrice,
                        address = item.address,
                        note = item.note,
                        phone = item.phone,
                        quantity = item.quantity,
                        wardID = item.wardID,
                        fullName = item.fullName
                    };
                    _unitOfWork.GetRepositoryInstance<tbl_orderDetail>().Add(orderDetailADD);
                }
                else
                {
                    foreach (var itemOrder in checkOrder)
                    {
                        var itemOrderDetail = DbEntities.tbl_orderDetail.Where(x => x.orderID == itemOrder.orderID
                        && x.productID == item.productID
                        && x.address.ToLower().Equals(item.address.ToLower())
                        && x.districtID == item.districtID
                        && x.wardID == item.wardID
                        && x.fullName.ToLower().Equals(item.fullName.ToLower())
                        && x.phone.Equals(item.phone)).FirstOrDefault();
                        if (itemOrderDetail != null)
                        {
                            tbl_orderDetail orderDetailDublicate = new tbl_orderDetail
                            {
                                orderDetailID = itemOrderDetail.orderDetailID,
                                productID = itemOrderDetail.productID,
                                messageID = itemOrderDetail.messageID,
                                districtID = itemOrderDetail.districtID,
                                orderID = itemOrderDetail.orderID,
                                unitPrice = itemOrderDetail.unitPrice,
                                address = itemOrderDetail.address,
                                note = itemOrderDetail.note,
                                phone = itemOrderDetail.phone,
                                quantity = itemOrderDetail.quantity + item.quantity,
                                wardID = itemOrderDetail.wardID,
                                fullName = itemOrderDetail.fullName
                            };
                            _unitOfWork.GetRepositoryInstance<tbl_orderDetail>().Update(orderDetailDublicate);
                        }
                        else
                        {
                            var itemOrderDetailCheck = DbEntities.tbl_orderDetail.Where(x => x.orderID == itemOrder.orderID && x.districtID == item.districtID && x.wardID == item.wardID && x.address == item.address && x.productID != item.productID).FirstOrDefault();
                            if (itemOrderDetailCheck == null)
                            {
                                tbl_order order = new tbl_order
                                {
                                    userName = item.fullName,
                                    dateOfStart = nowDate,
                                    dateOffinish = null,
                                    status = true,
                                    shippingTypeID = 1,
                                    customerID = item.customerID,
                                    promotionPrice = item.promotionPrice,
                                    paymentTypeID = 1,
                                    statusOrderID = 1
                                };
                                _unitOfWork.GetRepositoryInstance<tbl_order>().Add(order);

                                tbl_orderDetail orderDetailADD = new tbl_orderDetail
                                {
                                    productID = item.productID,
                                    messageID = item.messageID,
                                    districtID = item.districtID,
                                    orderID = order.orderID,
                                    unitPrice = item.unitPrice,
                                    address = item.address,
                                    note = item.note,
                                    phone = item.phone,
                                    quantity = item.quantity,
                                    wardID = item.wardID,
                                    fullName = item.fullName
                                };
                                _unitOfWork.GetRepositoryInstance<tbl_orderDetail>().Add(orderDetailADD);
                            }
                            else
                            {
                                tbl_orderDetail orderDetailADD1 = new tbl_orderDetail
                                {
                                    productID = item.productID,
                                    messageID = item.messageID,
                                    districtID = item.districtID,
                                    orderID = itemOrderDetailCheck.orderID,
                                    unitPrice = item.unitPrice,
                                    address = item.address,
                                    note = item.note,
                                    phone = item.phone,
                                    quantity = item.quantity,
                                    wardID = item.wardID,
                                    fullName = item.fullName
                                };
                                _unitOfWork.GetRepositoryInstance<tbl_orderDetail>().Add(orderDetailADD1);

                                var updateOrder = DbEntities.tbl_order.Find(orderDetailADD1.orderID);
                                tbl_order updateOrderModel = new tbl_order
                                {
                                    orderID = updateOrder.orderID,
                                    userName = updateOrder.userName,
                                    dateOfStart = updateOrder.dateOfStart,
                                    dateOffinish = null,
                                    status = updateOrder.status,
                                    shippingTypeID = updateOrder.shippingTypeID,
                                    customerID = updateOrder.customerID,
                                    promotionPrice = updateOrder.promotionPrice + orderDetailADD1.unitPrice,
                                    paymentTypeID = updateOrder.paymentTypeID,
                                    statusOrderID = updateOrder.statusOrderID
                                };
                                _unitOfWork.GetRepositoryInstance<tbl_order>().Update(updateOrderModel);
                            }
                        }
                    }
                }

                var product = DbEntities.tbl_product.Find(item.productID);

                tbl_product model = new tbl_product
                {
                    productID = product.productID,
                    name = product.name,
                    price = product.price,
                    priceSale = product.priceSale,
                    dayStartSale = product.dayStartSale,
                    dayEndSale = product.dayEndSale,
                    image = product.image,
                    isActive = product.isActive,
                    isFeatured = product.isFeatured,
                    createdDate = product.createdDate,
                    modifiedDate = product.modifiedDate,
                    quantity = product.quantity - item.quantity,
                    metaTitle = product.metaTitle,
                    description = product.description,
                    metaKeyword = product.metaKeyword,
                    countView = product.countView + 1,
                    categoryID = product.categoryID
                };
                _unitOfWork.GetRepositoryInstance<tbl_product>().Update(model);


                var cartRemove = DbEntities.tbl_cart.Find(item.cartID);
                DbEntities.tbl_cart.Remove(cartRemove);
                DbEntities.SaveChanges();
            }
            return View("SuccessView");
        }

        private PayPal.Api.Payment payment;
        private Payment ExecutePayment(APIContext apiContext, string payerId, string paymentId)
        {
            var paymentExecution = new PaymentExecution()
            {
                payer_id = payerId
            };
            this.payment = new Payment()
            {
                id = paymentId
            };
            return this.payment.Execute(apiContext, paymentExecution);
        }

        private Payment CreatePayment(APIContext apiContext, string redirectURL)
        {
            var itemList = new ItemList()
            {
                items = new List<Item>()
            };
            if (Session["cart"] != "")
            {
                long totalPriceProduct = 0;
                foreach (var item in (List<PaymentModel>)Session["cart"])
                {
                    totalPriceProduct += item.unitPrice;
                    itemList.items.Add(new Item()
                    {
                        name = item.productName.ToString(),
                        currency = "USD",
                        price = item.promotionPrice.ToString(),
                        quantity = item.quantity.ToString(),
                        sku = "sku"
                    });
                }

                var payer = new Payer()
                {
                    payment_method = "paypal"
                };

                var redieUrls = new RedirectUrls()
                {
                    cancel_url = redirectURL + "&Cancel=true",
                    return_url = redirectURL
                };

                var details = new Details()
                {
                    tax = "1",
                    shipping = "1",
                    subtotal = totalPriceProduct.ToString()
                };

                var amount = new Amount()
                {
                    currency = "USD",
                    total = (totalPriceProduct + 2).ToString(), // Total must be equal to sum of tax, shipping and subtotal.  
                    details = details
                };

                var transactionList = new List<Transaction>();
                // Adding description about the transaction  
                transactionList.Add(new Transaction()
                {
                    description = "Transaction description",
                    amount = amount,
                    item_list = itemList
                });

                this.payment = new Payment()
                {
                    intent = "sale",
                    payer = payer,
                    transactions = transactionList,
                    redirect_urls = redieUrls
                };
            }
            return this.payment.Create(apiContext);
        }
    }
}