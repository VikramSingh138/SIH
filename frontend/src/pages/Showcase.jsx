import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Linkedin,
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

function TeamMemberCard({ member }) {
  const [imgError, setImgError] = React.useState(false);

  return (
    <div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center mb-6 shadow-lg bg-gradient-to-br from-ocean-400 to-ocean-600">
      {member.image && !imgError ? (
        <img
          src={member.image}
          alt={member.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <Users className="h-12 w-12 text-white" />
      )} 
    </div>
  );
}

const Showcase = () => {
  // Map model names to local images
  const localImages = {
    'ResNet-50': '/images/resnet-img.png',
    'YOLOv8': '/images/yolov8-img.png',
    'BERT': '/images/bert-img.jpeg',
    'Hardware Integration': '/images/hardware-img.png',
  };

  // Track image error for fallback
  const [imgError, setImgError] = useState({});
  const [models, setModels] = useState([])
  const [downloads, setDownloads] = useState([])
  const [currentCard, setCurrentCard] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalCard, setModalCard] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [modelsRes, downloadsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/models`),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/downloads`)
        ])
        const normalizeArray = (payload) => {
          if (Array.isArray(payload)) return payload
          if (!payload) return []
          if (Array.isArray(payload.models)) return payload.models
          if (Array.isArray(payload.data)) return payload.data
          if (Array.isArray(payload.results)) return payload.results
          const values = Object.values(payload).filter(Boolean)
          const arrays = values.filter(v => Array.isArray(v))
          if (arrays.length === 1) return arrays[0]
          if (arrays.length > 1) return arrays.flat()
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

  // Carousel auto-scroll effect
  const approachCards = [
    ...(
      models.length > 0 ? models : [
        {
          id: 1,
          name: "ResNet-50",
          description: "Deep residual network for image classification tasks.",
          image: "https://res.cloudinary.com/dzgx1hfe6/image/upload/v1757842934/resnet-img_t1mwbo.png",
          metrics: { accuracy: "92%", speed: "Fast" },
        },
        {
          id: 2,
          name: "YOLOv8",
          description: "Real-time object detection model optimized for speed and accuracy.",
          image: "https://res.cloudinary.com/dzgx1hfe6/image/upload/v1757842933/yolov8-img_ddsco0.png",
          metrics: { accuracy: "89%", speed: "Very Fast" },
        },
        {
          id: 3,
          name: "BERT",
          description: "Transformer-based NLP model for text understanding and embeddings.",
          image: "https://res.cloudinary.com/dzgx1hfe6/image/upload/v1757842933/bert-img_capjea.jpg",
          metrics: { accuracy: "91%", speed: "Moderate" },
        },
      ]
    ),
    {
      id: 4,
      name: "Hardware Integration",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Hardware integration enables seamless connection between AI models and embedded marine microscopy systems for real-time analysis.",
      image: "https://res.cloudinary.com/dzgx1hfe6/image/upload/v1757842934/hardware-img_cloudinary.png",
      metrics: { accuracy: "N/A", speed: "Real-Time" },
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCard((prev) => (prev + 1) % approachCards.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [approachCards.length]);

  const handleCardClick = (card) => {
    setModalCard(card);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalCard(null);
  };

  const teamMembers = [
    { 
      name: 'Deep', role: 'AI/ML Engineer',
      image: 'https://res.cloudinary.com/dzgx1hfe6/image/upload/v1757840536/deep-sih_jkbnxk.jpg',
      linkedin: 'https://www.linkedin.com/in/deep-profile',
      github: 'https://github.com/deep-profile'
    },
    { 
      name: 'Bodhini', role: 'Computer Vision',
      image: 'https://res.cloudinary.com/dzgx1hfe6/image/upload/v1757840536/bodhini-sih_l9a57c.jpg',
      linkedin: 'https://www.linkedin.com/in/bodhini-profile',
      github: 'https://github.com/bodhini-profile'
    },
    { 
      name: 'Swapna', role: 'Data Scientist',
      image: 'https://res.cloudinary.com/dzgx1hfe6/image/upload/v1757842334/swapna-sih_y7scyf.jpg',
      linkedin: 'https://www.linkedin.com/in/swapna-profile',
      github: 'https://github.com/swapna-profile'
    },
    { 
      name: 'Harsh', role: 'Backend Developer',
      image: 'https://res.cloudinary.com/dzgx1hfe6/image/upload/v1757841049/harsh-sih_neek4o.jpg',
      linkedin: 'https://www.linkedin.com/in/harsh-profile',
      github: 'https://github.com/harsh-profile'
    },
    { 
      name: 'Vikram', role: 'Frontend Developer',
      image: 'https://res.cloudinary.com/dzgx1hfe6/image/upload/v1757840974/vikram-sih_wdf9jf.jpg',
      linkedin: 'https://www.linkedin.com/in/vikram-profile',
      github: 'https://github.com/vikram-profile'
    },
    { 
      name: 'Harshini', role: 'Research Lead',
      image: 'https://res.cloudinary.com/dzgx1hfe6/image/upload/v1757954052/harshini-sih_zrlqjh.jpg',
      linkedin: 'https://www.linkedin.com/in/harshini-profile',
      github: 'https://github.com/harshini-profile'
    }
  ]

  const pipelineStages = [
    { name: 'Image Capture', description: 'Using advanced high-resolution microscopy techniques, raw marine samples are captured in fine detail.' },
    { name: 'Preprocessing', description: 'Captured images are enhanced through noise reduction, contrast adjustment, and normalization.' },
    { name: 'AI Detection', description: 'Our deep learning models identify and classify organisms in real-time with high accuracy.' },
    { name: 'Analysis', description: 'The processed results are compiled into detailed reports for research and conservation.' }
  ]

  const impactMetrics = [
    { label: 'Accuracy', value: '94.7%', icon: Target },
    { label: 'Latency', value: '0.3s', icon: Clock },
    { label: 'Power Usage', value: '2.1W', icon: Zap }
  ]

  return (
<div className="ocean-gradient h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
      {/* Hero Section */}
 <section
    className="snap-start flex items-center justify-center px-4"
    style={{ minHeight: 'calc(100vh - 60px)' }} // navbar height = 80px
  >
    <div className="max-w-7xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
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
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
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

  {/* Approach Section (Carousel) */}
  <section
    className="snap-start flex items-center justify-center px-4"
    style={{ minHeight: 'calc(100vh - 60px)' }}
  >
    <div className="max-w-3xl mx-auto w-full relative">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold text-white text-center mb-12"
      >
        Approach
      </motion.h2>

      {/* Carousel Card */}
      <motion.div
        key={approachCards[currentCard].id}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-2xl overflow-hidden shadow-2xl cursor-pointer h-96 flex items-center justify-center"
        style={{ background: 'none' }}
        onClick={() => handleCardClick(approachCards[currentCard])}
      >
        {/* Card Image with fallback */}
        <img
          src={imgError[approachCards[currentCard].id] ? localImages[approachCards[currentCard].name] : approachCards[currentCard].image}
          alt={approachCards[currentCard].name}
          className="absolute inset-0 w-full h-full object-cover"
          onError={() => setImgError(prev => ({ ...prev, [approachCards[currentCard].id]: true }))}
          style={{ zIndex: 1 }}
        />
        <div className="absolute inset-0 bg-black/40 z-10" />
        <h3 className="absolute bottom-0 left-0 right-0 text-3xl font-bold text-white p-6 bg-gradient-to-t from-black/70 to-transparent text-center z-20">
          {approachCards[currentCard].name}
        </h3>
      </motion.div>

      {/* Modal Popup */}
      {showModal && modalCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden relative w-[85vw] h-[85vh] flex flex-col">
            <button
              className="absolute top-4 right-4 text-ocean-600 bg-white rounded-full p-2 shadow hover:bg-ocean-100 z-10"
              onClick={closeModal}
            >
              &#10005;
            </button>
            <div className="w-full h-2/5 bg-gray-200 flex items-center justify-center">
              <img
                src={imgError[modalCard.id] ? localImages[modalCard.name] : modalCard.image}
                alt={modalCard.name}
                className="w-full h-full object-cover"
                style={{ maxHeight: '100%', maxWidth: '100%' }}
                onError={() => setImgError(prev => ({ ...prev, [modalCard.id]: true }))}
              />
            </div>
            <div className="p-8 overflow-y-auto h-3/5">
              <h2 className="text-3xl font-bold text-ocean-700 mb-4 text-center">{modalCard.name}</h2>
              <p className="text-lg text-gray-700 mb-6 text-center">{modalCard.description}</p>
              {modalCard.metrics && (
                <div className="flex justify-center space-x-8">
                  {Object.entries(modalCard.metrics).map(([key, value]) => (
                    <div key={key} className="bg-ocean-100 rounded-lg px-4 py-2 text-ocean-700 font-semibold">
                      {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  </section>

  {/* Pipeline Section */}
  <section
    className="snap-start flex items-center justify-center px-4 bg-gradient-to-b from-ocean-900 to-ocean-800"
    style={{ minHeight: 'calc(100vh - 60px)' }}
  >
    <div className="max-w-6xl mx-auto w-full">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold text-white text-center mb-16"
      >
        Processing Pipeline
      </motion.h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {pipelineStages.map((stage, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            className="text-center relative p-6 glass-effect rounded-xl"
          >
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-2xl font-bold text-white">{index + 1}</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">{stage.name}</h3>
            <p className="text-ocean-100 text-sm leading-relaxed">{stage.description}</p>

            {index < pipelineStages.length - 1 && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                whileInView={{ width: "4rem", opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                className="hidden lg:block absolute top-10 left-full h-0.5 bg-white/40 transform -translate-y-1/2"
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  </section>

  {/* Performance Metrics */}
  <section
    className="snap-start flex items-center justify-center px-4 bg-white/5 backdrop-blur-sm"
    style={{ minHeight: 'calc(100vh - 60px)' }}
  >
    <div className="max-w-7xl mx-auto w-full">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold text-white text-center mb-16"
      >
        Performance Metrics
      </motion.h2>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {impactMetrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="text-center glass-effect rounded-xl p-10 flex flex-col items-center justify-center"
          >
            <metric.icon className="h-14 w-14 text-white mb-6" />
            <div className="text-5xl font-extrabold text-white mb-3">{metric.value}</div>
            <div className="text-lg text-ocean-200">{metric.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>

  {/* Team Section */}
  <section
    className="snap-start flex items-center justify-center px-4"
    style={{ minHeight: 'calc(100vh - 60px)' }}
  >
    <div className="max-w-7xl mx-auto w-full">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold text-white text-center mb-12"
      >
        Our Team
      </motion.h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {teamMembers.map((member, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="text-center glass-effect rounded-2xl p-10 flex flex-col items-center shadow-xl hover:scale-105 transition-transform duration-300"
          >
            <div className="w-32 h-32 rounded-full overflow-hidden flex items-center justify-center mb-6 shadow-lg bg-gradient-to-br from-ocean-400 to-ocean-600">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.display = "none" }}
              />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{member.name}</h3>
            <p className="text-ocean-200 text-sm mb-4">{member.role}</p>
            <div className="flex space-x-4 mt-2">
              {member.linkedin && (
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-ocean-200 hover:text-ocean-400 transition-colors">
                  <Linkedin className="h-6 w-6" />
                </a>
              )}
              {member.github && (
                <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-ocean-200 hover:text-ocean-400 transition-colors">
                  <Github className="h-6 w-6" />
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>

{/* Downloads Section */}
<section
  className="snap-start py-16 px-4 bg-white/5 backdrop-blur-sm"
  style={{ minHeight: 'calc(100vh - 60px)' }}
>
  <div className="max-w-7xl mx-auto">
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="text-4xl font-bold text-white text-center mb-12"
    >
      Downloads
    </motion.h2>

    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        {
          name: "Deep Dataset",
          description: "Original deep dataset for phytoplankton enumeration without overlap.",
          size: "209 MB",
          url: "https://huggingface.co/datasets/TheDeepDas/Phytoplanktons-Enumeration-Without-Overlap/resolve/main/deep%20dataset.zip"
        },
        {
          name: "Deep Large Dataset",
          description: "Larger version of the deep dataset for training high-capacity models.",
          size: "2.1 GB",
          url: "https://huggingface.co/datasets/TheDeepDas/Phytoplanktons-Enumeration-Without-Overlap/resolve/main/deep%20large%20dataset.zip"
        },
        {
          name: "Pre-processed Dataset without Overlap",
          description: "Dataset with preprocessing applied for faster training and evaluation.",
          size: "2.55 GB",
          url: "https://huggingface.co/datasets/TheDeepDas/Phytoplanktons-Enumeration-Without-Overlap/resolve/main/pre-processed%20dataset.zip"
        },
        {
          name: "Deep Dataset with Overlap",
          description: "Original deep dataset including overlapping phytoplanktons.",
          size: "28.1 MB",
          url: "https://huggingface.co/datasets/TheDeepDas/Phytoplankton-Enumeration/resolve/main/deep%20dataset%20with%20overlap.zip"
        },
        {
          name: "Deep Large Dataset with Overlap",
          description: "Large dataset including overlapping phytoplanktons for advanced models.",
          size: "285 MB",
          url: "https://huggingface.co/datasets/TheDeepDas/Phytoplankton-Enumeration/resolve/main/deep%20large%20dataset%20with%20overlap.zip"
        },
        {
          name: "Pre-Processing Model",
          description: "Model for preprocessing phytoplankton images.",
          size: "127 KB",
          url: "https://huggingface.co/TheDeepDas/Phytoplankton-Models/blob/main/phytoplankton_preprocessing_pipeline.pkl"
        },
        {
          name: "Model 1 of Stacking Ensemble",
          description: "Model for classifying phytoplankton images.",
          size: "9.34 MB",
          url: "https://huggingface.co/TheDeepDas/Phytoplankton-Models/blob/main/mobilenetv2_regression.pth"
        },
        {
          name: "Model 2 of Stacking Ensemble",
          description: "Model for enumerating phytoplankton images.",
          size: "43 MB",
          url: "https://huggingface.co/TheDeepDas/Phytoplankton-Models/blob/main/resnet18_regression.pth"
        },
        {
          name: "Final Ensemble Model",
          description: "Final Ensemble Model for phytoplankton images.",
          size: "254 KB",
          url: "https://huggingface.co/TheDeepDas/Phytoplankton-Models/blob/main/phytoplankton_stacking_ensemble.pkl"
        },
        {
          name: "Complete Pipeline Model",
          description: "Complete Pipeline Model for phytoplankton images.",
          size: "52.5 MB",
          url: "https://huggingface.co/TheDeepDas/Phytoplankton-Models/blob/main/phytoplankton_full_pipeline.pkl"
        }
      ].map((file, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="glass-effect rounded-xl p-6 hover:bg-white/20 transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white text-lg">{file.name}</h3>
              <ExternalLink className="h-5 w-5 text-ocean-200" />
            </div>
            <p className="text-ocean-100 text-sm mb-4">{file.description}</p>
          </div>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-ocean-200 text-sm">{file.size}</span>
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
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
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
    className="max-w-7xl mx-auto text-center"
  >
    <div className="flex items-center justify-center space-x-2 mb-4">
      <Waves className="h-6 w-6 text-white" />
      <span className="text-white font-semibold">Marine AI Microscopy</span>
    </div>
    <p className="text-ocean-200 text-sm">
      Advancing marine biology research through intelligent microscopy systems
    </p>
  </motion.div>
</footer>

    </div>
  )
}

export default Showcase
