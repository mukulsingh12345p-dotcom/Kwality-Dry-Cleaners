import { ServiceItem, Order } from './types';

export const SERVICES: ServiceItem[] = [
  // Dry Clean - Garments (Men)
  { id: 'g_m_1', name: 'Pathani Suit', price: 245, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_2', name: 'Pyjama', price: 99, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_3', name: 'Light Jacket', price: 245, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_4', name: 'Safari Suit', price: 375, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_5', name: 'Sherwani Plain', price: 425, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_6', name: 'Shirt', price: 125, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_7', name: 'Shorts', price: 85, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_8', name: 'Sports Jacket', price: 325, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_9', name: 'Suit (2 Piece)', price: 445, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_10', name: 'Suit (3 Piece)', price: 575, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_11', name: 'Sweatpants', price: 145, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_12', name: 'Sweatshirt', price: 225, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_13', name: 'Sweater Half', price: 175, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_14', name: 'Swimming Costume', price: 125, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_15', name: 'T-Shirt', price: 125, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_16', name: 'Tie', price: 55, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_17', name: 'Tuxedo', price: 495, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_18', name: 'Undershirt', price: 35, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_19', name: 'Waistcoat', price: 135, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_20', name: 'Woolen Shirt', price: 145, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_21', name: 'Sweater Full Sleeves Heavy', price: 225, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_22', name: 'Sweater Full Sleeves Plain', price: 195, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_23', name: 'Sweater Half Sleeves Heavy', price: 225, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_24', name: 'Silk Shirt', price: 145, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_25', name: 'Dhoti', price: 125, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_26', name: 'Jacket with Hood', price: 345, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_27', name: 'Safari Suit Coat', price: 275, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_28', name: 'Safari Suit Pant', price: 99, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_29', name: 'Kurta Heavy', price: 175, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_30', name: 'Shawl Light', price: 195, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_31', name: 'Underwear', price: 35, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_32', name: 'Vest', price: 35, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_33', name: 'Nehru Jacket', price: 185, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_34', name: 'Dhoti Kurta', price: 225, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_35', name: 'Track Suit Pant', price: 99, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_36', name: 'Track Suit Upper', price: 165, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_37', name: 'Long Pullover', price: 275, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_38', name: 'Trousers/Pants', price: 125, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_39', name: 'Jacket Half Sleeves', price: 275, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_40', name: 'Jacket Full Sleeves', price: 325, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_41', name: 'Long Coat', price: 345, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_42', name: 'Kurta Plain', price: 135, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_43', name: 'Muffler', price: 85, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_44', name: 'Sweater Full Sleeves Medium', price: 225, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_45', name: 'Premium Leather Jacket', price: 1295, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_46', name: 'Collar T-Shirt', price: 125, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_47', name: 'Round Neck T-Shirt', price: 85, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_48', name: 'Sweatshirt with Hood', price: 245, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_49', name: 'Shawl Medium Work', price: 225, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_50', name: 'Shawl Heavy Work', price: 325, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_51', name: 'Sherwani Medium Work', price: 495, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_52', name: 'Sweater Half Medium', price: 195, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_53', name: 'Sweater Half Plain', price: 175, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_54', name: 'Suede Pants', price: 395, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_55', name: 'Lungi', price: 115, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_56', name: 'Body Warmer Lower', price: 125, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_57', name: 'Body Warmer Upper', price: 125, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_58', name: 'Varsity Jacket', price: 495, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_59', name: 'Suede Jacket', price: 645, category: 'Dry Clean-Garments', subCategory: 'Men' },
  { id: 'g_m_60', name: 'Biker Leather Jacket', price: 645, category: 'Dry Clean-Garments', subCategory: 'Men' },

  // Dry Clean - Garments (Women & Kids)
  { id: 'g3', name: 'Saree', price: 250, category: 'Dry Clean-Garments', subCategory: 'Women' },
  { id: 'g4', name: 'Dress', price: 300, category: 'Dry Clean-Garments', subCategory: 'Women' },
  { id: 'g5', name: 'Kids Jacket', price: 150, category: 'Dry Clean-Garments', subCategory: 'Kids' },
  { id: 'g6', name: 'School Uniform', price: 180, category: 'Dry Clean-Garments', subCategory: 'Kids' },

  // Dry Clean - Household
  { id: 'h1', name: 'Bag Small', price: 245, category: 'Dry Clean-Household' },
  { id: 'h2', name: 'Bed Sheet Double', price: 195, category: 'Dry Clean-Household' },
  { id: 'h3', name: 'Duvet Single', price: 245, category: 'Dry Clean-Household' },
  { id: 'h4', name: 'Bed Sheet Single', price: 145, category: 'Dry Clean-Household' },
  
  // Shoe Clean
  { id: 's1', name: 'Sneakers', price: 545, category: 'Shoe Clean' },
  { id: 's2', name: 'Leather Shoes', price: 545, category: 'Shoe Clean' },
  { id: 's3', name: 'Sports Shoes', price: 375, category: 'Shoe Clean' },
  { id: 's4', name: 'Kids Shoes', price: 245, category: 'Shoe Clean' },

  // Premium Laundry
  { id: 'p1', name: 'Capri', price: 60, category: 'Premium Laundry', subCategory: 'Men' },
  { id: 'p2', name: 'Coat', price: 150, category: 'Premium Laundry', subCategory: 'Men' },
  { id: 'p3', name: 'Jeans', price: 75, category: 'Premium Laundry', subCategory: 'Men' },
  { id: 'p4', name: 'Kurta Pyajama', price: 105, category: 'Premium Laundry', subCategory: 'Men' },
  { id: 'p5', name: 'Blouse', price: 80, category: 'Premium Laundry', subCategory: 'Women' },
  { id: 'p6', name: 'Skirt', price: 90, category: 'Premium Laundry', subCategory: 'Women' },
  { id: 'p7', name: 'Kids T-Shirt', price: 50, category: 'Premium Laundry', subCategory: 'Kids' },
  { id: 'p8', name: 'Kids Shorts', price: 45, category: 'Premium Laundry', subCategory: 'Kids' },
  { id: 'p9', name: 'Towel', price: 40, category: 'Premium Laundry', subCategory: 'Households' },
  { id: 'p10', name: 'Pillow Cover', price: 30, category: 'Premium Laundry', subCategory: 'Households' },
];

export const CATEGORIES = [
  { 
    id: 'garments', 
    name: 'Dry Clean-Garments', 
    icon: 'Shirt',
    subcategories: ['Men', 'Women', 'Kids']
  },
  { 
    id: 'household', 
    name: 'Dry Clean-Household', 
    icon: 'Home' 
  },
  { 
    id: 'shoes', 
    name: 'Shoe Clean', 
    icon: 'Footprints' 
  },
  { 
    id: 'laundry', 
    name: 'Premium Laundry', 
    icon: 'Waves',
    subcategories: ['Men', 'Women', 'Kids', 'Households']
  },
];
