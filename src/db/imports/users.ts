import { dbConnection } from '.';
import bcrypt from 'bcrypt';
import User from '../models/mongoose/user';

(async () => {
  await dbConnection();
  await addUser();
})();

async function addUser() {
  try {
    const users = [
      {
        firstName: 'Admin',
        lastName: 'Stroke',
        fullName: 'Admin Stroke',
        role: 'admin',
        email: 'admin@wayrabbit.com',
        password: await bcrypt.hash('admin', 10),
      },
      {
        firstName: 'Ravi',
        lastName: 'Modha',
        fullName: 'Ravi Modha',
        email: 'rm@gmail.com',
        city: 'Ahmedabad',
        state: 'Gujrat',
        country: 'India',
        zipcode: '854221',
        password: await bcrypt.hash('sample', 10),
      },
      {
        firstName: 'Bhavin',
        lastName: 'Bhuva',
        fullName: 'Bhavin Bhuva',
        email: 'bb@gmail.com',
        city: 'Ahmedabad',
        state: 'Gujrat',
        country: 'India',
        zipcode: '123456',
        password: await bcrypt.hash('sample', 10),
      },
      {
        firstName: 'Bhavik',
        lastName: 'Khorava',
        fullName: 'Bhavik Khorava',
        email: 'bk@gmail.com',
        city: 'Mathura',
        state: 'Uttar Pradesh',
        country: 'India',
        zipcode: '817158',
        password: await bcrypt.hash('sample', 10),
      },
    ];
    await User.insertMany(users);
  } catch (err) {
    if (err) throw err;
  }
}
