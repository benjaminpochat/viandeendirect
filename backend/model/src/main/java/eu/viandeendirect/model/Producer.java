package eu.viandeendirect.model;

import java.net.URI;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import eu.viandeendirect.model.ProducerStatus;
import eu.viandeendirect.model.Production;
import eu.viandeendirect.model.User;
import java.math.BigDecimal;
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
  private BigDecimal id;

  @JsonProperty("status")
  private ProducerStatus status;

  @JsonProperty("salesCredits")
  private BigDecimal salesCredits;

  @JsonProperty("productions")
  @jakarta.persistence.OneToMany(mappedBy = "producer")
  @Valid
  private List<Production> productions = null;

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

  public Producer id(BigDecimal id) {
    this.id = id;
    return this;
  }

  /**
   * 
   * @return id
  */
  @Valid 
  @Schema(name = "id", description = "", required = false)
  public BigDecimal getId() {
    return id;
  }

  public void setId(BigDecimal id) {
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

  public Producer salesCredits(BigDecimal salesCredits) {
    this.salesCredits = salesCredits;
    return this;
  }

  /**
   * the number of sales available
   * @return salesCredits
  */
  @Valid 
  @Schema(name = "salesCredits", description = "the number of sales available", required = false)
  public BigDecimal getSalesCredits() {
    return salesCredits;
  }

  public void setSalesCredits(BigDecimal salesCredits) {
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
        Objects.equals(this.productions, producer.productions);
  }

  @Override
  public int hashCode() {
    return Objects.hash(user, id, status, salesCredits, productions);
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

