import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload, 
  Settings, 
  MapPin, 
  Calendar, 
  Microscope, 
  Sliders, 
  Eye, 
  Play,
  ArrowLeft,
  ArrowRight,
  Download,
  BarChart3
} from 'lucide-react'
import axios from 'axios'

const Lab = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    images: [],
    magnification: '',
    location: '',
    date: '',
    model: '',
    confidence: 0.5,
    nmsIou: 0.5
  })
  const [results, setResults] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const steps = [
    {
      id: 'upload',
      title: 'Upload Images',
      description: 'Select your microscopy images',
      icon: Upload
    },
    {
      id: 'magnification',
      title: 'Set Magnification',
      description: 'Choose the magnification level',
      icon: Settings
    },
    {
      id: 'metadata',
      title: 'Add Metadata',
      description: 'Location and date information',
      icon: MapPin
    },
    {
      id: 'model',
      title: 'Select Model',
      description: 'Choose AI model type',
      icon: Microscope
    },
    {
      id: 'thresholds',
      title: 'Set Thresholds',
      description: 'Configure detection parameters',
      icon: Sliders
    },
    {
      id: 'review',
      title: 'Review & Submit',
      description: 'Confirm your settings',
      icon: Eye
    }
  ]

  const magnificationOptions = ['10x', '20x', '40x', '100x', '400x', '1000x']
  const modelOptions = [
    { id: 'detector', name: 'Object Detector', description: 'Detect and locate organisms' },
    { id: 'classifier', name: 'Species Classifier', description: 'Classify organism species' },
    { id: 'counter', name: 'Population Counter', description: 'Count organism populations' }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    setFormData({ ...formData, images: files })
  }

  const handleSubmit = async () => {
    setIsProcessing(true)
    try {
      const formDataToSend = new FormData()
      formData.images.forEach(image => {
        formDataToSend.append('images', image)
      })
      formDataToSend.append('metadata', JSON.stringify({
        magnification: formData.magnification,
        location: formData.location,
        date: formData.date,
        model: formData.model,
        confidence: formData.confidence,
        nmsIou: formData.nmsIou
      }))

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/predict`,
        formDataToSend,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      
      setResults(response.data)
    } catch (error) {
      console.error('Error processing images:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'upload':
        return (
          <div className="space-y-6">
            <div className="border-2 border-dashed border-neon-cyan/50 rounded-xl p-8 text-center hover:border-neon-cyan transition-colors duration-300">
              <Upload className="h-16 w-16 text-neon-cyan mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Upload Microscopy Images</h3>
              <p className="text-gray-300 mb-4">Select one or more high-resolution microscopy images</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="inline-flex items-center px-6 py-3 bg-neon-cyan text-gray-900 font-semibold rounded-lg hover:bg-neon-cyan/90 transition-colors duration-300 cursor-pointer"
              >
                Choose Files
              </label>
            </div>
            {formData.images.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-white font-medium">Selected Files:</h4>
                {formData.images.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                    <span className="text-gray-300">{file.name}</span>
                    <span className="text-neon-cyan text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      case 'magnification':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Settings className="h-16 w-16 text-neon-cyan mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Select Magnification</h3>
              <p className="text-gray-300">Choose the magnification level used for imaging</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {magnificationOptions.map((mag) => (
                <button
                  key={mag}
                  onClick={() => setFormData({ ...formData, magnification: mag })}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    formData.magnification === mag
                      ? 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan'
                      : 'border-gray-600 text-gray-300 hover:border-neon-cyan/50'
                  }`}
                >
                  {mag}
                </button>
              ))}
            </div>
          </div>
        )

      case 'metadata':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <MapPin className="h-16 w-16 text-neon-cyan mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Sample Metadata</h3>
              <p className="text-gray-300">Provide location and date information</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Pacific Ocean, Coral Reef"
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-neon-cyan focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Collection Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-neon-cyan focus:outline-none"
                />
              </div>
            </div>
          </div>
        )

      case 'model':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Microscope className="h-16 w-16 text-neon-cyan mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Choose AI Model</h3>
              <p className="text-gray-300">Select the type of analysis to perform</p>
            </div>
            <div className="space-y-4">
              {modelOptions.map((model) => (
                <button
                  key={model.id}
                  onClick={() => setFormData({ ...formData, model: model.id })}
                  className={`w-full p-6 rounded-xl border-2 text-left transition-all duration-300 ${
                    formData.model === model.id
                      ? 'border-neon-cyan bg-neon-cyan/10'
                      : 'border-gray-600 hover:border-neon-cyan/50'
                  }`}
                >
                  <h4 className={`font-semibold mb-2 ${
                    formData.model === model.id ? 'text-neon-cyan' : 'text-white'
                  }`}>
                    {model.name}
                  </h4>
                  <p className="text-gray-300 text-sm">{model.description}</p>
                </button>
              ))}
            </div>
          </div>
        )

      case 'thresholds':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Sliders className="h-16 w-16 text-neon-cyan mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Detection Thresholds</h3>
              <p className="text-gray-300">Fine-tune detection parameters</p>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-2">
                  Confidence Threshold: {formData.confidence.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={formData.confidence}
                  onChange={(e) => setFormData({ ...formData, confidence: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-gray-400 mt-1">
                  <span>Low (0.0)</span>
                  <span>High (1.0)</span>
                </div>
              </div>
              <div>
                <label className="block text-white font-medium mb-2">
                  NMS IoU Threshold: {formData.nmsIou.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={formData.nmsIou}
                  onChange={(e) => setFormData({ ...formData, nmsIou: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-gray-400 mt-1">
                  <span>Strict (0.0)</span>
                  <span>Loose (1.0)</span>
                </div>
              </div>
            </div>
          </div>
        )

      case 'review':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Eye className="h-16 w-16 text-neon-cyan mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Review Settings</h3>
              <p className="text-gray-300">Confirm your configuration before processing</p>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="text-white font-medium mb-2">Images</h4>
                <p className="text-gray-300">{formData.images.length} files selected</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="text-white font-medium mb-2">Magnification</h4>
                <p className="text-gray-300">{formData.magnification || 'Not selected'}</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="text-white font-medium mb-2">Location</h4>
                <p className="text-gray-300">{formData.location || 'Not specified'}</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="text-white font-medium mb-2">Model</h4>
                <p className="text-gray-300">
                  {modelOptions.find(m => m.id === formData.model)?.name || 'Not selected'}
                </p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="text-white font-medium mb-2">Thresholds</h4>
                <p className="text-gray-300">
                  Confidence: {formData.confidence.toFixed(2)}, NMS IoU: {formData.nmsIou.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (results) {
    return (
      <div className="lab-gradient min-h-screen pt-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <BarChart3 className="h-16 w-16 text-neon-cyan mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-white mb-4">Analysis Results</h1>
            <p className="text-gray-300">Your microscopy analysis is complete</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="neon-border rounded-xl p-6">
              <h3 className="text-xl font-semibold text-neon-cyan mb-4">Species Detected</h3>
              <div className="space-y-3">
                {results.species.map((species, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-white">{species.name}</span>
                    <span className="text-neon-cyan font-bold">{species.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="neon-border rounded-xl p-6">
              <h3 className="text-xl font-semibold text-neon-cyan mb-4">Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Total Organisms:</span>
                  <span className="text-white font-bold">{results.totalCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Processing Time:</span>
                  <span className="text-white font-bold">{results.processingTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Confidence:</span>
                  <span className="text-white font-bold">{results.avgConfidence}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center space-y-4">
            <a
              href={results.csvDownload}
              className="inline-flex items-center px-6 py-3 bg-neon-cyan text-gray-900 font-semibold rounded-lg hover:bg-neon-cyan/90 transition-colors duration-300 mr-4"
            >
              <Download className="h-5 w-5 mr-2" />
              Download CSV Report
            </a>
            <button
              onClick={() => {
                setResults(null)
                setCurrentStep(0)
                setFormData({
                  images: [],
                  magnification: '',
                  location: '',
                  date: '',
                  model: '',
                  confidence: 0.5,
                  nmsIou: 0.5
                })
              }}
              className="inline-flex items-center px-6 py-3 border border-neon-cyan text-neon-cyan font-semibold rounded-lg hover:bg-neon-cyan/10 transition-colors duration-300"
            >
              Run New Analysis
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="lab-gradient min-h-screen pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">AI Analysis Lab</h1>
          <p className="text-gray-300">Configure and run your microscopy analysis</p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    index <= currentStep
                      ? 'border-neon-cyan bg-neon-cyan text-gray-900'
                      : 'border-gray-600 text-gray-400'
                  }`}
                >
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 ${
                      index < currentStep ? 'bg-neon-cyan' : 'bg-gray-600'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-white mb-2">
              {steps[currentStep].title}
            </h2>
            <p className="text-gray-300">{steps[currentStep].description}</p>
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="neon-border rounded-xl p-8 mb-8"
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              currentStep === 0
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Previous
          </button>

          {currentStep === steps.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={isProcessing || formData.images.length === 0}
              className="flex items-center px-8 py-3 bg-neon-cyan text-gray-900 font-semibold rounded-lg hover:bg-neon-cyan/90 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed animate-glow"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 mr-2" />
                  Run Analysis
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center px-6 py-3 bg-neon-cyan text-gray-900 font-semibold rounded-lg hover:bg-neon-cyan/90 transition-colors duration-300"
            >
              Next
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Lab