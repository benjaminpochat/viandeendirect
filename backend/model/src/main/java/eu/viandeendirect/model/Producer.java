package eu.viandeendirect.model;

import java.net.URI;
import java.util.Objects;

import com.fasterxml.jackson.annotation.*;
import eu.viandeendirect.model.ProducerStatus;
import eu.viandeendirect.model.Production;
import eu.viandeendirect.model.Sale;
import eu.viandeendirect.model.StripeAccount;
import eu.viandeendirect.model.User;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import org.openapitools.jackson.nullable.JsonNullable;
import java.time.OffsetDateTime;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import io.swagger.v3.oas.annotations.media.Schema;


import java.util.*;
import jakarta.annotation.Generated;

/**
 * a producer
 */

@Schema(name = "Producer", description = "a producer")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen")
@jakarta.persistence.Entity @jakarta.persistence.Table(name = "producers")
public class Producer {

  @OneToOne
  @JoinColumn(name = "user_id")
  @JsonProperty("user")
  private User user;

  @JsonProperty("id")
  @jakarta.persistence.Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "producer_id_generator")
  @SequenceGenerator(name="producer_id_generator", sequenceName = "producer_id_seq", allocationSize = 1)
  private Integer id;

  @JsonProperty("status")
  private ProducerStatus status;

  @JsonProperty("productions")
  @JsonIgnore
  @jakarta.persistence.OneToMany(mappedBy = "producer")
  @Valid
  private List<Production> productions = null;

  @JsonProperty("sales")
  @JsonIgnore
  @JsonManagedReference("salesSeller")
  @jakarta.persistence.OneToMany(mappedBy = "seller")
  @Valid
  private List<Sale> sales = null;

  @JsonProperty("stripeAccount")
  @OneToOne
  @JoinColumn(name = "stripe_account_id")
  private StripeAccount stripeAccount;

  @JsonProperty("slideShowUrl")
  private String slideShowUrl;

  @JsonProperty("websiteUrl")
  private String websiteUrl;

  @JsonProperty("farmName")
  private String farmName;

  @JsonProperty("legalName")
  private String legalName;

  @JsonProperty("legalIdentificationNumber")
  private String legalIdentificationNumber;

  @JsonProperty("address")
  @OneToOne
  private Address address;

  public Producer user(User user) {
    this.user = user;
    return this;
  }

  /**
   * Get user
   * @return user
  */
  @Valid 
  @Schema(name = "user", required = false)
  public User getUser() {
    return user;
  }

  public void setUser(User user) {
    this.user = user;
  }

  public Producer id(Integer id) {
    this.id = id;
    return this;
  }

  /**
   * Get id
   * @return id
  */

  @Schema(name = "id", required = false)
  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public Producer status(ProducerStatus status) {
    this.status = status;
    return this;
  }

  /**
   * Get status
   * @return status
  */
  @Valid 
  @Schema(name = "status", required = false)
  public ProducerStatus getStatus() {
    return status;
  }

  public void setStatus(ProducerStatus status) {
    this.status = status;
  }

  public Producer productions(List<Production> productions) {
    this.productions = productions;
    return this;
  }

  public Producer addProductionsItem(Production productionsItem) {
    if (this.productions == null) {
      this.productions = new ArrayList<>();
    }
    this.productions.add(productionsItem);
    return this;
  }

  /**
   * Get productions
   * @return productions
  */
  @Valid 
  @Schema(name = "productions", required = false)
  public List<Production> getProductions() {
    return productions;
  }

  public void setProductions(List<Production> productions) {
    this.productions = productions;
  }

  public Producer sales(List<Sale> sales) {
    this.sales = sales;
    return this;
  }

  public Producer addSalesItem(Sale salesItem) {
    if (this.sales == null) {
      this.sales = new ArrayList<>();
    }
    this.sales.add(salesItem);
    return this;
  }

  /**
   * Get sales
   * @return sales
  */
  @Valid
  @Schema(name = "sales", required = false)
  public List<Sale> getSales() {
    return sales;
  }

  public void setSales(List<Sale> sales) {
    this.sales = sales;
  }

  public Producer stripeAccount(StripeAccount stripeAccount) {
    this.stripeAccount = stripeAccount;
    return this;
  }

  /**
   * Get stripeAccount
   * @return stripeAccount
  */
  @Valid
  @Schema(name = "stripeAccount")
  public StripeAccount getStripeAccount() {
    return stripeAccount;
  }

  public void setStripeAccount(StripeAccount stripeAccount) {
    this.stripeAccount = stripeAccount;
  }

  public Producer slideShowUrl(String slideShowUrl) {
    this.slideShowUrl = slideShowUrl;
    return this;
  }

  /**
   * url of a slide show to present the producer
   * @return slideShowUrl
  */

  @Schema(name = "slideShowUrl", description = "url of a slide show to present the producer", required = false)
  public String getSlideShowUrl() {
    return slideShowUrl;
  }

  public void setSlideShowUrl(String slideShowUrl) {
    this.slideShowUrl = slideShowUrl;
  }

  public Producer websiteUrl(String websiteUrl) {
    this.websiteUrl = websiteUrl;
    return this;
  }

  /**
   * url of the producer's website
   * @return websiteUrl
  */

  @Schema(name = "websiteUrl", description = "url of the producer's website", required = false)
  public String getWebsiteUrl() {
    return websiteUrl;
  }

  public void setWebsiteUrl(String websiteUrl) {
    this.websiteUrl = websiteUrl;
  }

  public Producer farmName(String farmName) {
    this.farmName = farmName;
    return this;
  }

  /**
   * public name of the farm
   * @return farmName
  */

  @Schema(name = "farmName", description = "public name of the farm", required = false)
  public String getFarmName() {
    return farmName;
  }

  public void setFarmName(String farmName) {
    this.farmName = farmName;
  }

  public Producer legalName(String legalName) {
    this.legalName = legalName;
    return this;
  }

  /**
   * legal name of the company
   * @return legalName
  */

  @Schema(name = "legalName", description = "legal name of the company", required = false)
  public String getLegalName() {
    return legalName;
  }

  public void setLegalName(String legalName) {
    this.legalName = legalName;
  }

  public Producer legalIdentificationNumber(String legalIdentificationNumber) {
    this.legalIdentificationNumber = legalIdentificationNumber;
    return this;
  }

  /**
   * legal identification of the company
   * @return legalIdentificationNumber
  */

  @Schema(name = "legalIdentificationNumber", description = "legal identification of the company", required = false)
  public String getLegalIdentificationNumber() {
    return legalIdentificationNumber;
  }

  public void setLegalIdentificationNumber(String legalIdentificationNumber) {
    this.legalIdentificationNumber = legalIdentificationNumber;
  }

  public Producer address(Address address) {
    this.address = address;
    return this;
  }

  /**
   * Get address
   * @return address
  */
  @Valid
  @Schema(name = "address", required = false)
  public Address getAddress() {
    return address;
  }

  public void setAddress(Address address) {
    this.address = address;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    Producer producer = (Producer) o;
    return Objects.equals(this.user, producer.user) &&
        Objects.equals(this.id, producer.id) &&
        Objects.equals(this.status, producer.status) &&
        Objects.equals(this.productions, producer.productions) &&
        Objects.equals(this.sales, producer.sales) &&
        Objects.equals(this.stripeAccount, producer.stripeAccount) &&
        Objects.equals(this.slideShowUrl, producer.slideShowUrl) &&
        Objects.equals(this.websiteUrl, producer.websiteUrl) &&
        Objects.equals(this.farmName, producer.farmName) &&
        Objects.equals(this.legalName, producer.legalName) &&
        Objects.equals(this.legalIdentificationNumber, producer.legalIdentificationNumber) &&
        Objects.equals(this.address, producer.address);
  }

  @Override
  public int hashCode() {
    return Objects.hash(user, id, status, productions, sales, stripeAccount, slideShowUrl, websiteUrl, farmName, legalName, legalIdentificationNumber, address);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Producer {\n");
    sb.append("    user: ").append(toIndentedString(user)).append("\n");
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    status: ").append(toIndentedString(status)).append("\n");
    sb.append("    productions: ").append(toIndentedString(productions)).append("\n");
    sb.append("    sales: ").append(toIndentedString(sales)).append("\n");
    sb.append("    stripeAccount: ").append(toIndentedString(stripeAccount)).append("\n");
    sb.append("    slideShowUrl: ").append(toIndentedString(slideShowUrl)).append("\n");
    sb.append("    websiteUrl: ").append(toIndentedString(websiteUrl)).append("\n");
    sb.append("    farmName: ").append(toIndentedString(farmName)).append("\n");
    sb.append("    legalName: ").append(toIndentedString(legalName)).append("\n");
    sb.append("    legalIdentificationNumber: ").append(toIndentedString(legalIdentificationNumber)).append("\n");
    sb.append("    address: ").append(toIndentedString(address)).append("\n");
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

