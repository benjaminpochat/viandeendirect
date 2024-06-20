package eu.viandeendirect.domains.payment;

import com.stripe.exception.EventDataObjectDeserializationException;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.StripeObject;
import com.stripe.model.checkout.Session;
import com.stripe.net.ApiResource;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.junit.jupiter.api.Assertions.assertNotNull;

class StripeEventHandlerTest_getCheckoutSession {

    StripeEventHandler stripeEventHandler = new StripeEventHandler();

    @Test
    void should_deserialize_the_checkout_session_from_event_data() throws SignatureVerificationException, EventDataObjectDeserializationException {
        // given
        String json = """
                {
                  "id": "evt_1PTqwCERSs64ll6ohR6XCvBu",
                  "object": "event",
                  "account": "acct_1PTVQWERSs64ll6o",
                  "api_version": "2024-04-10",
                  "created": 1718912788,
                  "data": {
                    "object": {
                      "id": "cs_test_a1sPS7WlbkQAu8TzojKGNNG0iJ3pjUlTy1ZQwCCqncvzSbVHEeQzA6ivUr",
                      "object": "checkout.session",
                      "after_expiration": null,
                      "allow_promotion_codes": null,
                      "amount_subtotal": 18000,
                      "amount_total": 18000,
                      "automatic_tax": {
                        "enabled": false,
                        "liability": null,
                        "status": null
                      },
                      "billing_address_collection": null,
                      "cancel_url": "https://customer.sandbox.viandeendirect.eu/orders/14/paymentCancelled",
                      "client_reference_id": null,
                      "client_secret": null,
                      "consent": null,
                      "consent_collection": null,
                      "created": 1718912761,
                      "currency": "eur",
                      "currency_conversion": null,
                      "custom_fields": [
                      ],
                      "custom_text": {
                        "after_submit": null,
                        "shipping_address": null,
                        "submit": null,
                        "terms_of_service_acceptance": null
                      },
                      "customer": null,
                      "customer_creation": "if_required",
                      "customer_details": {
                        "address": {
                          "city": null,
                          "country": "FR",
                          "line1": null,
                          "line2": null,
                          "postal_code": null,
                          "state": null
                        },
                        "email": "benjamin.moselle@gmail.com",
                        "name": "Will",
                        "phone": null,
                        "tax_exempt": "none",
                        "tax_ids": [
                        ]
                      },
                      "customer_email": "benjamin.moselle@gmail.com",
                      "expires_at": 1718914560,
                      "invoice": null,
                      "invoice_creation": {
                        "enabled": false,
                        "invoice_data": {
                          "account_tax_ids": null,
                          "custom_fields": null,
                          "description": null,
                          "footer": null,
                          "issuer": null,
                          "metadata": {
                          },
                          "rendering_options": null
                        }
                      },
                      "livemode": false,
                      "locale": null,
                      "metadata": {
                      },
                      "mode": "payment",
                      "payment_intent": "pi_3PTqwAERSs64ll6o1dBfYM9i",
                      "payment_link": null,
                      "payment_method_collection": "if_required",
                      "payment_method_configuration_details": {
                        "id": "pmc_1PTVR3ERSs64ll6oQrWm4D8p",
                        "parent": "pmc_1P7XTbCgv5VSh4jfC36xiCND"
                      },
                      "payment_method_options": {
                        "card": {
                          "request_three_d_secure": "automatic"
                        }
                      },
                      "payment_method_types": [
                        "card",
                        "link"
                      ],
                      "payment_status": "paid",
                      "phone_number_collection": {
                        "enabled": false
                      },
                      "recovered_from": null,
                      "saved_payment_method_options": null,
                      "setup_intent": null,
                      "shipping_address_collection": null,
                      "shipping_cost": null,
                      "shipping_details": null,
                      "shipping_options": [
                      ],
                      "status": "complete",
                      "submit_type": null,
                      "subscription": null,
                      "success_url": "https://customer.sandbox.viandeendirect.eu/orders/14/paymentSuccessful",
                      "total_details": {
                        "amount_discount": 0,
                        "amount_shipping": 0,
                        "amount_tax": 0
                      },
                      "ui_mode": "hosted",
                      "url": null
                    }
                  },
                  "livemode": false,
                  "pending_webhooks": 1,
                  "request": {
                    "id": null,
                    "idempotency_key": null
                  },
                  "type": "checkout.session.completed"
                }""";
        Event event = StripeObject.deserializeStripeObject(json, Event.class, ApiResource.getGlobalResponseGetter());

        // when
        Session session = stripeEventHandler.getCheckoutSession(event);

        // then
        assertNotNull(session);
    }

}