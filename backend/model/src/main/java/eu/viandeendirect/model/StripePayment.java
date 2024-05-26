package eu.viandeendirect.model;

import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Arrays;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.SequenceGenerator;
import org.openapitools.jackson.nullable.JsonNullable;
import io.swagger.v3.oas.annotations.media.Schema;


import jakarta.annotation.Generated;

/**
 * a payment piloted by Stripe platform.
 */

@Schema(name = "StripePayment", description = "a payment piloted by Stripe platform.")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen")
@jakarta.persistence.Entity
@jakarta.persistence.Table(name = "stripe_payments")
public class StripePayment {

  @JsonProperty("id")
  @jakarta.persistence.Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "stripe_payment_id_generator")
  @SequenceGenerator(name="stripe_payment_id_generator", sequenceName = "stripe_payment_id_seq", allocationSize = 1)
  private Integer id;

  @JsonProperty("checkoutSessionId")
  private String checkoutSessionId;

  @JsonProperty("paymentUrl")
  @jakarta.persistence.Transient
  private String paymentUrl;

  public StripePayment id(Integer id) {
    this.id = id;
    return this;
  }

  /**
   * the Stripe payment id given by viandeendirect.eu
   * @return id
  */
  
  @Schema(name = "id", description = "the Stripe payment id given by viandeendirect.eu", required = false)
  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public StripePayment checkoutSessionId(String checkoutSessionId) {
    this.checkoutSessionId = checkoutSessionId;
    return this;
  }

  /**
   * the Stripe Checkout Session id of the payment
   * @return checkoutSessionId
  */
  
  @Schema(name = "checkoutSessionId", description = "the Stripe Checkout Session id of the payment", required = false)
  public String getCheckoutSessionId() {
    return checkoutSessionId;
  }

  public void setCheckoutSessionId(String checkoutSessionId) {
    this.checkoutSessionId = checkoutSessionId;
  }

  public StripePayment paymentUrl(String paymentUrl) {
    this.paymentUrl = paymentUrl;
    return this;
  }

  /**
   * the url where to redirect the customer to process the payment on Stripe platform.
   * @return paymentUrl
  */
  
  @Schema(name = "paymentUrl", description = "the url where to redirect the customer to process the payment on Stripe platform.", required = false)
  public String getPaymentUrl() {
    return paymentUrl;
  }

  public void setPaymentUrl(String paymentUrl) {
    this.paymentUrl = paymentUrl;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    StripePayment stripePayment = (StripePayment) o;
    return Objects.equals(this.id, stripePayment.id) &&
        Objects.equals(this.checkoutSessionId, stripePayment.checkoutSessionId) &&
        Objects.equals(this.paymentUrl, stripePayment.paymentUrl);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, checkoutSessionId, paymentUrl);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class StripePayment {\n");
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    checkoutSessionId: ").append(toIndentedString(checkoutSessionId)).append("\n");
    sb.append("    paymentUrl: ").append(toIndentedString(paymentUrl)).append("\n");
    sb.append("}");
    return sb.toString();
  }

  /**
   * Convert the given object to string with each line indented by 4 spaces
   * (except the first line).
   */
  private String toIndentedString(Object o) {
    if (o == null) {
      return "null";
    }
    return o.toString().replace("\n", "\n    ");
  }
}

