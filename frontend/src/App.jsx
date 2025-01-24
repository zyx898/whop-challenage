import { useState } from 'react'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import './App.css'

const celebrities = [
  "Taylor Swift", "Brad Pitt", "Lady Gaga", "Tom Cruise", 
  "Beyoncé", "Leonardo DiCaprio", "Madonna", "Johnny Depp",
  "Angelina Jolie", "Justin Bieber", "Jennifer Lawrence",
  "Will Smith", "Rihanna", "Robert Downey Jr.", "Adele"
]

function App() {
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [currentCelebrity, setCurrentCelebrity] = useState('')

  const generateImage = async () => {
    setLoading(true)
    const celebrity = celebrities[Math.floor(Math.random() * celebrities.length)]
    setCurrentCelebrity(celebrity)
    
    try {
      const response = await axios.post('https://api.deepai.org/api/text2img', {
        text: `${celebrity} and Barack Obama holding hands together, realistic photo`,
      }, {
        headers: {
          'api-key': '04499a02-421c-4d6c-8eac-d5a8ed1ce249'
        }
      })
      
      setImageUrl(response.data.output_url)
    } catch (error) {
      toast.error('Failed to generate image')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const copyImage = async () => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ])
      toast.success('Image copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy image')
      console.error(error)
    }
  }

  return (
    <div className="container">
      <Toaster position="top-center" />
      
      {currentCelebrity && imageUrl && (
        <h2 className="caption">
          Obama and {currentCelebrity} are apparently together!
        </h2>
      )}
      
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt={`Obama and ${currentCelebrity}`}
          className="generated-image"
        />
      )}
      
      <div className="button-container">
        <button 
          onClick={generateImage} 
          disabled={loading}
          className="generate-btn"
        >
          {loading ? 'Generating...' : 'Generate Celebrity Couple'}
        </button>
        
        {imageUrl && (
          <button 
            onClick={copyImage}
            className="copy-btn"
          >
            Copy Image
          </button>
        )}
      </div>
    </div>
  )
}

export default App 