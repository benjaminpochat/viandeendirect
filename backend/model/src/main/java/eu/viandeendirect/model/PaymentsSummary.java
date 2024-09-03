package eu.viandeendirect.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Generated;

import java.util.Objects;

/**
 * the summary of payments made
 */

@Schema(name = "PaymentsSummary", description = "the summary of payments made")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen")
public class PaymentsSummary {

  @JsonProperty("daylyTotal")
  private Float daylyTotal;

  @JsonProperty("weeklyTotal")
  private Float weeklyTotal;

  @JsonProperty("monthlyTotal")
  private Float monthlyTotal;

  @JsonProperty("yearlyTotal")
  private Float yearlyTotal;

  public PaymentsSummary daylyTotal(Float daylyTotal) {
    this.daylyTotal = daylyTotal;
    return this;
  }

  /**
   * the total amount paid for last day
   * @return daylyTotal
  */
  
  @Schema(name = "daylyTotal", description = "the total amount paid for last day", required = false)
  public Float getDaylyTotal() {
    return daylyTotal;
  }

  public void setDaylyTotal(Float daylyTotal) {
    this.daylyTotal = daylyTotal;
  }

  public PaymentsSummary weeklyTotal(Float weeklyTotal) {
    this.weeklyTotal = weeklyTotal;
    return this;
  }

  /**
   * the total amount paid for last week
   * @return weeklyTotal
  */
  
  @Schema(name = "weeklyTotal", description = "the total amount paid for last week", required = false)
  public Float getWeeklyTotal() {
    return weeklyTotal;
  }

  public void setWeeklyTotal(Float weeklyTotal) {
    this.weeklyTotal = weeklyTotal;
  }

  public PaymentsSummary monthlyTotal(Float monthlyTotal) {
    this.monthlyTotal = monthlyTotal;
    return this;
  }

  /**
   * the total amount paid for last month
   * @return monthlyTotal
  */
  
  @Schema(name = "monthlyTotal", description = "the total amount paid for last month", required = false)
  public Float getMonthlyTotal() {
    return monthlyTotal;
  }

  public void setMonthlyTotal(Float monthlyTotal) {
    this.monthlyTotal = monthlyTotal;
  }

  public PaymentsSummary yearlyTotal(Float yearlyTotal) {
    this.yearlyTotal = yearlyTotal;
    return this;
  }

  /**
   * the total amount paid for last year
   * @return yearlyTotal
  */
  
  @Schema(name = "yearlyTotal", description = "the total amount paid for last year", required = false)
  public Float getYearlyTotal() {
    return yearlyTotal;
  }

  public void setYearlyTotal(Float yearlyTotal) {
    this.yearlyTotal = yearlyTotal;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    PaymentsSummary paymentsSummary = (PaymentsSummary) o;
    return Objects.equals(this.daylyTotal, paymentsSummary.daylyTotal) &&
        Objects.equals(this.weeklyTotal, paymentsSummary.weeklyTotal) &&
        Objects.equals(this.monthlyTotal, paymentsSummary.monthlyTotal) &&
        Objects.equals(this.yearlyTotal, paymentsSummary.yearlyTotal);
  }

  @Override
  public int hashCode() {
    return Objects.hash(daylyTotal, weeklyTotal, monthlyTotal, yearlyTotal);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class PaymentsSummary {\n");
    sb.append("    daylyTotal: ").append(toIndentedString(daylyTotal)).append("\n");
    sb.append("    weeklyTotal: ").append(toIndentedString(weeklyTotal)).append("\n");
    sb.append("    monthlyTotal: ").append(toIndentedString(monthlyTotal)).append("\n");
    sb.append("    yearlyTotal: ").append(toIndentedString(yearlyTotal)).append("\n");
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

