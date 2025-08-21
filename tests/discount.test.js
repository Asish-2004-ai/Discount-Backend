const request = require('supertest');
const app = require('../src/index');

describe('Discount Rule Engine API', () => {
  test('Rule 1 priority: NEW customer gets 10% even if Wednesday and > 10,000', async () => {
    const res = await request(app)
      .post('/api/discount')
      .send({
        customerType: 'NEW',
        items: [
          { productId: 'P1', category: 'A', price: 6000 },
          { productId: 'P2', category: 'B', price: 5000 }
        ],
        orderTotal: 0, 
        dayOfWeek: 'WEDNESDAY'
      })
      .expect(200);

    expect(res.body.result.appliedRule).toBe('NEW_CUSTOMER_10_PERCENT');
    expect(res.body.result.discount).toBe(1100); 
    expect(res.body.result.payable).toBe(9900);
  });

  test('Rule 2: Orders above 10,000 get flat 500 off (non-Wednesday, non-NEW)', async () => {
    const res = await request(app)
      .post('/api/discount')
      .send({
        customerType: 'REGULAR',
        items: [
          { productId: 'P3', category: 'C', price: 4000 },
          { productId: 'P4', category: 'D', price: 7001 }
        ],
        orderTotal: 0,
        dayOfWeek: 'MONDAY'
      })
      .expect(200);

    expect(res.body.result.appliedRule).toBe('BIG_ORDER_FLAT_500');
    expect(res.body.result.discount).toBe(500);
    expect(res.body.result.payable).toBe(10501); 
  });

  test('Rule 3: Wednesday 5% off (when others not applicable)', async () => {
    const res = await request(app)
      .post('/api/discount')
      .send({
        customerType: 'PREMIUM',
        items: [
          { productId: 'P5', category: 'E', price: 2000 },
          { productId: 'P6', category: 'F', price: 3000 }
        ],
        orderTotal: 0,
        dayOfWeek: 'WEDNESDAY'
      })
      .expect(200);

    expect(res.body.result.appliedRule).toBe('WEDNESDAY_5_PERCENT');
    expect(res.body.result.discount).toBe(250); 
    expect(res.body.result.payable).toBe(4750);
  });

  test('No rule applicable -> discount 0', async () => {
    const res = await request(app)
      .post('/api/discount')
      .send({
        customerType: 'REGULAR',
        items: [{ productId: 'P7', category: 'G', price: 9999 }],
        orderTotal: 0,
        dayOfWeek: 'SUNDAY'
      })
      .expect(200);

    expect(res.body.result.appliedRule).toBeNull();
    expect(res.body.result.discount).toBe(0);
    expect(res.body.result.payable).toBe(9999);
  });

  test('Validation error on bad enum', async () => {
    const res = await request(app)
      .post('/api/discount')
      .send({
        customerType: 'GOLD',
        items: [{ productId: 'X', category: 'A', price: 100 }],
        orderTotal: 100,
        dayOfWeek: 'FRIYAY'
      })
      .expect(400);

    expect(res.body.error).toBe('ValidationError');
  });
});
