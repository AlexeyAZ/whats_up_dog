/*global $ google MarkerWithLabel*/

$(function () {

	var BODY = document.body;

	$(".js-sec4-gallery").slick({
		slidesToShow: 2,
		slidesToscroll: 2,
		nextArrow: ".js-sec4-gallery-arrow-right",
		prevArrow: ".js-sec4-gallery-arrow-left",
		appendDots: ".sec4__gallery-dots",
		dots: true,
		infinite: false,
		responsive: [{
			breakpoint: 1024,
			settings: {
				slidesToShow: 1,
				slidesToscroll: 1
			}
		}]
	});

	(function () {
		var phoneValid = false;
		var politicValid = false;

		$("input[name=phone]").mask('+7 (000) 000-00-00', {

			onKeyPress: function (cep, event, currentField, options) {
				checkPhone(cep, currentField);
			}
		});

		$(".js-sec5-form").submit(function (e) {
			e.preventDefault();

			var self = $(this);
			var phone = self.find("input[name=phone]");
			var checkbox = self.find("input[type=checkbox]");

			checkPhone(phone.val(), phone);
			checkPolitic(checkbox);

			if (phoneValid && politicValid) {
				//console.log("form valid")
			} else {
					//console.log("form invalid")
				}
		});

		$("input[type=checkbox]").on("change", function () {
			var self = $(this);
			checkPolitic(self);
		});

		function checkPhone(phone, field) {

			if (phone.length === 18) {
				phoneValid = true;

				if (field.hasClass("input_error")) {
					field.removeClass("input_error");
				}
			} else {
				phoneValid = false;
				field.addClass("input_error");
			}
		}

		function checkPolitic(checkbox) {

			if (checkbox.prop("checked")) {
				politicValid = true;

				if (checkbox.hasClass("checkbox_error")) {
					checkbox.removeClass("checkbox_error");
				}
			} else {
				politicValid = false;
				checkbox.addClass("checkbox_error");
			}
		}
	})();

	/*** google map ***/
	function initMap() {

		var markers = [];
		var objects = [{
			name: "name1",
			type: "main",
			pos: [55.731594, 37.608650],
			label: {
				adress: "ул. Крымский Вал, 25",
				phone: "+7 (777) 777-77-77"
			}
		}, {
			name: "name2",
			type: "default",
			pos: [55.732173, 37.611405],
			label: {
				adress: "ул. Крымский Вал, 26",
				phone: "+7 (777) 777-77-78"
			}
		}, {
			name: "name3",
			type: "default",
			pos: [55.731381, 37.604727],
			label: {
				adress: "ул. Крымский Вал, 27",
				phone: "+7 (777) 777-77-79"
			}
		}];

		var mapStyles = [{ "featureType": "all", "elementType": "labels.text.fill", "stylers": [{ "saturation": 36 }, { "color": "#000000" }, { "lightness": 40 }] }, { "featureType": "all", "elementType": "labels.text.stroke", "stylers": [{ "visibility": "on" }, { "color": "#000000" }, { "lightness": 16 }] }, { "featureType": "all", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "administrative", "elementType": "geometry.fill", "stylers": [{ "color": "#000000" }, { "lightness": 20 }] }, { "featureType": "administrative", "elementType": "geometry.stroke", "stylers": [{ "color": "#000000" }, { "lightness": 17 }, { "weight": 1.2 }] }, { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "color": "#000000" }, { "lightness": 20 }] }, { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#000000" }, { "lightness": 21 }] }, { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{ "color": "#000000" }, { "lightness": 17 }] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#000000" }, { "lightness": 29 }, { "weight": 0.2 }] }, { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "color": "#000000" }, { "lightness": 18 }] }, { "featureType": "road.local", "elementType": "geometry", "stylers": [{ "color": "#000000" }, { "lightness": 16 }] }, { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#000000" }, { "lightness": 19 }] }, { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#000000" }, { "lightness": 17 }] }];

		var map = new google.maps.Map(document.getElementById('map'), {
			zoom: 17,
			center: new google.maps.LatLng(objects[0].pos[0], objects[0].pos[1]),
			zoomControl: true,
			mapTypeControl: false,
			scaleControl: false,
			streetViewControl: false,
			rotateControl: false,
			fullscreenControl: false,
			scrollwheel: false,
			styles: mapStyles
		});

		map.addListener('click', function () {
			for (var i = 0; i < markers.length; i++) {
				var item = markers[i];

				setMarkerStyle(item, "", false);
			}
		});

		var iconPath = "/local_sites/wud/img/";
		//var iconPath = "../img/";
		var iconSize = window.matchMedia("(max-width:1024px)").matches ? new google.maps.Size(24, 30) : new google.maps.Size(48, 60);

		for (var i = 0; i < objects.length; i++) {
			addMarker(objects[i], map);
		}

		function addMarker(obj, map) {

			var marker = new MarkerWithLabel({
				position: new google.maps.LatLng(obj.pos[0], obj.pos[1]),
				map: map,
				icon: {
					url: iconPath + 'default_map_mark.png',
					scaledSize: iconSize
				},
				labelClass: "sec6__map-popup",
				labelAnchor: new google.maps.Point(100, 100)
			});

			var labelInfo = '<div><p>' + obj.label.adress + '</p><p>' + obj.label.phone + '</p></div>';

			marker.addListener('click', function () {
				map.panTo(this.getPosition());

				for (var i = 0; i < markers.length; i++) {
					var item = markers[i];

					setMarkerStyle(item, "", false);
				}

				setMarkerStyle(this, labelInfo, true);
			});

			markers.push(marker);
		}

		function setMarkerStyle(marker, labelInfo, main) {

			if (main === true) {
				marker.set("labelClass", "sec6__map-popup");
				marker.setIcon(iconPath + "main_map_mark.png");
				marker.set("labelContent", labelInfo);
			} else if (main === false) {
				marker.set("labelClass", "sec6__map-popup-hide");
				marker.setIcon({ url: iconPath + "default_map_mark.png", scaledSize: iconSize });
				marker.set("labelContent", "");
				marker.s;
			}
		}
	}
	initMap();
	/*** /google map ***/

	/*** modal ****/
	function openModal(modal) {
		var modalEl = document.querySelector(modal);
		modalEl.classList.add("modal_show");
		BODY.classList.add("body_overflow");
	}

	function closeModal() {
		var openModal = document.querySelector(".modal_show");
		openModal.classList.remove("modal_show");
		BODY.classList.remove("body_overflow");
	}

	document.querySelector(".header__logo").addEventListener("click", function (e) {
		e.preventDefault();
		openModal(".action__modal");
	});

	/*** nav bar on mobile ***/
	function openNavBar() {
		var navBar = document.querySelector(".header__nav-list");
		navBar.classList.add("header__nav-list_show");
		BODY.classList.add("body_overflow");
	}

	function closeNavBar() {
		var openNavBar = document.querySelector(".header__nav-list_show");
		openNavBar.classList.remove("header__nav-list_show");
		BODY.classList.remove("body_overflow");
	}

	document.querySelector(".header__nav-menu").addEventListener("click", function () {
		openNavBar();
	});
	/*** /nav bar on mobile ***/

	/*** header link click ****/
	$(".header__nav-link").on("click", function (e) {

		if (!$(this).hasClass("header__nav-link_feedback")) {

			e.preventDefault();

			var self = $(this);
			var target = self.attr("href");
			var noteHeight = 0;

			if ($(target).find(".note").length > 0) {
				var note = $(target).find(".note");
				noteHeight = note.outerHeight();
			}

			$("html, body").animate({
				scrollTop: $(target).offset().top - noteHeight / 2
			}, 600, function () {

				if (document.querySelector(".header__nav-list").classList.contains("header__nav-list_show")) {
					closeNavBar();
				}
			});
		}
	});
	/*** /header link click ****/

	/*** BODY click handler ****/
	BODY.addEventListener("click", function (e) {

		if (e.target.classList.contains("modal") || e.target.classList.contains("modal__close")) {
			closeModal();
		}

		if (e.target.classList.contains("header__nav-close")) {
			closeNavBar();
		}
	});
	/*** BODY click handler ****/

	window.addEventListener("resize", function () {

		if (document.querySelector(".header__nav-list_show")) {
			closeNavBar();
		}
	});
});
//# sourceMappingURL=app.js.map
