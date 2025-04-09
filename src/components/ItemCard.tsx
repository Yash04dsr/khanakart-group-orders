
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { MenuItem } from "@/types";

interface ItemCardProps {
  item: MenuItem;
  quantity: number;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

const ItemCard = ({ item, quantity, onUpdateQuantity }: ItemCardProps) => {
  // Quantity step based on whether fractional quantities are allowed
  const step = item.allowsFractions ? 0.5 : 1;

  // Handle increment/decrement
  const handleIncrement = () => {
    onUpdateQuantity(item.id, quantity + step);
  };

  const handleDecrement = () => {
    if (quantity >= step) {
      onUpdateQuantity(item.id, quantity - step);
    }
  };

  // Handle direct input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseFloat(e.target.value);
    
    // Validate and enforce constraints
    if (isNaN(value)) {
      value = 0;
    } else if (!item.allowsFractions) {
      value = Math.floor(value);
    } else {
      // Round to nearest 0.5 for fractions
      value = Math.round(value * 2) / 2;
    }
    
    onUpdateQuantity(item.id, value);
  };
  
  return (
    <Card className={quantity > 0 ? "border-khanakart-primary border-2" : ""}>
      <CardContent className="pt-6">
        <div className="space-y-2">
          <h3 className="font-medium">{item.name}</h3>
          <p className="text-khanakart-primary font-semibold">₹{item.price}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleDecrement}
            disabled={quantity === 0}
          >
            <Minus className="h-4 w-4" />
          </Button>
          
          <input
            type="number"
            value={quantity || ""}
            onChange={handleInputChange}
            className="w-14 mx-2 text-center border rounded-md p-1 bg-transparent"
            step={step}
            min="0"
            placeholder="0"
          />
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleIncrement}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {quantity > 0 && (
          <div className="text-right text-sm font-medium">
            ₹{(quantity * item.price).toFixed(2)}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ItemCard;
