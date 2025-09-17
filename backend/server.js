import express from 'express'
import cors from 'cors'
import multer from 'multer'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

// ES module compatibility
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:5173'],
  credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// User cookie consent routes
app.post('/api/users/accept', (req, res) => {
  try {
    const filePath = path.join(__dirname, 'data/userCount.json');
    let data = { count: 0 };

    if (fs.existsSync(filePath)) {
      data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }

    data.count += 1;

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    res.json({ success: true, count: data.count });
  } catch (error) {
    console.error('Error updating user count:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/users/count', (req, res) => {
  try {
    const filePath = path.join(__dirname, 'data/userCount.json');
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      res.json({ count: data.count });
    } else {
      res.json({ count: 0 });
    }
  } catch (error) {
    console.error('Error reading user count:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Static file serving for downloads
app.use('/downloads', express.static(path.join(__dirname, 'storage/downloads')))

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'storage/uploads')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed!'), false)
    }
  }
})

// Routes

// Get available models
app.get('/api/models', (req, res) => {
  try {
    const modelsPath = path.join(__dirname, 'data/models.json')
    const models = JSON.parse(fs.readFileSync(modelsPath, 'utf8'))
    res.json(models)
  } catch (error) {
    console.error('Error reading models:', error)
    res.status(500).json({ error: 'Failed to load models' })
  }
})

// Get available downloads
app.get('/api/downloads', (req, res) => {
  try {
    const downloadsPath = path.join(__dirname, 'data/downloads.json')
    const downloads = JSON.parse(fs.readFileSync(downloadsPath, 'utf8'))
    res.json(downloads)
  } catch (error) {
    console.error('Error reading downloads:', error)
    res.status(500).json({ error: 'Failed to load downloads' })
  }
})

// Download specific file
app.get('/api/downloads/:filename', (req, res) => {
  const filename = req.params.filename
  const filePath = path.join(__dirname, 'storage/downloads', filename)
  
  if (fs.existsSync(filePath)) {
    res.download(filePath)
  } else {
    res.status(404).json({ error: 'File not found' })
  }
})

// Predict endpoint - handles image analysis
app.post('/api/predict', upload.array('images', 10), async (req, res) => {
  try {
    const { metadata } = req.body
    const parsedMetadata = JSON.parse(metadata)
    const uploadedFiles = req.files

    console.log('Received prediction request:', {
      fileCount: uploadedFiles?.length || 0,
      metadata: parsedMetadata
    })

    // Demo mode - return sample results
    if (process.env.ENABLE_DEMO_MODE === 'true') {
      const sampleResults = generateSampleResults(parsedMetadata)
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      res.json(sampleResults)
    } else {
      // Production mode - integrate with actual AI models
      res.status(501).json({ 
        error: 'Production AI inference not implemented. Enable ENABLE_DEMO_MODE=true for demo results.' 
      })
    }
  } catch (error) {
    console.error('Prediction error:', error)
    res.status(500).json({ error: 'Failed to process images' })
  }
})

// Generate sample results for demo mode
function generateSampleResults(metadata) {
  const species = [
    { name: 'Diatom sp.', count: Math.floor(Math.random() * 50) + 10 },
    { name: 'Copepod nauplii', count: Math.floor(Math.random() * 30) + 5 },
    { name: 'Dinoflagellate sp.', count: Math.floor(Math.random() * 25) + 3 },
    { name: 'Ciliate sp.', count: Math.floor(Math.random() * 20) + 2 },
    { name: 'Rotifer sp.', count: Math.floor(Math.random() * 15) + 1 }
  ]

  const totalCount = species.reduce((sum, s) => sum + s.count, 0)
  const processingTime = `${(Math.random() * 2 + 0.5).toFixed(1)}s`
  const avgConfidence = `${(Math.random() * 0.2 + 0.8).toFixed(2)}`

  return {
    species,
    totalCount,
    processingTime,
    avgConfidence,
    metadata,
    csvDownload: `/api/downloads/sample-results-${Date.now()}.csv`,
    boundingBoxes: generateSampleBoundingBoxes(species),
    timestamp: new Date().toISOString()
  }
}

function generateSampleBoundingBoxes(species) {
  const boxes = []
  species.forEach(s => {
    for (let i = 0; i < s.count; i++) {
      boxes.push({
        species: s.name,
        x: Math.random() * 800,
        y: Math.random() * 600,
        width: Math.random() * 50 + 20,
        height: Math.random() * 50 + 20,
        confidence: Math.random() * 0.3 + 0.7
      })
    }
  })
  return boxes
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    demoMode: process.env.ENABLE_DEMO_MODE === 'true'
  })
})

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' })
    }
  }
  
  console.error('Server error:', error)
  res.status(500).json({ error: 'Internal server error' })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Marine Microscopy API Server running on port ${PORT}`)
  console.log(`📊 Demo mode: ${process.env.ENABLE_DEMO_MODE === 'true' ? 'ENABLED' : 'DISABLED'}`)
  console.log(`🌐 CORS origins: ${process.env.CORS_ORIGINS || 'http://localhost:5173'}`)
  
  // Create required directories
  const dirs = ['storage/uploads', 'storage/downloads', 'data']
  dirs.forEach(dir => {
    const fullPath = path.join(__dirname, dir)
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true })
      console.log(`📁 Created directory: ${dir}`)
    }
  })
})