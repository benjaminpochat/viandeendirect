package eu.viandeendirect.model;

import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;


import jakarta.annotation.Generated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Transient;

/**
 * an account for Stripe payment service
 */

@Schema(name = "StripeAccount", description = "an account for Stripe payment service")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen")
@jakarta.persistence.Entity @jakarta.persistence.Table(name = "stripe_accounts")
public class StripeAccount {

  @JsonProperty("id")
  @jakarta.persistence.Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "stripe_account_id_generator")
  @SequenceGenerator(name="stripe_account_id_generator", sequenceName = "stripe_account_id_seq", allocationSize = 1)
  private Integer id;

  @JsonProperty("stripeId")
  private String stripeId;

  @JsonProperty("detailsSubmitted")
  @Transient
  private Boolean detailsSubmitted;

  @JsonProperty("accountLink")
  @Transient
  private String accountLink;

  public StripeAccount id(Integer id) {
    this.id = id;
    return this;
  }

  /**
   * the Stripe account id given by viandeendirect.eu
   * @return id
  */
  
  @Schema(name = "id", description = "the Stripe account id given by viandeendirect.eu", required = false)
  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public StripeAccount stripeId(String stripeId) {
    this.stripeId = stripeId;
    return this;
  }

  /**
   * the Stripe account id given by Stripe service
   * @return stripeId
  */
  
  @Schema(name = "stripeId", description = "the Stripe account id given by Stripe service", required = false)
  public String getStripeId() {
    return stripeId;
  }

  public void setStripeId(String stripeId) {
    this.stripeId = stripeId;
  }

  public StripeAccount detailsSubmitted(Boolean detailsSubmitted) {
    this.detailsSubmitted = detailsSubmitted;
    return this;
  }

  /**
   * Get detailsSubmitted
   * @return detailsSubmitted
  */
  
  @Schema(name = "detailsSubmitted", required = false)
  public Boolean getDetailsSubmitted() {
    return detailsSubmitted;
  }

  public void setDetailsSubmitted(Boolean detailsSubmitted) {
    this.detailsSubmitted = detailsSubmitted;
  }

  public StripeAccount accountLink(String accountLink) {
    this.accountLink = accountLink;
    return this;
  }

  /**
   * Get accountLink
   * @return accountLink
  */

  @Schema(name = "accountLink", required = false)
  public String getAccountLink() {
    return accountLink;
  }

  public void setAccountLink(String accountLink) {
    this.accountLink = accountLink;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    StripeAccount stripeAccount = (StripeAccount) o;
    return Objects.equals(this.id, stripeAccount.id) &&
        Objects.equals(this.stripeId, stripeAccount.stripeId) &&
        Objects.equals(this.detailsSubmitted, stripeAccount.detailsSubmitted) &&
        Objects.equals(this.accountLink, stripeAccount.accountLink);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, stripeId, detailsSubmitted, accountLink);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class StripeAccount {\n");
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    stripeId: ").append(toIndentedString(stripeId)).append("\n");
    sb.append("    detailsSubmitted: ").append(toIndentedString(detailsSubmitted)).append("\n");
    sb.append("    accountLink: ").append(toIndentedString(accountLink)).append("\n");
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

