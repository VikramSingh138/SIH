import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Play, Download, BarChart3, ImageIcon, RefreshCw } from 'lucide-react'
import axios from 'axios'

const Lab = () => {
  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [results, setResults] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      setResults(null)
      setError(null)
    }
  }

  const runAnalysis = async () => {
    if (!imageFile) return
    setIsProcessing(true)
    setError(null)
    try {
      const fd = new FormData()
      fd.append('image', imageFile)
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/analyze`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setResults(response.data)
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.error || 'Analysis failed')
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

  const renderResults = () => {
    if (!results) return null
    const top = results.top || []
    return (
      <div className="mt-12">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-10">
          <BarChart3 className="h-16 w-16 text-neon-cyan mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">Analysis Results</h2>
          <p className="text-gray-300">Model inference completed in {results.timing}s</p>
        </motion.div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="neon-border rounded-xl p-6 col-span-2">
            <h3 className="text-xl font-semibold text-neon-cyan mb-4">Top Classes</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {top.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between bg-gray-800/40 rounded-lg px-4 py-3 hover:bg-gray-800/70 transition-colors duration-300">
                  <div className="flex items-center space-x-3">
                    <span className="text-neon-cyan font-bold w-6 text-center">{idx + 1}</span>
                    <span className="text-white font-medium">{item.class}</span>
                  </div>
                  <span className="text-neon-cyan font-semibold">{item.value.toFixed ? item.value.toFixed(2) : item.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="neon-border rounded-xl p-6">
            <h3 className="text-xl font-semibold text-neon-cyan mb-4">Summary</h3>
            <div className="space-y-4">
              <div className="bg-gray-800/40 rounded-lg p-4">
                <p className="text-gray-300 text-sm mb-1">ROI Count</p>
                <p className="text-white text-2xl font-bold">{results.roi_count}</p>
              </div>
              <div className="bg-gray-800/40 rounded-lg p-4">
                <p className="text-gray-300 text-sm mb-1">Classes Returned</p>
                <p className="text-white text-2xl font-bold">{top.length}</p>
              </div>
              <div className="bg-gray-800/40 rounded-lg p-4">
                <p className="text-gray-300 text-sm mb-1">Success</p>
                <p className="text-neon-cyan text-2xl font-bold">{results.success ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>
        </div>
        {results.processed_image_base64 && (
          <div className="neon-border rounded-xl p-6 mt-10">
            <h3 className="text-xl font-semibold text-neon-cyan mb-4">Processed Image</h3>
            <img src={`data:image/png;base64,${results.processed_image_base64}`} alt="Processed" className="w-full rounded-lg border border-gray-700" />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="lab-gradient min-h-screen pt-20 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">AI Analysis Lab</h1>
          <p className="text-gray-300">Upload a microscopy image to run phytoplankton analysis</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="neon-border rounded-xl p-8 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-neon-cyan/10 rounded-full blur-3xl" />
            <div className="relative">
              <h2 className="text-xl font-semibold text-neon-cyan mb-6 flex items-center"><Upload className="h-6 w-6 mr-2" /> Image Input</h2>
              <div className="border-2 border-dashed border-neon-cyan/40 rounded-xl p-8 text-center hover:border-neon-cyan/70 transition-colors duration-300">
                {previewUrl ? (
                  <div className="space-y-4">
                    <img src={previewUrl} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-lg border border-gray-700" />
                    <button onClick={() => { setImageFile(null); setPreviewUrl(null); setResults(null); }} className="text-sm text-neon-cyan hover:underline flex items-center justify-center mx-auto">
                      <RefreshCw className="h-4 w-4 mr-1" /> Choose Another Image
                    </button>
                  </div>
                ) : (
                  <>
                    <ImageIcon className="h-16 w-16 text-neon-cyan mx-auto mb-4" />
                    <p className="text-gray-300 mb-4">Select a high-resolution microscopy image (JPG/PNG)</p>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="image-input" />
                    <label htmlFor="image-input" className="inline-flex items-center px-6 py-3 bg-neon-cyan text-gray-900 font-semibold rounded-lg hover:bg-neon-cyan/90 transition-colors duration-300 cursor-pointer">Choose Image</label>
                  </>
                )}
              </div>
              <div className="mt-8 text-center">
                <button onClick={runAnalysis} disabled={!imageFile || isProcessing} className="flex items-center justify-center w-full px-8 py-4 bg-neon-cyan text-gray-900 font-semibold rounded-lg hover:bg-neon-cyan/90 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed animate-glow">
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mr-3" /> Processing...
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5 mr-2" /> Run Analysis
                    </>
                  )}
                </button>
                {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
              </div>
            </div>
          </div>
          <div>
            {renderResults() || (
              <div className="neon-border rounded-xl p-8 h-full flex flex-col items-center justify-center text-center text-gray-400">
                <BarChart3 className="h-20 w-20 text-gray-600 mb-6" />
                <p className="text-lg">Results will appear here after running analysis.</p>
              </div>
            )}
          </div>
        </div>

        {results && (
          <div className="text-center mt-12">
            <button onClick={() => { setResults(null); setImageFile(null); setPreviewUrl(null); }} className="inline-flex items-center px-6 py-3 border border-neon-cyan text-neon-cyan font-semibold rounded-lg hover:bg-neon-cyan/10 transition-colors duration-300">
              <RefreshCw className="h-5 w-5 mr-2" /> New Analysis
            </button>
            {results.success && (
              <a href="#" className="inline-flex items-center px-6 py-3 bg-neon-cyan text-gray-900 font-semibold rounded-lg hover:bg-neon-cyan/90 transition-colors duration-300 ml-4">
                <Download className="h-5 w-5 mr-2" /> Export JSON
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Lab