import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  ArrowRight, 
  Download, 
  Zap, 
  Target, 
  Clock,
  Users,
  Github,
  ExternalLink,
  Fish,
  Waves
} from 'lucide-react'
import axios from 'axios'

const Showcase = () => {
  const [models, setModels] = useState([])
  const [downloads, setDownloads] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [modelsRes, downloadsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/models`),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/downloads`)
        ])
        // Normalize responses: backend should return arrays, but guard against
        // unexpected shapes (object envelope, single object, etc.) to avoid
        // runtime errors like "models.map is not a function".
        const normalizeArray = (payload) => {
          if (Array.isArray(payload)) return payload
          if (!payload) return []
          // Common envelope shapes: { models: [...] } or { data: [...] }
          if (Array.isArray(payload.models)) return payload.models
          if (Array.isArray(payload.data)) return payload.data
          if (Array.isArray(payload.results)) return payload.results
          // If payload is an object whose values are arrays, flatten them.
          const values = Object.values(payload).filter(Boolean)
          const arrays = values.filter(v => Array.isArray(v))
          if (arrays.length === 1) return arrays[0]
          if (arrays.length > 1) return arrays.flat()
          // Fallback: not an array -> return empty
          return []
        }
        
        setModels(normalizeArray(modelsRes.data))
        setDownloads(normalizeArray(downloadsRes.data))
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  const teamMembers = [
    { name: 'Deep', role: 'AI/ML Engineer' },
    { name: 'Bodhini', role: 'Computer Vision' },
    { name: 'Swapna', role: 'Data Scientist' },
    { name: 'Aishwarya', role: 'Backend Developer' },
    { name: 'Vikram', role: 'Frontend Developer' },
    { name: 'Harshini', role: 'Research Lead' }
  ]

  const pipelineStages = [
    { name: 'Image Capture', description: 'High-resolution microscopy imaging' },
    { name: 'Preprocessing', description: 'Noise reduction and enhancement' },
    { name: 'AI Detection', description: 'Species identification and counting' },
    { name: 'Analysis', description: 'Statistical analysis and reporting' }
  ]

  const impactMetrics = [
    { label: 'Accuracy', value: '94.7%', icon: Target },
    { label: 'Latency', value: '0.3s', icon: Clock },
    { label: 'Power Usage', value: '2.1W', icon: Zap }
  ]

  return (
    <div className="ocean-gradient min-h-screen">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Discover Marine Life
              <span className="block text-ocean-200">with AI Precision</span>
            </h1>
            <p className="text-xl md:text-2xl text-ocean-100 mb-8 max-w-3xl mx-auto">
              Revolutionary embedded AI system for real-time identification and analysis 
              of marine organisms through intelligent microscopy
            </p>
            <Link
              to="/run"
              className="inline-flex items-center px-8 py-4 bg-white text-ocean-600 font-semibold rounded-full hover:bg-ocean-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Run Model <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative"
          >
            <div className="w-64 h-64 mx-auto bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm animate-float">
              <Fish className="h-32 w-32 text-white" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse-slow rounded-full"></div>
          </motion.div>
        </div>
      </section>

      {/* Models Section */}
      <section className="py-16 px-4 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-white text-center mb-12"
          >
            AI Models
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {models.map((model, index) => (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-effect rounded-xl p-6 hover:bg-white/20 transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-white mb-3">{model.name}</h3>
                <p className="text-ocean-100 mb-4">{model.description}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-ocean-200">Accuracy:</span>
                    <span className="text-white font-medium">{model.metrics.accuracy}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-ocean-200">Speed:</span>
                    <span className="text-white font-medium">{model.metrics.speed}</span>
                  </div>
                </div>
                <button className="w-full bg-ocean-500 hover:bg-ocean-400 text-white py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pipeline Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-white text-center mb-12"
          >
            Processing Pipeline
          </motion.h2>
          <div className="grid md:grid-cols-4 gap-8">
            {pipelineStages.map((stage, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">{index + 1}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{stage.name}</h3>
                <p className="text-ocean-100 text-sm">{stage.description}</p>
                {index < pipelineStages.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-8 h-0.5 bg-white/30 transform -translate-y-1/2"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Metrics */}
      <section className="py-16 px-4 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-white text-center mb-12"
          >
            Performance Metrics
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {impactMetrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center glass-effect rounded-xl p-8"
              >
                <metric.icon className="h-12 w-12 text-white mx-auto mb-4" />
                <div className="text-4xl font-bold text-white mb-2">{metric.value}</div>
                <div className="text-ocean-200">{metric.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-white text-center mb-12"
          >
            Our Team
          </motion.h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center glass-effect rounded-xl p-6"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-ocean-400 to-ocean-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-1">{member.name}</h3>
                <p className="text-ocean-200 text-sm">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Downloads Section */}
      <section className="py-16 px-4 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-white text-center mb-12"
          >
            Downloads
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {downloads.map((file, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-effect rounded-xl p-6 hover:bg-white/20 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white">{file.name}</h3>
                  <ExternalLink className="h-5 w-5 text-ocean-200" />
                </div>
                <p className="text-ocean-100 text-sm mb-4">{file.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-ocean-200 text-sm">{file.size}</span>
                  <a
                    href={`${import.meta.env.VITE_BACKEND_URL}/api/downloads/${file.filename}`}
                    className="bg-ocean-500 hover:bg-ocean-400 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-300 flex items-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Waves className="h-6 w-6 text-white" />
            <span className="text-white font-semibold">Marine AI Microscopy</span>
          </div>
          <p className="text-ocean-200 text-sm">
            Advancing marine biology research through intelligent microscopy systems
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Showcase