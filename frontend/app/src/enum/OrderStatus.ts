export enum OrderStatus {
  BookedWithoutpayment = 'BOOKED_WITHOUT_PAYMENT', 
  PaymentPending = 'PAYMENT_PENDING', 
  PaymentCompleted = 'PAYMENT_COMPLETED', 
  PaymentAborted = 'PAYMENT_ABORTED', 
  Delivered = 'DELIVERED'
}

export class OrderStatusUtils {
  static getOrderStatusLabel(orderStatus: OrderStatus) {
    switch (orderStatus) {
      case OrderStatus.BookedWithoutpayment:
        return 'Réservé sans paiement';
      case OrderStatus.PaymentPending:
        return 'Paiement en cours';
      case OrderStatus.PaymentCompleted:
        return 'Payé';
      case OrderStatus.PaymentAborted:
        return 'Paiement échoué';
        case OrderStatus.Delivered:
          return 'Livré';
        default:
        return '';
    }
  }

}