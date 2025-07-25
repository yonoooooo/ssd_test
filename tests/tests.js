import request from 'supertest';
import { expect } from 'chai';
import app from '../src/server.js'; // adjust if your structure is different

describe('Integration Tests for /index_submit', () => {

  it('should render result page for valid input', async () => {
    const res = await request(app)
      .post('/index_submit')
      .send('search=hello world');

    expect(res.status).to.equal(200);
    expect(res.text).to.include('Search Result');
    expect(res.text).to.include('hello world');
  });

  it('should redirect to home for XSS input', async () => {
    const res = await request(app)
      .post('/index_submit')
      .send('search=<script>alert(1)</script>');

    expect(res.status).to.equal(302);
    expect(res.headers.location).to.equal('/');
  });

  it('should redirect to home for SQL injection input', async () => {
    const res = await request(app)
      .post('/index_submit')
      .send('search=1 OR 1=1; DROP TABLE users');

    expect(res.status).to.equal(302);
    expect(res.headers.location).to.equal('/');
  });

  it('should redirect to home for empty input', async () => {
    const res = await request(app)
      .post('/index_submit')
      .send('search=');

    expect(res.status).to.equal(302);
    expect(res.headers.location).to.equal('/');
  });

});
