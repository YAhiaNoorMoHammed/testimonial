// ==========================================================
// Black & Gold Luxury Watches - Site Scripts
// Plain, simple vanilla JavaScript. No frameworks.
// The watches carousel itself needs no code here - Bootstrap's
// own JS (bootstrap.bundle.min.js) runs it automatically.
// ==========================================================

document.addEventListener("DOMContentLoaded", function () {

    // ------------------------------------------------------
    // 1) Stop placeholder "#" links from jumping to page top
    // ------------------------------------------------------
    var placeholderLinks = document.querySelectorAll('a[href="#"]');
    for (var i = 0; i < placeholderLinks.length; i++) {
        placeholderLinks[i].addEventListener("click", function (e) {
            e.preventDefault();
        });
    }

    // ------------------------------------------------------
    // 2) Mobile accordion for the mega menu dropdowns
    // ------------------------------------------------------
    var dropdownItems = document.querySelectorAll(".dropdown_custom");

    function closeAllDropdowns() {
        for (var d = 0; d < dropdownItems.length; d++) {
            var menu = dropdownItems[d].querySelector(".custom_dropdown");
            var plusIcon = dropdownItems[d].querySelector(".mobile_plus");
            if (menu) {
                menu.style.display = "none";
            }
            if (plusIcon) {
                plusIcon.classList.remove("fa-minus");
                plusIcon.classList.add("fa-plus");
            }
        }
    }

    for (var j = 0; j < dropdownItems.length; j++) {
        var item = dropdownItems[j];
        var link = item.querySelector(".nav-link");

        if (!link) {
            continue;
        }

        link.addEventListener("click", function (e) {
            // Only turn this into an accordion on mobile / tablet widths
            if (window.innerWidth > 991) {
                return;
            }
            e.preventDefault();

            var parentItem = this.closest(".dropdown_custom");
            var menu = parentItem.querySelector(".custom_dropdown");
            var plusIcon = parentItem.querySelector(".mobile_plus");
            var isOpen = menu.style.display === "block";

            closeAllDropdowns();

            if (!isOpen) {
                menu.style.display = "block";
                if (plusIcon) {
                    plusIcon.classList.remove("fa-plus");
                    plusIcon.classList.add("fa-minus");
                }
            }
        });
    }

    // When the window grows back to desktop size, let CSS take over again
    window.addEventListener("resize", function () {
        if (window.innerWidth > 991) {
            for (var k = 0; k < dropdownItems.length; k++) {
                var menu = dropdownItems[k].querySelector(".custom_dropdown");
                if (menu) {
                    menu.style.display = "";
                }
            }
        }
    });

    // ------------------------------------------------------
    // 3) Side cart drawer (open / close)
    // ------------------------------------------------------
    var cartTrigger = document.getElementById("cartTrigger");
    var cartDrawer = document.getElementById("cartDrawer");
    var cartOverlay = document.getElementById("cartOverlay");
    var closeCartBtn = document.getElementById("closeCartBtn");
    var cartCountEl = document.querySelector(".cart_count");
    var cartBodyEl = document.getElementById("cartDrawerBody");
    var cartTotalAmountEl = document.getElementById("cartTotalAmount");

    var cartCount = 0;
    var cartItems = []; // each item looks like: { id, title, price, imgSrc }

    function slugify(text) {
        return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
    }

    function openCart(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        cartDrawer.classList.add("active");
        cartOverlay.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    function closeCart() {
        cartDrawer.classList.remove("active");
        cartOverlay.classList.remove("active");
        document.body.style.overflow = "";
    }

    if (cartTrigger) {
        cartTrigger.addEventListener("click", openCart);
    }
    if (closeCartBtn) {
        closeCartBtn.addEventListener("click", closeCart);
    }
    if (cartOverlay) {
        cartOverlay.addEventListener("click", closeCart);
    }

    // Draw the list of items currently inside the cart drawer
    function renderCartItems() {
        if (cartItems.length === 0) {
            cartBodyEl.style.justifyContent = "center";
            cartBodyEl.innerHTML =
                '<div class="empty_cart_msg">' +
                '<i class="fa-solid fa-bag-shopping"></i>' +
                "<p>Your cart is currently empty.</p>" +
                "</div>";
            if (cartTotalAmountEl) {
                cartTotalAmountEl.innerText = "$0.00";
            }
            return;
        }

        cartBodyEl.style.justifyContent = "flex-start";
        var total = 0;
        var rowsHtml = "";

        for (var c = 0; c < cartItems.length; c++) {
            var cartItem = cartItems[c];
            total += cartItem.price;
            rowsHtml +=
                '<div class="cart_item_row">' +
                '<img src="' + cartItem.imgSrc + '" alt="' + cartItem.title + '" class="cart_item_img">' +
                '<div class="cart_item_details">' +
                '<h5 class="cart_item_name">' + cartItem.title + "</h5>" +
                '<span class="cart_item_price">$' + cartItem.price.toLocaleString() + "</span>" +
                "</div>" +
                '<button type="button" class="cart_item_remove_btn" data-id="' + cartItem.id + '" title="Remove">' +
                '<i class="fa-solid fa-trash"></i>' +
                "</button>" +
                "</div>";
        }

        cartBodyEl.innerHTML = '<div class="cart_items_list">' + rowsHtml + "</div>";
        if (cartTotalAmountEl) {
            cartTotalAmountEl.innerText = "$" + total.toLocaleString();
        }
    }

    function addItemToCart(id, title, price, imgSrc) {
        cartCount = cartCount + 1;
        if (cartCountEl) {
            cartCountEl.innerText = cartCount;
        }
        cartItems.push({ id: id, title: title, price: price, imgSrc: imgSrc });
        renderCartItems();
    }

    function removeItemFromCart(id) {
        var indexToRemove = -1;
        for (var c = 0; c < cartItems.length; c++) {
            if (cartItems[c].id === id) {
                indexToRemove = c;
                break;
            }
        }
        if (indexToRemove > -1) {
            cartItems.splice(indexToRemove, 1);
            cartCount = Math.max(0, cartCount - 1);
            if (cartCountEl) {
                cartCountEl.innerText = cartCount;
            }
            renderCartItems();
        }
        // Keep a matching shop card / quick view in sync if this product lives there
        var card = document.querySelector('.shop_product_card[data-id="' + id + '"]');
        if (card) {
            setShopCardState(card, false);
        }
    }

    if (cartBodyEl) {
        cartBodyEl.addEventListener("click", function (e) {
            var removeBtn = e.target.closest(".cart_item_remove_btn");
            if (removeBtn) {
                removeItemFromCart(removeBtn.dataset.id);
            }
        });
    }

    // ------------------------------------------------------
    // 4) Mega menu "Add to Cart" icons (demo products)
    // ------------------------------------------------------
    var addToCartBtns = document.querySelectorAll(".btn_add_to_cart_icon");
    for (var a = 0; a < addToCartBtns.length; a++) {
        addToCartBtns[a].addEventListener("click", function (e) {
            e.preventDefault();
            var productCard = this.closest(".dropdown_product_card");
            var title = productCard.querySelector(".product_title").innerText;
            var priceText = productCard.querySelector(".price_tag").innerText;
            var price = parseFloat(priceText.replace("$", "").replace(",", ""));
            var imgSrc = productCard.querySelector(".product_img_holder img").src;
            var id = "menu-" + slugify(title);

            addItemToCart(id, title, price, imgSrc);
            openCart();
        });
    }

    // ------------------------------------------------------
    // 5) Watches carousel: built from a plain list of watches,
    //    2 rows x 3 columns per slide. The search box filters
    //    that list and rebuilds the slides so it actually works
    //    no matter which slide you are currently viewing.
    //    (The sidebar "Shop By Brand" list is plain text now,
    //    no click behaviour.)
    // ------------------------------------------------------
    var watchesCarouselEl = document.getElementById("watchesCarousel");
    var shopGrid = document.getElementById("shopProductsGrid");
    var shopIndicators = watchesCarouselEl ? watchesCarouselEl.querySelector(".carousel-indicators") : null;
    var shopSearchInput = document.getElementById("shopSearchInput");
    var shopEmptyMsg = document.getElementById("shopEmptyMsg");

    var CARDS_PER_SLIDE = 6; // 2 rows x 3 columns
    var bsCarouselInstance = null;

    // Read every watch card that is already in the page once, before
    // the search box starts rebuilding things.
    var allWatchCards = [];
    var initialCardEls = document.querySelectorAll(".shop_product_card");
    for (var w = 0; w < initialCardEls.length; w++) {
        var el = initialCardEls[w];
        allWatchCards.push({
            id: el.dataset.id,
            title: el.dataset.title,
            brand: el.dataset.brand,
            price: el.dataset.price,
            img: el.dataset.img
        });
    }

    function isWatchInCart(id) {
        for (var ci = 0; ci < cartItems.length; ci++) {
            if (cartItems[ci].id === id) {
                return true;
            }
        }
        return false;
    }

    function buildWatchCardHTML(watch, inCart) {
        var price = Number(watch.price).toLocaleString();
        var actionsHtml = inCart
            ? '<span class="added_price"><i class="fa-solid fa-circle-check"></i> $' + price + "</span>" +
              '<button type="button" class="btn_remove_from_cart_shop"><i class="fa-solid fa-trash"></i> Delete</button>'
            : '<button type="button" class="btn_add_to_cart_shop">Add to Cart</button>';

        return (
            '<div class="col">' +
            '<div class="shop_product_card' + (inCart ? " in_cart" : "") + '" data-id="' + watch.id + '" data-title="' + watch.title + '" data-brand="' + watch.brand + '" data-price="' + watch.price + '" data-img="' + watch.img + '">' +
            '<div class="shop_card_img"><img src="' + watch.img + '" alt="' + watch.title + '" class="img-fluid"></div>' +
            '<div class="shop_card_info">' +
            '<span class="shop_card_brand">' + watch.brand + "</span>" +
            '<h4 class="shop_card_title">' + watch.title + "</h4>" +
            '<span class="shop_card_price">$' + price + "</span>" +
            "</div>" +
            '<div class="shop_card_actions">' + actionsHtml + "</div>" +
            "</div>" +
            "</div>"
        );
    }

    function renderWatchesCarousel(watchList) {
        if (!watchesCarouselEl || !shopGrid || !shopIndicators) {
            return;
        }

        // No matches: hide the carousel and show a friendly message instead
        if (watchList.length === 0) {
            watchesCarouselEl.style.display = "none";
            if (shopEmptyMsg) {
                shopEmptyMsg.style.display = "block";
            }
            return;
        }

        watchesCarouselEl.style.display = "";
        if (shopEmptyMsg) {
            shopEmptyMsg.style.display = "none";
        }

        var indicatorsHtml = "";
        var innerHtml = "";
        var slideIndex = 0;

        for (var start = 0; start < watchList.length; start += CARDS_PER_SLIDE) {
            var slideWatches = watchList.slice(start, start + CARDS_PER_SLIDE);
            var isFirstSlide = slideIndex === 0;

            indicatorsHtml +=
                '<button type="button" data-bs-target="#watchesCarousel" data-bs-slide-to="' + slideIndex + '"' +
                (isFirstSlide ? ' class="active" aria-current="true"' : "") +
                ' aria-label="Slide ' + (slideIndex + 1) + '"></button>';

            var cardsHtml = "";
            for (var cIdx = 0; cIdx < slideWatches.length; cIdx++) {
                cardsHtml += buildWatchCardHTML(slideWatches[cIdx], isWatchInCart(slideWatches[cIdx].id));
            }

            innerHtml +=
                '<div class="carousel-item' + (isFirstSlide ? " active" : "") + '">' +
                '<div class="row row-cols-1 row-cols-md-3 g-4">' + cardsHtml + "</div>" +
                "</div>";

            slideIndex++;
        }

        shopIndicators.innerHTML = indicatorsHtml;
        shopGrid.innerHTML = innerHtml;

        // Re-start the Bootstrap carousel component on the fresh markup.
        // Ask Bootstrap itself if an instance already exists first, since
        // it may have auto-created one before this script ran.
        var existingInstance = bootstrap.Carousel.getInstance(watchesCarouselEl);
        if (existingInstance) {
            existingInstance.dispose();
        }
        bsCarouselInstance = new bootstrap.Carousel(watchesCarouselEl, {
            interval: 5000,
            ride: true
        });
    }

    // First render on page load: show every watch
    renderWatchesCarousel(allWatchCards);

    if (shopSearchInput) {
        shopSearchInput.addEventListener("input", function () {
            var query = this.value.trim().toLowerCase();
            var filteredWatches = [];
            for (var f = 0; f < allWatchCards.length; f++) {
                var watch = allWatchCards[f];
                var matches =
                    watch.title.toLowerCase().indexOf(query) !== -1 ||
                    watch.brand.toLowerCase().indexOf(query) !== -1;
                if (matches) {
                    filteredWatches.push(watch);
                }
            }
            renderWatchesCarousel(filteredWatches);
        });
    }

    // ------------------------------------------------------
    // 6) Add to Cart / Delete button inside a shop card
    // ------------------------------------------------------
    var quickViewBackdrop = document.getElementById("quickViewBackdrop");
    var quickViewModal = document.getElementById("quickViewModal");
    var quickViewClose = document.getElementById("quickViewClose");
    var quickViewContent = document.getElementById("quickViewContent");
    var pageWrapper = document.getElementById("pageWrapper");

    function setShopCardState(card, inCart) {
        var actions = card.querySelector(".shop_card_actions");
        if (!actions) {
            return;
        }
        var price = Number(card.dataset.price).toLocaleString();

        card.classList.toggle("in_cart", inCart);

        if (inCart) {
            actions.innerHTML =
                '<span class="added_price"><i class="fa-solid fa-circle-check"></i> $' + price + "</span>" +
                '<button type="button" class="btn_remove_from_cart_shop"><i class="fa-solid fa-trash"></i> Delete</button>';
        } else {
            actions.innerHTML = '<button type="button" class="btn_add_to_cart_shop">Add to Cart</button>';
        }

        // If this exact product is currently open in the quick view, refresh its actions too
        if (quickViewModal && quickViewModal.dataset.activeId === card.dataset.id) {
            renderQuickViewActions(card);
        }
    }

    if (shopGrid) {
        shopGrid.addEventListener("click", function (e) {
            var card = e.target.closest(".shop_product_card");
            if (!card) {
                return;
            }

            var addBtn = e.target.closest(".btn_add_to_cart_shop");
            var removeBtn = e.target.closest(".btn_remove_from_cart_shop");

            if (addBtn) {
                e.stopPropagation();
                addItemToCart(card.dataset.id, card.dataset.title, Number(card.dataset.price), card.dataset.img);
                setShopCardState(card, true);
                return;
            }
            if (removeBtn) {
                e.stopPropagation();
                removeItemFromCart(card.dataset.id);
                return;
            }
            // Clicking anywhere else on the card opens the quick view
            openQuickView(card);
        });
    }

    // ------------------------------------------------------
    // 7) Quick View popup: shows the clicked watch large,
    //    blurs the rest of the page behind it
    // ------------------------------------------------------
    function renderQuickViewActions(card) {
        var actionsEl = quickViewContent && quickViewContent.querySelector(".quickview_actions");
        if (!actionsEl) {
            return;
        }
        if (card.classList.contains("in_cart")) {
            actionsEl.innerHTML =
                '<span class="added_price"><i class="fa-solid fa-circle-check"></i> In your cart</span>' +
                '<button type="button" class="btn_remove_from_cart_shop">Delete</button>';
        } else {
            actionsEl.innerHTML = '<button type="button" class="btn_add_to_cart_shop">Add to Cart</button>';
        }
    }

    function openQuickView(card) {
        if (!quickViewModal || !quickViewContent) {
            return;
        }
        var title = card.dataset.title;
        var brand = card.dataset.brand;
        var price = Number(card.dataset.price).toLocaleString();
        var img = card.dataset.img;

        quickViewModal.dataset.activeId = card.dataset.id;
        quickViewContent.innerHTML =
            '<div class="quickview_img"><img src="' + img + '" alt="' + title + '"></div>' +
            '<div class="quickview_info">' +
            '<span class="quickview_brand">' + brand + "</span>" +
            '<h3 class="quickview_title">' + title + "</h3>" +
            '<span class="quickview_price">$' + price + "</span>" +
            '<div class="quickview_actions"></div>' +
            "</div>";
        renderQuickViewActions(card);

        if (pageWrapper) {
            pageWrapper.classList.add("blurred");
        }
        quickViewBackdrop.classList.add("active");
        quickViewModal.classList.add("active");
    }

    function closeQuickView() {
        if (pageWrapper) {
            pageWrapper.classList.remove("blurred");
        }
        if (quickViewBackdrop) {
            quickViewBackdrop.classList.remove("active");
        }
        if (quickViewModal) {
            quickViewModal.classList.remove("active");
        }
    }

    if (quickViewClose) {
        quickViewClose.addEventListener("click", closeQuickView);
    }
    if (quickViewBackdrop) {
        quickViewBackdrop.addEventListener("click", closeQuickView);
    }

    if (quickViewContent) {
        quickViewContent.addEventListener("click", function (e) {
            var id = quickViewModal.dataset.activeId;
            var card = document.querySelector('.shop_product_card[data-id="' + id + '"]');
            if (!card) {
                return;
            }

            if (e.target.closest(".btn_add_to_cart_shop")) {
                addItemToCart(card.dataset.id, card.dataset.title, Number(card.dataset.price), card.dataset.img);
                setShopCardState(card, true);
                renderQuickViewActions(card);
            } else if (e.target.closest(".btn_remove_from_cart_shop")) {
                removeItemFromCart(card.dataset.id);
                renderQuickViewActions(card);
            }
        });
    }

    // ------------------------------------------------------
    // 8) Footer newsletter form (demo only, no real backend)
    // ------------------------------------------------------
    var footerNewsletterForm = document.getElementById("footerNewsletterForm");
    var footerNewsletterMsg = document.getElementById("footerNewsletterMsg");

    if (footerNewsletterForm) {
        footerNewsletterForm.addEventListener("submit", function (e) {
            e.preventDefault();
            if (footerNewsletterMsg) {
                footerNewsletterMsg.innerText = "Thanks! You're on the list.";
            }
            footerNewsletterForm.reset();
        });
    }

});
