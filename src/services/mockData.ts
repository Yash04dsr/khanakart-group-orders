
import { MenuItem, OrderSession } from "../types";

export const MENU_ITEMS: MenuItem[] = [
  // Appetizers
  { 
    id: "app-1", 
    name: "Honey Chilli Potato", 
    category: "appetizers", 
    price: 180, 
    allowsFractions: false 
  },
  { 
    id: "app-2", 
    name: "Chilli Potato", 
    category: "appetizers", 
    price: 160, 
    allowsFractions: false 
  },
  { 
    id: "app-3", 
    name: "Paneer Tikka", 
    category: "appetizers", 
    price: 220, 
    allowsFractions: false 
  },
  { 
    id: "app-4", 
    name: "Tandoori Momos", 
    category: "appetizers", 
    price: 190, 
    allowsFractions: false 
  },
  { 
    id: "app-5", 
    name: "Spring Rolls", 
    category: "appetizers", 
    price: 150, 
    allowsFractions: false 
  },
  
  // Main Course
  { 
    id: "main-1", 
    name: "Kadhai Paneer", 
    category: "main_course", 
    price: 250, 
    allowsFractions: true 
  },
  { 
    id: "main-2", 
    name: "Shahi Paneer", 
    category: "main_course", 
    price: 270, 
    allowsFractions: true 
  },
  { 
    id: "main-3", 
    name: "Paneer Lababdar", 
    category: "main_course", 
    price: 260, 
    allowsFractions: true 
  },
  { 
    id: "main-4", 
    name: "Dal Makhani", 
    category: "main_course", 
    price: 180, 
    allowsFractions: true 
  },
  { 
    id: "main-5", 
    name: "Dal Fry", 
    category: "main_course", 
    price: 160, 
    allowsFractions: true 
  },
  { 
    id: "main-6", 
    name: "Mix Veg", 
    category: "main_course", 
    price: 200, 
    allowsFractions: true 
  },
  { 
    id: "main-7", 
    name: "Noodles", 
    category: "main_course", 
    price: 190, 
    allowsFractions: false 
  },
  
  // Bread
  { 
    id: "bread-1", 
    name: "Roti", 
    category: "bread", 
    price: 25, 
    allowsFractions: false 
  },
  { 
    id: "bread-2", 
    name: "Naan", 
    category: "bread", 
    price: 35, 
    allowsFractions: false 
  },
  { 
    id: "bread-3", 
    name: "Butter Roti", 
    category: "bread", 
    price: 30, 
    allowsFractions: false 
  },
  { 
    id: "bread-4", 
    name: "Laccha Paratha", 
    category: "bread", 
    price: 40, 
    allowsFractions: false 
  },
  
  // Beverages & Desserts
  { 
    id: "bev-1", 
    name: "Sprite", 
    category: "beverages", 
    price: 60, 
    allowsFractions: false 
  },
  { 
    id: "bev-2", 
    name: "Red Bull", 
    category: "beverages", 
    price: 120, 
    allowsFractions: false 
  },
  { 
    id: "bev-3", 
    name: "Maaza", 
    category: "beverages", 
    price: 50, 
    allowsFractions: false 
  },
  { 
    id: "bev-4", 
    name: "Ice Cream", 
    category: "beverages", 
    price: 80, 
    allowsFractions: false 
  }
];

export const MOCK_ORDER_SESSIONS: OrderSession[] = [
  {
    id: "session-1",
    title: "Lunch Order - April 9th",
    createdAt: "2025-04-09T10:00:00Z",
    deadline: "2025-04-09T12:30:00Z",
    isActive: true,
    orders: []
  },
  {
    id: "session-2",
    title: "Dinner Order - April 8th",
    createdAt: "2025-04-08T17:00:00Z",
    deadline: "2025-04-08T19:00:00Z",
    isActive: false,
    orders: [
      {
        userId: "user-1",
        userName: "Team Member 1",
        items: [
          { menuItemId: "main-1", quantity: 0.5, price: 250 },
          { menuItemId: "bread-2", quantity: 2, price: 35 },
          { menuItemId: "bev-1", quantity: 1, price: 60 }
        ]
      },
      {
        userId: "user-2",
        userName: "Team Member 2",
        items: [
          { menuItemId: "app-1", quantity: 1, price: 180 },
          { menuItemId: "main-3", quantity: 1.5, price: 260 }
        ]
      }
    ]
  }
];
