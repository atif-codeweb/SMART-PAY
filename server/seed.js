require('dotenv').config();
const mongoose=require('mongoose');
const User=require('./models/User');
const Transaction=require('./models/Transaction');
const Offer=require('./models/Offer');

const connectDB=async()=>{
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
};
const seedDatabase=async()=>{
    try{
        await connectDB();

        await User.deleteMany();
        await Transaction.deleteMany();
        await Offer.deleteMany();


        const adminUser=await User.create({
            name:'Admin user',
            email:'admin@smartpay.com',
            phone:'03109830515',
            password:'admin123',
            role:'admin',
            balance:50000,
            isVerified:true,
            isKYCVerified:true
        });
        const user1=await User.create({
            name:'atif amin',
            email:'atif@example.com',
            phone:'03109830516',
            password:'atif123',
            balance:5000,
            isVerified:true,
            isKYCVerified:true
        });

        const user2=await User.create({
            name:'talha asif',
            email:'talha@example.com',
            phone:'03109830517',
            password:'talha123',
            balance:2000,
            isVerified:true,
            
        });
        const user3=await User.create({
            name:'rafay zafar',
            email:'rafay@example.com',
            phone:'03109830518',
            password:'rafay123',      
            balance:8000,
            
        });
        console.log('User created');

        const transactions = [
      {
        sender: user1._id,
        receiver: user2._id,
        receiverPhone: user2.phone,
        amount: 500,
        type: 'send',
        status: 'completed',
        description: 'Dinner split'
      },
      {
        sender: user2._id,
        receiver: user1._id,
        receiverPhone: user1.phone,
        amount: 1000,
        type: 'send',
        status: 'completed',
        description: 'Birthday gift'
      },
      {
        sender: user1._id,
        amount: 1200,
        type: 'bill_payment',
        category: 'electricity',
        status: 'completed',
        description: 'K-Electric bill'
      },
      {
        sender: user1._id,
        amount: 500,
        type: 'bill_payment',
        category: 'mobile',
        status: 'completed',
        description: 'Jazz recharge'
      },
      {
        sender: user3._id,
        receiver: user1._id,
        receiverPhone: user1.phone,
        amount: 2500,
        type: 'send',
        status: 'completed',
        description: 'Rent payment'
      }
    ];
    await Transaction.insertMany(transactions);
    console.log('Transactions created');

    const offers = [
      {
        title: '10% Cashback on Bill Payments',
        description: 'Get 10% cashback on all utility bill payments',
        cashback: 10,
        category: 'bill_payment',
        validFrom: new Date(),
        validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true
      },
      {
        title: 'Free Transfer on First Transaction',
        description: 'Send money for free on your first transaction',
        discount: 100,
        category: 'transfer',
        validFrom: new Date(),
        validTo: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        isActive: true
      },
      {
        title: '5% Cashback on Mobile Recharge',
        description: 'Recharge any mobile network and get 5% back',
        cashback: 5,
        category: 'recharge',
        validFrom: new Date(),
        validTo: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        isActive: true
      }
    ];
    await Offer.insertMany(offers);
    console.log('offers created');
    
    console.log('\n database seeded successfully')
    console.log('\n Login credentials');
    console.log('Admin:admin@smartpay.com / admin123');
    console.log('User 1: atif@example.com / atif123');
    console.log('User 2: talha@example.com / talha123');
    console.log('User 3: rafay@example.com / rafay123');

    process.exit(0)

    }catch(error){
        console.error('error seeding database: ',error);
        process.exit(1)
    }
}
seedDatabase();