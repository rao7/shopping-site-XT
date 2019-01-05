var shoppingCart = {
    serverURL : 'http://localhost:5000/',
    cart : {},
   
    banners : function(){ // the hero slider
        $.ajax({
            url: this.serverURL+'/banners',
            dataType: 'json',
            method:'GET',
            cache:false,
            success: function(res){
                $.each(res, function (index, value) {
                    
                var slideTemplate = '<input type="radio" name="slide" id="r-slide-'+index+'" /> \
                <div class="slide col--12 " id="slide-'+index+'"> \
                <img class="w-100" src=".'+value.bannerImageUrl+'" alt="'+value.bannerImageAlt+'" /> </div>';
                
                var slideNav = '<li><label for="r-slide-'+index+'"></label> </li>';

                $('#heroSlider > .sliderCon').append(slideTemplate);
                $('#heroSlider > ul.pag').append(slideNav);
                $('#heroSlider > ul.pag li:first').children('label').addClass('active').click();    
                
                  });

                  
                  shoppingCart.bannerRotate();
            }

        });
    },

    bannerRotate: function(){ // rotating the slider
        var getSlider = document.querySelector('#heroSlider ul.pag');

        var itemStart = 0;
        var itemCount = getSlider.children.length - 1;

         setInterval(function(){ 
           //  console.log(getSlider.children[itemStart])
         getSlider.children[itemStart].children[0].click();

        if(itemStart == itemCount) { itemStart = 0;}
        else { itemStart++;}
        
        } , 3000 );


      },

    categories:function(selector , nameOnly){ // fetching categories
        $.ajax({
            url: this.serverURL+'/categories',
            dataType: 'json',
            method:'GET',
            cache:false,
            success: function(res){
                $.each(res, function (index, value) {

                if(nameOnly != true ){

                var catTemplate = '<div style="order:'+value.order+'" class=" row dropShadow bg-f center--V center--H m-y-1">\
                     <figure class="col--4 col--4--s p-1">\
                    <img class="w-100 p-half" src=".'+value.imageUrl+'" alt="'+value.name+'">\
                </figure>\
                <article class="col--7 col--8--s _C p-1">\
                    <h2 class="p-1 fs-30">'+value.name+'</h2>\
                    <p class="p-1">'+value.description+'</p>\
                    <a href="products.html" data-id="'+value.id+'" class="btn btn--p m-y-1">'+value.name+'</a>\
                </article>\
                 </div>';
                 
                   
                }

                else{
                    var catTemplate = '<li><label data-catid="'+value.id+'" for="filterDown">'+value.name+'</label></li>'
                }

                if(value.imageUrl){ $(selector).append(catTemplate); }
                
                  });
            }

        });
    },

    products: function(){ // fetching products for PLP page

        $.ajax({
            url: this.serverURL+'/products',
            dataType: 'json',
            method:'GET',
            cache:false,
            success: function(res){

                if (typeof(Storage) !== "undefined") {
                  
                    if(!sessionStorage.products){
                        sessionStorage.setItem('products', JSON.stringify(res));
                    }

                } 

                $.each(res, function (index, value) {
                    
                var productTemplate = '<article data-sku ="'+value.sku+'" class="product__listItem  center--H col--3 row cat--'+value.category+'">\
                    \
                <h3 class="item__name fs-16 fw-7 camelCase col--11"> '+value.name+'</h3>\
                    \
                <figure class="item__img p-half col--11 col--6--s ">\
                    <img src=".'+value.imageURL+'" alt="" class="w-100">\
                </figure>\
                    \
                <div class="col--11 col--6--s row center--V">\
                    <p class="item__desc col--12"> '+value.description+'</p>\
                     <p class="item__price col--6 p-1 fw-6">  MRP. Rs '+value.price+'  </p>\
                    \
                    <p class="item__buy col--6">\
                        <button onClick= shoppingCart.buyNow("'+value.id+'","'+value.stock+'") data-stock ="'+value.stock+'" class="btn btn--p w-100 bdr-0 m-y-1" >  Buy Now </button>\
                    </p>\
                </div>\
            </article>';
                
               $('#productCon').append(productTemplate);
                
                  });
            }

        });

    },
    buyNow:function(pid , stock){

        

        if(!this.cart[pid]){
            this.cart[pid] = 1;
            sessionStorage.setItem('cart',JSON.stringify(this.cart));

        }else{

            this.plusMinusItem('plus', pid);
        }

        this.getcart();
       // console.log(this.cart);

    },
    getcart: function(){

        //debugger;
        if (typeof(Storage) !== "undefined") {
                  
                if(!sessionStorage.getItem('cart')){
                sessionStorage.setItem('cart', JSON.stringify(this.cart));
                //console.log(sessionStorage.getItem('cart'));
                }else{
                    var cartValue = sessionStorage.getItem('cart');
                    //console.log(JSON.parse(cartValue));
                    var count = Object.keys(JSON.parse(cartValue)).length;
 
                    $('.bucketSize').html(count+' Item');
                    this.updateCart();
                }

          } 
    }, 

    updateCart : function(){

        var finalCart = [];

        if(Object.keys(JSON.parse(sessionStorage.cart)).length > 0 ){

        $.each(Object.keys(JSON.parse(sessionStorage.cart)), function( index, valueid ) {
            var updateCart = JSON.parse(sessionStorage.getItem('products')).filter(function(el){
               // console.log(el.id == valueid);
               return el.id == valueid;
     
            });
                
                 finalCart.push(updateCart[0]);
             });
         // console.log(finalCart);

          var totalPrice = 0;
          var cartItemTemplate = '';
          $.each(finalCart, function (index, value) {
            var perItemCount = JSON.parse(sessionStorage.cart);
          cartItemTemplate += ' <article class="cart-item row col--12 bg-f" >\
          <figure class="col--2--s p-half "> <img src=".'+value.imageURL+'" alt="'+value.name+'" class="w-100" ></figure>\
          <p class="col--8--s p-half">\
              <strong class="dB">'+value.name+'</strong>\
              <span class="incItem p-half dIB">\
                      <label for="incNum" class="fs-14 bg-p clr-f minus _C hand" onClick = shoppingCart.plusMinusItem("minus","'+value.id+'","'+perItemCount[value.id]+'") >&minus;</label>\
                  <input readonly type="number" value="'+perItemCount[value.id]+'" class="_C bdr-0" id="incNum" />\
                  <label for="incNum" class="fs-14 bg-p clr-f plus _C hand" onClick = shoppingCart.plusMinusItem("plus","'+value.id+'","'+perItemCount[value.id]+'") >&plus;</label>\
              </span> &nbsp;\
              <span class="cartItem--price" > X &nbsp;&nbsp; Rs '+value.price+'</span>\
          </p>\
          <span class="col--2--s _C p-half cartItem--total dIB"> <strong> Rs '+value.price * perItemCount[value.id] +' </strong></span>\
      </article> ';

      totalPrice += value.price;

          });

          $('#cartBox').html(cartItemTemplate).siblings('.checkout').find('#totalPrice').text('Rs '+totalPrice);

        }else{
            $('#cartBox').html('');
        }
          
    },

    plusMinusItem:function(type , id , itemCount){
        if(type==='plus'){

            var getCartStorage = JSON.parse(sessionStorage.cart);
             getCartStorage[id] = getCartStorage[id] + 1;
             sessionStorage.setItem('cart', JSON.stringify(getCartStorage));
             // call update cart
             this.getcart();
        }

        if(type==='minus'){

            console.log(itemCount);
           
            if(itemCount > 1){
                var getCartStorage1 = JSON.parse(sessionStorage.cart);
                getCartStorage1[id] = getCartStorage1[id] - 1;
                sessionStorage.setItem('cart', JSON.stringify(getCartStorage1));
                this.getcart();

            }
            else{
                
                var getCartStorage2 = JSON.parse(sessionStorage.cart);
                delete(getCartStorage2[id]);
                sessionStorage.setItem('cart', JSON.stringify(getCartStorage2));
                this.getcart();

            }
        }
    }

}

shoppingCart.getcart();