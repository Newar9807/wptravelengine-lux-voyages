import domReady from '@wordpress/dom-ready'
import { createRoot } from '@wordpress/element'
import { addFilter } from '@wordpress/hooks'
import { __ } from '@wordpress/i18n'
import { Price } from '@wptravelengine/public/fragments'
import _ from 'lodash'
import moment from 'moment'

addFilter('wptravelengine.flatpickr.options', 'wptravelengine.lux-voyages.conditionalPricing', (options, tripDates) => {
    if (_.isEmpty(tripDates)) return options
    const allDates = tripDates.find(({ package: p }) => p.is_primary)?.dates || {}
    return {
        ...options,
        onDayCreate: (dObj, dStr, fp, dayElem) => {
            const dateString = moment(dayElem.dateObj).format('YYYY-MM-DD')
            const price = allDates[dateString]?.pricing.find(({ is_primary }) => is_primary)?.price ?? ''
            if (price) {
                let priceContainer = document.createElement('span')
                priceContainer.classList.add('price-info')
                if (!priceContainer._reactRoot) {
                    priceContainer._reactRoot = createRoot(priceContainer)
                }
                priceContainer._reactRoot.render(<Price noHTML value={price} />)
                dayElem.insertAdjacentElement('beforeend', priceContainer)
            }
        }

    }
}, 10, 2)

domReady(() => {
    const checkoutForm = document.getElementById('wptravelengine-checkout__form');

    if (!checkoutForm) return;

    const paymentMethods = checkoutForm.querySelector('.wpte-checkout__box:last-child');

    const mainWrapper = Object.assign(document.createElement("div"), { className: "wpte-checkout__box" });
    const paymentOptions = Object.assign(document.createElement("div"), { className: "wpte-checkout__payment-options", style: "margin-bottom: 0px;" });

    const label = Object.assign(document.createElement("label"), { className: "wpte-bf-label", textContent: __("Do you need a Travel Insurance ?", "wptravelengine-lux-voyages") });

    const createRadioOption = (value, text, checked = false) => {
        const wrapper = Object.assign(document.createElement("div"), { className: "wpte-checkout__form-control" });
        const input = Object.assign(document.createElement("input"), {
            type: "radio",
            name: "wptravelengine_lux_voyages_travel_insurance",
            id: `wptravelengine_lux_voyages_travel_insurance_${value}`,
            value,
            checked
        });
        const inputLabel = Object.assign(document.createElement("label"), {
            htmlFor: input.id,
            textContent: __(text, "wptravelengine-lux-voyages")
        });
        wrapper.append(input, inputLabel);
        return { wrapper, input };
    };

    const { wrapper: radioYesWrapper, input: radioYes } = createRadioOption("yes", "Yes");
    const { wrapper: radioNoWrapper, input: radioNo } = createRadioOption("no", "No", true);

    const radioWrapper = Object.assign(document.createElement("div"), { style: "display: flex; margin-top: 2px;" });
    radioWrapper.append(radioYesWrapper, radioNoWrapper);

    const content = Object.assign(document.createElement("div"), {
        style: "margin-top: 8px;",
        innerHTML: __("You can get travel insurance from <a href='https://www.nib.com.au/travel-insurance/Turnstile/PartnerLink?partnerCode=LUXVOTA&source=websale/' target='_blank'>here</a>.", "wptravelengine-lux-voyages")
    });

    radioYes.addEventListener("change", () => mainWrapper.appendChild(content));
    radioNo.addEventListener("change", () => mainWrapper.removeChild(content));

    paymentOptions.append(label, radioWrapper);
    mainWrapper.appendChild(paymentOptions);
    paymentMethods.insertAdjacentElement('beforebegin', mainWrapper);

})