package eu.viandeendirect.model;

import java.net.URI;
import java.util.Objects;

import com.fasterxml.jackson.annotation.*;
import eu.viandeendirect.model.ProducerStatus;
import eu.viandeendirect.model.Production;
import eu.viandeendirect.model.Sale;
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
 * 
 */

@Schema(name = "Producer", description = "")
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

  @JsonProperty("salesCredits")
  private Integer salesCredits;

  @JsonProperty("productions")
  @JsonIgnore
  @jakarta.persistence.OneToMany(mappedBy = "producer")
  @Valid
  private List<Production> productions = null;

  @JsonProperty("sales")
  @JsonManagedReference("salesSeller")
  @jakarta.persistence.OneToMany(mappedBy = "seller")
  @Valid
  private List<Sale> sales = null;

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

  public Producer salesCredits(Integer salesCredits) {
    this.salesCredits = salesCredits;
    return this;
  }

  /**
   * the number of sales available
   * @return salesCredits
  */

  @Schema(name = "salesCredits", description = "the number of sales available", required = false)
  public Integer getSalesCredits() {
    return salesCredits;
  }

  public void setSalesCredits(Integer salesCredits) {
    this.salesCredits = salesCredits;
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
        Objects.equals(this.salesCredits, producer.salesCredits) &&
        Objects.equals(this.productions, producer.productions) &&
        Objects.equals(this.sales, producer.sales);
  }

  @Override
  public int hashCode() {
    return Objects.hash(user, id, status, salesCredits, productions, sales);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Producer {\n");
    sb.append("    user: ").append(toIndentedString(user)).append("\n");
    sb.append("    id: ").append(toIndentedString(id)).append("\n");
    sb.append("    status: ").append(toIndentedString(status)).append("\n");
    sb.append("    salesCredits: ").append(toIndentedString(salesCredits)).append("\n");
    sb.append("    productions: ").append(toIndentedString(productions)).append("\n");
    sb.append("    sales: ").append(toIndentedString(sales)).append("\n");
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

