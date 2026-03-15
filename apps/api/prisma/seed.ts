import { PrismaClient, Role, Country, CardType, OrderStatus } from '.prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import * as bcrypt from 'bcryptjs';

const adapter = new PrismaLibSql({ url: 'file:dev.db' });
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.paymentMethod.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash('password123', 10);

  // --- USERS ---
  const nickFury = await prisma.user.create({
    data: {
      name: 'Nick Fury',
      email: 'nickfury@slooze.com',
      password,
      role: Role.ADMIN,
      country: Country.AMERICA,
    },
  });

  const captainMarvel = await prisma.user.create({
    data: {
      name: 'Captain Marvel',
      email: 'captainmarvel@slooze.com',
      password,
      role: Role.MANAGER,
      country: Country.INDIA,
    },
  });

  const captainAmerica = await prisma.user.create({
    data: {
      name: 'Captain America',
      email: 'captainamerica@slooze.com',
      password,
      role: Role.MANAGER,
      country: Country.AMERICA,
    },
  });

  const thanos = await prisma.user.create({
    data: {
      name: 'Thanos',
      email: 'thanos@slooze.com',
      password,
      role: Role.MEMBER,
      country: Country.INDIA,
    },
  });

  const thor = await prisma.user.create({
    data: {
      name: 'Thor',
      email: 'thor@slooze.com',
      password,
      role: Role.MEMBER,
      country: Country.INDIA,
    },
  });

  const travis = await prisma.user.create({
    data: {
      name: 'Travis',
      email: 'travis@slooze.com',
      password,
      role: Role.MEMBER,
      country: Country.AMERICA,
    },
  });

  console.log('✅ Users created');

  // --- PAYMENT METHODS (Admin only manages these) ---
  const pm1 = await prisma.paymentMethod.create({
    data: {
      type: CardType.VISA,
      last4: '4242',
      name: 'Nick Fury',
      userId: nickFury.id,
      isDefault: true,
    },
  });

  await prisma.paymentMethod.create({
    data: {
      type: CardType.MASTERCARD,
      last4: '5555',
      name: 'Nick Fury',
      userId: nickFury.id,
    },
  });

  const pm2 = await prisma.paymentMethod.create({
    data: {
      type: CardType.AMEX,
      last4: '3782',
      name: 'Captain Marvel',
      userId: captainMarvel.id,
      isDefault: true,
    },
  });

  const pm3 = await prisma.paymentMethod.create({
    data: {
      type: CardType.VISA,
      last4: '1234',
      name: 'Captain America',
      userId: captainAmerica.id,
      isDefault: true,
    },
  });

  console.log('✅ Payment methods created');

  // --- INDIA RESTAURANTS ---
  const biryaniHouse = await prisma.restaurant.create({
    data: {
      name: 'Biryani House',
      cuisine: 'Indian',
      image: 'https://images.unsplash.com/photo-1563379091339-03246963d651?w=400',
      rating: 4.7,
      country: Country.INDIA,
      menuItems: {
        create: [
          {
            name: 'Hyderabadi Chicken Biryani',
            description: 'Aromatic basmati rice with tender chicken',
            price: 299,
            category: 'Main Course',
            image: 'https://images.unsplash.com/photo-1563379091339-03246963d651?w=200',
          },
          {
            name: 'Mutton Biryani',
            description: 'Slow-cooked mutton with fragrant spices',
            price: 399,
            category: 'Main Course',
            image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=200',
          },
          {
            name: 'Veg Biryani',
            description: 'Fresh vegetables with basmati rice',
            price: 199,
            category: 'Main Course',
            image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200',
          },
          {
            name: 'Raita',
            description: 'Chilled yogurt with cucumber',
            price: 49,
            category: 'Sides',
            image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200',
          },
          {
            name: 'Phirni',
            description: 'Rice-based milk dessert',
            price: 99,
            category: 'Dessert',
            image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=200',
          },
        ],
      },
    },
  });

  const spiceGarden = await prisma.restaurant.create({
    data: {
      name: 'Spice Garden',
      cuisine: 'North Indian',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
      rating: 4.5,
      country: Country.INDIA,
      menuItems: {
        create: [
          {
            name: 'Butter Chicken',
            description: 'Creamy tomato-based curry with tender chicken',
            price: 320,
            category: 'Main Course',
            image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200',
          },
          {
            name: 'Dal Makhani',
            description: 'Slow-cooked black lentils in butter',
            price: 220,
            category: 'Main Course',
            image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200',
          },
          {
            name: 'Garlic Naan',
            description: 'Tandoor-baked bread with garlic butter',
            price: 60,
            category: 'Bread',
            image: 'https://images.unsplash.com/photo-1573237015185-5c35dbb5527c?w=200',
          },
          {
            name: 'Mango Lassi',
            description: 'Cool yogurt drink with fresh mango',
            price: 89,
            category: 'Beverages',
            image: 'https://images.unsplash.com/photo-1488900128323-21503983a07e?w=200',
          },
          {
            name: 'Gulab Jamun',
            description: 'Deep-fried milk dumplings in rose syrup',
            price: 79,
            category: 'Dessert',
            image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=200',
          },
        ],
      },
    },
  });

  const dosaDhaba = await prisma.restaurant.create({
    data: {
      name: 'Dosa Dhaba',
      cuisine: 'South Indian',
      image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=400',
      rating: 4.3,
      country: Country.INDIA,
      menuItems: {
        create: [
          {
            name: 'Masala Dosa',
            description: 'Crispy rice crepe with spiced potato filling',
            price: 120,
            category: 'Main Course',
            image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=200',
          },
          {
            name: 'Idli Sambar',
            description: 'Steamed rice cakes with lentil soup',
            price: 90,
            category: 'Breakfast',
            image: 'https://images.unsplash.com/photo-1589301761564-2f606e59e9c3?w=200',
          },
          {
            name: 'Uttapam',
            description: 'Thick rice pancake with vegetables',
            price: 110,
            category: 'Breakfast',
            image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=200',
          },
          {
            name: 'Filter Coffee',
            description: 'Strong South Indian coffee with milk',
            price: 45,
            category: 'Beverages',
            image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200',
          },
        ],
      },
    },
  });

  console.log('✅ India restaurants created');

  // --- AMERICA RESTAURANTS ---
  const burgerBarn = await prisma.restaurant.create({
    data: {
      name: 'Burger Barn',
      cuisine: 'American',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
      rating: 4.6,
      country: Country.AMERICA,
      menuItems: {
        create: [
          {
            name: 'Classic Smash Burger',
            description: 'Double smashed patties with American cheese',
            price: 14.99,
            category: 'Burgers',
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200',
          },
          {
            name: 'BBQ Bacon Burger',
            description: 'Crispy bacon, BBQ sauce, pickled jalapeños',
            price: 16.99,
            category: 'Burgers',
            image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=200',
          },
          {
            name: 'Truffle Fries',
            description: 'Hand-cut fries with truffle oil and parmesan',
            price: 7.99,
            category: 'Sides',
            image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=200',
          },
          {
            name: 'Chocolate Milkshake',
            description: 'Thick chocolate shake with whipped cream',
            price: 6.99,
            category: 'Beverages',
            image: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=200',
          },
          {
            name: 'Onion Rings',
            description: 'Beer-battered golden onion rings',
            price: 5.99,
            category: 'Sides',
            image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200',
          },
        ],
      },
    },
  });

  const pizzaRepublic = await prisma.restaurant.create({
    data: {
      name: 'Pizza Republic',
      cuisine: 'Italian-American',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
      rating: 4.8,
      country: Country.AMERICA,
      menuItems: {
        create: [
          {
            name: 'Pepperoni Pizza',
            description: '12-inch hand-tossed with mozzarella and pepperoni',
            price: 18.99,
            category: 'Pizza',
            image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200',
          },
          {
            name: 'Margherita Pizza',
            description: 'San Marzano tomatoes, fresh basil, buffalo mozzarella',
            price: 16.99,
            category: 'Pizza',
            image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200',
          },
          {
            name: 'Caesar Salad',
            description: 'Romaine, croutons, parmesan, classic dressing',
            price: 10.99,
            category: 'Salads',
            image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=200',
          },
          {
            name: 'Tiramisu',
            description: 'Classic Italian dessert with espresso and mascarpone',
            price: 8.99,
            category: 'Dessert',
            image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=200',
          },
          {
            name: 'Garlic Bread',
            description: 'Toasted bread with herb butter and garlic',
            price: 5.99,
            category: 'Sides',
            image: 'https://images.unsplash.com/photo-1573737785563-c93c5e4f7b6b?w=200',
          },
        ],
      },
    },
  });

  const tacoTown = await prisma.restaurant.create({
    data: {
      name: 'Taco Town',
      cuisine: 'Mexican-American',
      image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400',
      rating: 4.4,
      country: Country.AMERICA,
      menuItems: {
        create: [
          {
            name: 'Street Tacos (x3)',
            description: 'Corn tortillas with carne asada and salsa verde',
            price: 11.99,
            category: 'Tacos',
            image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=200',
          },
          {
            name: 'Chicken Burrito',
            description: 'Large flour tortilla with grilled chicken and rice',
            price: 13.99,
            category: 'Burritos',
            image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=200',
          },
          {
            name: 'Guacamole & Chips',
            description: 'Fresh-made guacamole with tortilla chips',
            price: 7.99,
            category: 'Appetizers',
            image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=200',
          },
          {
            name: 'Horchata',
            description: 'Sweet rice milk with cinnamon',
            price: 4.99,
            category: 'Beverages',
            image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=200',
          },
        ],
      },
    },
  });

  console.log('✅ America restaurants created');

  // --- SAMPLE ORDERS ---
  // Get menu items for orders
  const indiaMenuItems = await prisma.menuItem.findMany({
    where: { restaurant: { country: Country.INDIA } },
    take: 3,
  });

  const americaMenuItems = await prisma.menuItem.findMany({
    where: { restaurant: { country: Country.AMERICA } },
    take: 3,
  });

  // Confirmed order for Captain Marvel
  await prisma.order.create({
    data: {
      status: OrderStatus.CONFIRMED,
      totalAmount: 618,
      userId: captainMarvel.id,
      restaurantId: biryaniHouse.id,
      paymentMethodId: pm2.id,
      items: {
        create: [
          {
            quantity: 2,
            price: 299,
            menuItemId: indiaMenuItems[0].id,
          },
        ],
      },
    },
  });

  // Pending order for Thanos
  await prisma.order.create({
    data: {
      status: OrderStatus.PENDING,
      totalAmount: 539,
      userId: thanos.id,
      restaurantId: spiceGarden.id,
      items: {
        create: [
          {
            quantity: 1,
            price: 320,
            menuItemId: indiaMenuItems[1]?.id ?? indiaMenuItems[0].id,
          },
        ],
      },
    },
  });

  // Confirmed order for Travis
  await prisma.order.create({
    data: {
      status: OrderStatus.CONFIRMED,
      totalAmount: 38.97,
      userId: travis.id,
      restaurantId: burgerBarn.id,
      paymentMethodId: pm3.id,
      items: {
        create: [
          {
            quantity: 2,
            price: 14.99,
            menuItemId: americaMenuItems[0].id,
          },
        ],
      },
    },
  });

  console.log('✅ Sample orders created');
  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📋 Login credentials (all passwords: password123):');
  console.log('  Admin:   nickfury@slooze.com');
  console.log('  Manager: captainmarvel@slooze.com (India)');
  console.log('  Manager: captainamerica@slooze.com (America)');
  console.log('  Member:  thanos@slooze.com (India)');
  console.log('  Member:  thor@slooze.com (India)');
  console.log('  Member:  travis@slooze.com (America)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
