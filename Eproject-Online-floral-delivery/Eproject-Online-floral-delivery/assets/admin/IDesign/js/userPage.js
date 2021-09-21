   $(document).ready(function(){
       $(".select2").select2();
       $("input").attr("disabled", "disabled");
       $("select").attr("disabled","disabled");
       $("label").css("margin-top", "-20px");
       $("#newPassword").removeAttr("disabled");
       $("#enterNewPassword").removeAttr("disabled");
       $("#rePassword").removeAttr("disabled");
       $("#reEnterPassword").removeAttr("disabled");
       $("#OtpResetpassword").removeAttr("disabled");
   });

   $(document).on("click",".saveAsProfiles",function(){
       $(this).html(`<i class="far fa-save"></i>`);
       $(this).addClass("btnSubmit");
       $("input").removeAttr("disabled");
       $("#currentPassword").attr("disabled");
       $("select").removeAttr("disabled");
   });

   $(document).on("click", ".moreOptions", function(e){
      e.preventDefault();
      $(".dropdownOption").addClass("activeShow"); 
      //inside
      e.stopPropagation();
   });
   //outside
   $(window).click(function(){
    $(".dropdownOption").removeClass("activeShow"); 
   })
   
   

   $(document).on("click",".btnSubmit",function(e){
       $(this).html(`<i class="fas fa-pen"></i>`);
       $(this).removeClass("btnSubmit");
       $("input").attr("disabled","disabled");
       $("select").attr("disabled", "disabled");
       $("#newPassword").removeAttr("disabled");
       $("#enterNewPassword").removeAttr("disabled");
       $("#rePassword").removeAttr("disabled");
       $("#reEnterPassword").removeAttr("disabled");
       $("#OtpResetpassword").removeAttr("disabled");
   });


   //.focusInputLabelFirstName,.focusInputLabelLastName,.focusInputLabelPhoneNumber,.focusInputLabelEmail,.focusInputLabelAddress
   $(document).on("focusin","#inputAddress", function(){
           $(this).css("border","1px double #0d47a1");
    });
    $(document).on("focusout", "#inputAddress", function(e){
        e.preventDefault();
        var value = $(this).val();
        if(value == "") {
            $(this).css("border","1px double #d50000");
        } else {
            $(this).css("border","1px double #616161");
        }
    });
   $(document).on("focusin","#inputEmail", function(){
           $(this).css("border","1px double #0d47a1");
    });
    $(document).on("focusout", "#inputEmail", function(e){
        e.preventDefault();
        var value = $(this).val();
        if(value == "") {
            $(this).css("border","1px double #d50000");
        } else {
            $(this).css("border","1px double #616161");
        }
    });
   $(document).on("focusin","#inputPhone", function(){
           $(this).css("border","1px double #0d47a1");
    });
    $(document).on("focusout", "#inputPhone", function(e){
        e.preventDefault();
        var value = $(this).val();
        if(value == "") {
            $(this).css("border","1px double #d50000");
        } else {
            $(this).css("border","1px double #616161");
        }
    });
   $(document).on("focusin","#inputLastName", function(){
           $(this).css("border","1px double #0d47a1");
    });
    $(document).on("focusout", "#inputLastName", function(e){
        e.preventDefault();
        var value = $(this).val();
        if(value == "") {
            $(this).css("border","1px double #d50000");
        } else {
            $(this).css("border","1px double #616161");
        }
    });
    $(document).on("focusin","#inputFirstName", function(){
           $(this).css("border","1px double #0d47a1");
    });
    $(document).on("focusout", "#inputFirstName", function(e){
        e.preventDefault();
        var value = $(this).val();
        if(value == "") {
            $(this).css("border","1px double #d50000");
        } else {
            $(this).css("border","1px double #616161");
        }
    });