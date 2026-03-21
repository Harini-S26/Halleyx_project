const express   = require('express');
const cors      = require('cors');
const dotenv    = require('dotenv');
const path      = require('path');
const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

/*  Middleware*/
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded profile photos at /uploads/<filename>
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* API Routes*/
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/orders',    require('./routes/orders'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/widgets',   require('./routes/widgets'));
app.use('/api/templates', require('./routes/templates'));
app.use('/api/profile',   require('./routes/profile'));

/*Health check */
app.get('/', (req, res) => res.json({ message: 'Halleyx API Running ✓' }));

/*  Start server */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅  Halleyx server running on port ${PORT}`)
);
