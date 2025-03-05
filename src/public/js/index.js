import domReady from '@wordpress/dom-ready'
import { addFilter } from '@wordpress/hooks'
import { __ } from '@wordpress/i18n'
import _ from 'lodash'
import moment from 'moment'

addFilter('wptravelengine.flatpickr.options', 'wptravelengine.lux-voyages.conditionalPricing', (options, tripDates) => {
    if (_.isEmpty(tripDates)) return options
    const { priceFormat } = wteL10n
    const allDates = tripDates.find(({ package: p }) => p.is_primary)?.dates || {}
    return {
        ...options,
        onDayCreate: (dObj, dStr, fp, dayElem) => {
            const selectedDate = dayElem.dateObj
            const dateString = moment(selectedDate).format('YYYY-MM-DD')
            const price = allDates[dateString]?.pricing.find(({ is_primary }) => is_primary)?.price ?? ''

            // if is next month or previous month, then don't show price
            const isPrevMonthDay = dayElem.classList.contains('prevMonthDay')
            const isNextMonthDay = dayElem.classList.contains('nextMonthDay')
            if (isPrevMonthDay || isNextMonthDay) return;

            if (price) {
                dayElem.innerHTML += `<span class='price-info'>${priceFormat(price).format(true, true)}</span>`;
            }
        }

    }
}, 10, 2)

domReady(() => {

    const processedButtons = new Set(); // Use Set to track processed buttons
    const processedLastTd = new Set(); // Use Set to track processed last td
    const observer = new MutationObserver((mutations) => {
        const accUpgradesToggles = document.querySelectorAll('.accommodation-upgrades-toggle-button');

        if (accUpgradesToggles.length > 0) {
            accUpgradesToggles.forEach((btn) => {
                if (!processedButtons.has(btn)) {
                    const element = document.createElement('span');
                    element.classList.add('accommodation-upgrades-toggle-button-text');
                    element.innerHTML = __('Click here to view', 'wptravelengine-lux-voyages');
                    btn.parentNode.insertBefore(element, btn);
                    processedButtons.add(btn); // Mark this button as processed
                }
            });
        }

        const lastTr = document.querySelector('.wpte-checkout__booking-summary-deposit');
        const lastTd = lastTr.querySelector('td:last-child strong');
        if (lastTd && !processedLastTd.has(lastTd)) {
            lastTd.innerHTML = lastTd.innerHTML.replace('- ', '');
            processedLastTd.add(lastTd);
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

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