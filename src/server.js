// === TOOLS ===
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import escapeHtml from 'escape-html'; // for safely rendering user input

// Required for __dirname equivalent in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();



// === MIDDLEWARE ===
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// === IMPORT VALIDATION FUNCTION ===
import { validateInput } from './utils/functions.js';


// === SECURITY ===
app.disable('x-powered-by');


// ======== ROUTES ========

// GET Home page
app.get('/', (req, res) => {
  res.send(`
    <h1>Enter Search Term</h1>
    <form method="POST" action="/index_submit">
      <label>Search</label><br/>
      <input type="text" name="search" required /><br/><br/>
      <button type="submit">Submit </button>
    </form>
  `);
});

// POST route for form submission
app.post('/index_submit', (req, res) => {
  const { search } = req.body;

  const result = validateInput(search);

  if (!result.valid) {
    // Redirect to homepage if malicious input (XSS or SQLi)
    return res.redirect('/');
  }

  // Escape to safely render in HTML
  const safeSearch = escapeHtml(search);

  // Show new page with safe search term and a button to return home
  res.send(`
    <h1>Search Result</h1>
    <p>You searched for: <strong>${safeSearch}</strong></p>
    <form action="/" method="get">
      <button type="submit">Return to Home</button>
    </form>
  `);
});


// Logout route
app.get('/logout', (req, res) => {
  res.redirect('/');
});

// === SERVER ===
const PORT = 80;

// Only start the server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Listening on 0.0.0.0:${PORT}`);
  });
}

export default app;
