const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Product = require('../models/Product');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

describe('Product API', () => {
  let token;

  beforeAll(async () => {
    // Connect to test db (assumes MONGO_URI is set by CI/ENV)
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/test_db');

    // Create a mock admin and token for protected routes
    const admin = await Admin.create({
      username: 'testadmin',
      passwordHash: 'hashed_password', // bypass pre-save hook for raw speed, or just use normal create if hook allows
    });

    token = jwt.sign(
      { username: admin.username, role: 'admin' },
      process.env.JWT_SECRET || 'test_secret',
      { expiresIn: '15m' }
    );
  });

  afterAll(async () => {
    await Product.deleteMany({});
    await Admin.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Product.deleteMany({});
  });

  it('should fetch empty products initially', async () => {
    const res = await request(app).get('/api/v1/products');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBeTruthy();
    expect(res.body.data).toEqual([]);
  });

  it('should create a new product (admin)', async () => {
    const res = await request(app)
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Clean Room',
        price: '1000',
        category: 'Clean Room',
        desc: 'A test product'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBeTruthy();
    expect(res.body.data.title).toEqual('Test Clean Room');
  });

  it('should not allow creating product without token', async () => {
    const res = await request(app)
      .post('/api/v1/products')
      .send({
        title: 'Unauthorized',
        price: '1000',
        category: 'Clean Room',
        desc: 'Should fail'
      });

    expect(res.statusCode).toEqual(401);
    expect(res.body.success).toBeFalsy();
  });
});
