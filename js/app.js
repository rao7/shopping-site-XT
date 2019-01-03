var shoppingCart = {
    serverURL : 'http://localhost:5000/',
   
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

    categories:function(selector , nameOnly = false){ // fetching categories
        $.ajax({
            url: this.serverURL+'/categories',
            dataType: 'json',
            method:'GET',
            cache:false,
            success: function(res){
                $.each(res, function (index, value) {

                if(nameOnly != true ){

                var catTemplate = '<div style="order:'+value.order+'" class=" row dropShadow bg-f center--V center--H m-y-1">\
                     <figure class="col--4 col--3--s p-1">\
                    <img class="w-100 p-half" src=".'+value.imageUrl+'" alt="">\
                </figure>\
                <article class="col--7 col--9--s _C p-1">\
                    <h2 class="p-1 fs-30">'+value.name+'</h2>\
                    <p class="p-1">'+value.description+'</p>\
                    <a href="#" data-id="'+value.id+'" class="btn btn--p m-y-1">'+value.name+'</a>\
                </article>\
                 </div>';
                 
                   
                }

                else{

                    //var catTemplate = '<li><a data-catid="'+value.id+'" href="javascript:void(0)">'+value.name+'</a></li>';
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
                        <button data-stock ="'+value.stock+'" class="btn btn--p w-100 bdr-0 m-y-1">  Buy Now </button>\
                    </p>\
                </div>\
            </article>';
                
               $('#productCon').append(productTemplate);
                
                  });
            }

        });

    },
    cart: function(pid){

        var cart = [];
        if (typeof(Storage) !== "undefined") {
                  
            if(!sessionStorage.cart){
                sessionStorage.setItem('cart', JSON.stringify(cart));
            }

          } 
    }, 

    updateCart : function(id){
        var updateCart = JSON.parse(sessionStorage.getItem('products')).filter((el) => el.id === id );
        sessionStorage.setItem('cart', JSON.stringify(updateCart));
    }

}