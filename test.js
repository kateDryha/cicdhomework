import { expect } from 'chai';
import sinon from 'sinon';
import supertest from 'supertest';

import { app } from './index.js';

//const { expect } = chai;
const request = supertest(app);

describe('POST /products', () => {
  it('should add a product successfully', (done) => {
    const reqBody = { name: 'Test Product', price: 20 };

    // Mock the database functions
    const dbMock = {
      run: sinon.stub().yields(null),
    };

    // Replace the actual database connection in your app with the mocked version
    const originalDb = app.get('db');
    app.set('db', dbMock);

    request
      .post('/products')
      .send(reqBody)
      .expect(201)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.body).to.have.property('message', 'Product added successfully.');
        expect(res.body).to.have.property('productId');
        
        // Restore the original database connection
        app.set('db', originalDb);

        done();
      });
  });

  it('should handle invalid data format', (done) => {
    const reqBody = { name: 'Test Product' };  // Missing price

    request
      .post('/products')
      .send(reqBody)
      .expect(400)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res.body).to.have.property('error', 'Invalid data format');

        done();
      });
  });
});
