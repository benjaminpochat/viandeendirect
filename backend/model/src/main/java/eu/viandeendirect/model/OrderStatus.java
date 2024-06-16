package eu.viandeendirect.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.annotation.Generated;

/**
 * Gets or Sets OrderStatus
 */

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen")
public enum OrderStatus {
  
  BOOKED_WITHOUT_PAYMENT("BOOKED_WITHOUT_PAYMENT"),

  PAYMENT_PENDING("PAYMENT_PENDING"),

  PAYMENT_COMPLETED("PAYMENT_COMPLETED"),
  
  PAYMENT_ABORTED("PAYMENT_ABORTED"),
  
  DELIVERED("DELIVERED");

  private String value;

  OrderStatus(String value) {
    this.value = value;
  }

  @JsonValue
  public String getValue() {
    return value;
  }

  @Override
  public String toString() {
    return String.valueOf(value);
  }

  @JsonCreator
  public static OrderStatus fromValue(String value) {
    for (OrderStatus b : OrderStatus.values()) {
      if (b.value.equals(value)) {
        return b;
      }
    }
    throw new IllegalArgumentException("Unexpected value '" + value + "'");
  }
}

