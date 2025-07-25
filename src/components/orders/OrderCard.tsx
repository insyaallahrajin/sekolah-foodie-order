
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { Order } from '@/types/order';
import { 
  getStatusColor, 
  getStatusText,
  formatPrice,
  formatDate 
} from '@/utils/orderUtils';

interface OrderCardProps {
  order: Order;
  onRetryPayment: (order: Order) => void;
}

export const OrderCard = ({ order, onRetryPayment }: OrderCardProps) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardHeader>
      <div className="flex justify-between items-start">
        <div>
          <CardTitle className="text-lg flex items-center">
            <User className="h-5 w-5 mr-2 text-orange-600" />
            {order.children?.name || 'Unknown'}
          </CardTitle>
          <CardDescription>
            Kelas {order.children?.class || 'Unknown'} • {formatDate(order.created_at)}
          </CardDescription>
        </div>
        <div className="text-right space-y-1">
          <Badge className={getStatusColor(order.status)}>
            {getStatusText(order.status)}
          </Badge>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {/* Order Items */}
        <div className="space-y-2">
          {order.order_items.map((item) => (
            <div key={item.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
              <img
                src={item.daily_menus?.food_items?.image_url || '/placeholder.svg'}
                alt={item.daily_menus?.food_items?.name || 'Food item'}
                className="w-12 h-12 object-cover rounded"
              />
              <div className="flex-1">
                <p className="font-medium text-sm">{item.daily_menus?.food_items?.name || 'Unknown item'}</p>
                <p className="text-xs text-gray-600">
                  {item.quantity}x • {formatPrice(item.unit_price)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Notes */}
        {order.special_notes && (
          <div className="p-2 bg-blue-50 rounded">
            <p className="text-sm text-blue-800">
              <strong>Catatan:</strong> {order.special_notes}
            </p>
          </div>
        )}

        {/* Total */}
        <div className="flex justify-between items-center pt-2 border-t">
          <span className="font-semibold">Total:</span>
          <span className="font-bold text-orange-600">
            {formatPrice(order.total_amount)}
          </span>
        </div>

        {/* Payment Button - Show for pending status */}
        {order.status === 'pending' && (
          <Button 
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            onClick={() => onRetryPayment(order)}
          >
            Bayar Sekarang
          </Button>
        )}
      </div>
    </CardContent>
  </Card>
);
