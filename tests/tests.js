import request from 'supertest';
import { expect } from 'chai';
import app from '../src/server.js'; // Adjust path if needed
import { validateInput } from '../src/utils/functions.js'; // Add your validator path

// ---------------------
// Integration Tests
// ---------------------
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

// ---------------------
// Unit Tests for validateInput
// ---------------------
describe('Unit Tests for validateInput()', () => {

  it('should return valid for clean input', () => {
    const result = validateInput('hello world');
    expect(result).to.deep.equal({ valid: true });
  });

  it('should detect XSS (script tag)', () => {
    const result = validateInput('<script>alert(1)</script>');
    expect(result).to.deep.equal({ valid: false, reason: 'xss' });
  });

  it('should detect SQL injection (tautology)', () => {
    const result = validateInput("' OR '1'='1");
    expect(result).to.deep.equal({ valid: false, reason: 'sql' });
  });

  it('should detect SQL injection (DROP statement)', () => {
    const result = validateInput('DROP TABLE users');
    expect(result).to.deep.equal({ valid: false, reason: 'sql' });
  });

  it('should reject non-string input (null)', () => {
    const result = validateInput(null);
    expect(result).to.deep.equal({ valid: false });
  });

});
