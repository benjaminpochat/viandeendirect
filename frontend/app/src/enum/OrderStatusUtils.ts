import { OrderStatus } from "@viandeendirect/api/dist/models/OrderStatus";
import { EnumUtils } from "./EnumUtils";

export class OrderStatusUtils implements EnumUtils<OrderStatus>{
  getLabel(orderStatus: OrderStatus | undefined, capitalized: boolean = false): string {
    switch (orderStatus) {
      case OrderStatus.BookedWithoutPayment:
        return capitalized ? 'Réservé sans paiement' : 'réservé sans paiement'
      case OrderStatus.PaymentPending:
        return capitalized ? 'Paiement en cours' : 'paiement en cours'
      case OrderStatus.PaymentCompleted:
        return capitalized ? 'Payé' : 'payé'
      case OrderStatus.PaymentAborted:
        return capitalized ? 'Paiement échoué' : 'paiement échoué'
      case OrderStatus.Delivered:
        return capitalized ? 'Livré' : 'livré'
      default:
        return ''
    }
  }
  getLabels(): Array<{ id: any; label: any; }> {
    let labels: Array<{id, label}> = []
    for (const [, value] of Object.entries(OrderStatus)) {
      labels.push({id: value, label: this.getLabel(value)})
    }
    return labels
  }
}