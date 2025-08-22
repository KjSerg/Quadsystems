export class GoogleMap {
    constructor() {
        this.$doc = $(document);
    }

    loadGoogleMapsScript() {
        return new Promise((resolve, reject) => {
            if (document.getElementById('google-maps-script')) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.id = 'google-maps-script';
            script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapApiKey}&libraries=places`;
            script.async = true;
            script.defer = true;
            script.onload = resolve;
            script.onerror = () => reject(new Error('Помилка завантаження скрипта Google Maps'));
            document.head.appendChild(script);
        });
    }

    initAutocomplete() {
        const t = this;
        if ($('#google-maps-script').length === 0) {
            this.init(this.initAutocomplete.bind(this));
            return;
        }
        $('.address-js').each(function (index) {
            let $t = $(this);
            let id = $t.attr('id');
            if (id === null || id === undefined) {
                $t.attr('id', 'address-input-' + index);
                id = $t.attr('id');
            }
            let addressField = document.querySelector('#' + id);
            let options = {
                fields: ["formatted_address", "address_components", "geometry", "name"],
                strictBounds: false,
                types: [],
            };
            if ($t.hasClass('is-cities')) {
                options = {
                    fields: ["formatted_address", "address_components", "geometry", "name"],
                    strictBounds: false,
                    types: ['(cities)'],
                    componentRestrictions: {country: 'ua'}
                };
            }
            let autocomplete = new google.maps.places.Autocomplete(addressField, options);
            autocomplete.addListener("place_changed", function () {
                addressField.removeAttribute('data-selected');
                t.fillInAddress(autocomplete, addressField);
            });
            $t.on('input', function () {
                if ($(this).val().trim() === '') {
                    $(this).removeAttr('data-selected');
                }
            });
        });
    }

    init(fn) {
        if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
            this.loadGoogleMapsScript()
                .then(() => fn())
                .catch(error => console.error('Google Maps API не вдалося завантажити:', error));
        } else {
            fn();
        }
    }

    initMaps() {
        const t = this;
        if ($('#google-maps-script').length === 0) {
            this.init(this.initMaps.bind(this));
            return;
        }
        $('.map:not(.init-map)').each(function () {
            const $t = $(this);
            let lat = $t.attr('data-lat');
            let lng = $t.attr('data-lng');
            let zoom = $t.attr('data-zoom');
            if (lat && lng) {
                lat = Number(lat);
                lng = Number(lng);
                zoom = zoom === undefined ? 10 : Number(zoom);
                t.initMap($t, {lat, lng, zoom});
            }
        });

    }

    fillInAddress(autocomplete, addressField) {
        let $addressField = $(addressField);
        let place = autocomplete.getPlace();
        let lat = place.geometry.location.lat();
        let lng = place.geometry.location.lng();
        let name = place.name;
        let formatted_address = place.formatted_address;
        let address1 = "";
        let postcode = "";
        for (const component of place.address_components) {
            const componentType = component.types[0];
            switch (componentType) {
                case "street_number": {
                    address1 = component.long_name + ' ' + address1;
                    break;
                }
                case "route": {
                    address1 += component.short_name;
                    break;
                }
                case "postal_code": {
                    address1 += ', ' + component.long_name;
                    postcode = component.long_name;
                    break;
                }
                case "postal_code_suffix": {
                    postcode = postcode + '-' + component.long_name;
                    break;
                }
                case "locality":
                    address1 += ' ' + component.long_name;
                    $('#user_city').val(component.long_name);
                    break;
                case "administrative_area_level_1": {
                    address1 += ' ' + component.short_name;
                    $('#user_region').val(component.long_name);
                    break;
                }
                case "country":
                    address1 += ' ' + component.long_name;
                    $('#user_country').val(component.long_name);
                    $('#user_country_code').val(component.short_name);
                    break;
            }
        }
        addressField.value = formatted_address;
        addressField.setAttribute('data-selected', formatted_address);
        $('#user_post_code').val(postcode);
        $('#lat').val(lat);
        $('#lng').val(lng);
        if ($addressField.hasClass('book-form-address__input')) {
            const related = $addressField.attr('data-related');
            const $related = $(related);
            if ($related.length === 0) return;
            $addressField.closest('.book-form-address').find('.book-form-address__button').removeClass('not-active');
            $related.attr('data-lat', lat).attr('data-lng', lng);
            if (!$related.hasClass('init-map')) return;
            this.initMap($related, {lat, lng});
        }
    }

    initMap($selector, args = {}) {
        if ($('#google-maps-script').length === 0) return;
        let lat = args.lat || $selector.attr('data-lat');
        let lng = args.lng || $selector.attr('data-lng');
        let zoom = args.zoom || $selector.attr('data-zoom');
        if (lat && lng) {
            lat = Number(lat);
            lng = Number(lng);
            zoom = zoom === undefined ? 10 : Number(zoom);
            let location = {lat, lng};
            let mapInstance = $selector.data("google-map");
            let markerInstance = $selector.data("google-marker");
            if (mapInstance) {
                mapInstance.setCenter(location);
                if (markerInstance) {
                    markerInstance.setPosition(location);
                } else {
                    markerInstance = new google.maps.Marker({
                        position: location,
                        map: mapInstance
                    });
                    $selector.data("google-marker", markerInstance);
                }
            } else {
                let map = new google.maps.Map($selector[0], {
                    zoom: zoom,
                    center: location
                });
                let marker = new google.maps.Marker({
                    position: location,
                    map: map,
                    draggable: true
                });
                $selector.data("google-map", map);
                $selector.data("google-marker", marker);
                marker.addListener("dragend", () => {
                    this.updateCenterInfo(marker.getPosition(), $selector);
                });
                map.addListener("click", (event) => {
                    marker.setPosition(event.latLng);
                    this.updateCenterInfo(event.latLng, $selector);
                });
                document.addEventListener("fullscreenchange", function () {
                    if (!document.fullscreenElement && document.contains($selector[0])) {
                        console.log("Google Map закрила повноекранний режим!");
                        setTimeout(function (){
                            $('html, body').animate({
                                scrollTop: $selector.offset().top
                            });
                        }, 100);
                    }
                });
            }
            $selector.addClass('init-map');
        }
    }

    updateMarkerInfo(position) {
        const lat = position.lat();
        const lng = position.lng();
        document.getElementById("coords").innerText = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        geocoder.geocode({location: position}, (results, status) => {
            if (status === "OK" && results[0]) {
                document.getElementById("address").innerText = results[0].formatted_address;
            } else {
                document.getElementById("address").innerText = "Адреса не знайдена";
            }
        });
    }

    updateCenterInfo(location, $selector) {
        let id = $selector.attr('id');
        let $field = this.$doc.find('input[data-related="#' + id + '"]')
        $('#lat').val(location.lat());
        $('#lng').val(location.lng());
        $field.attr('data-lat', location.lat());
        $field.attr('data-lng', location.lng());
        let geocoder = new google.maps.Geocoder();
        geocoder.geocode({location: location}, (results, status) => {
            if (status === 'OK' && results[0]) {
                let address = results[0].formatted_address;
                window.mapCenterData = {
                    lat: location.lat(),
                    lng: location.lng(),
                    address: address
                };
                $selector.attr('data-lat', location.lat());
                $selector.attr('data-lng', location.lng());
                $selector.attr('data-address', address);
                $field.val(address);
                $field.attr('data-selected', address);
            } else {
                console.error('Не вдалося отримати адресу:', status);
            }
        });
    }

}