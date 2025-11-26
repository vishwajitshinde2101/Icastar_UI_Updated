import React, { useState, useCallback } from 'react'
import { Card } from '../../components/Card'
import { getArtistSuggestions } from '../../services/geminiService'
import { SuggestedArtist } from '../../types'
import { WandSparklesIcon } from '../../components/icons/IconComponents'

const SuggestedArtistCard: React.FC<{ artist: SuggestedArtist }> = ({
  artist,
}) => (
  <Card className='flex flex-col text-center items-center hover:-translate-y-1 transition-transform relative overflow-hidden'>
    <div className='absolute top-2 right-2 bg-secondary text-white text-xs font-bold px-2.5 py-1 rounded-full'>
      {artist.matchScore}% Match
    </div>
    <img
      className='w-24 h-24 rounded-full mb-4 object-cover ring-2 ring-offset-2 ring-gray-100'
      src={artist.avatarUrl}
      alt={artist.name}
    />
    <h3 className='text-lg font-bold text-gray-900'>{artist.name}</h3>
    <p className='text-sm text-gray-500 mt-1'>{artist.bio}</p>
    <p className='text-sm text-gray-600 bg-gray-50 p-3 rounded-lg mt-3 italic'>
      "{artist.reason}"
    </p>
    <div className='mt-4 flex flex-wrap gap-2 justify-center'>
      {artist.skills.map(skill => (
        <span
          key={skill}
          className='px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md'>
          {skill}
        </span>
      ))}
    </div>
    <button className='mt-6 w-full px-4 py-2 border border-transparent rounded-lg text-sm font-semibold text-white bg-primary hover:bg-primary-hover transition-colors'>
      Contact Artist
    </button>
  </Card>
)

export const SuggestionsPage: React.FC = () => {
  const [jobDescription, setJobDescription] = useState('')
  const [suggestions, setSuggestions] = useState<SuggestedArtist[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFetchSuggestions = useCallback(async () => {
    if (!jobDescription.trim()) {
      setError('Please enter a job description.')
      return
    }
    setIsLoading(true)
    setError(null)
    setSuggestions([])
    try {
      const results = await getArtistSuggestions(jobDescription)
      setSuggestions(results)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [jobDescription])

  return (
    <div>
      <div className='text-center mb-8'>
        <WandSparklesIcon className='mx-auto h-12 w-12 text-secondary' />
        <h2 className='mt-4 text-3xl font-bold text-gray-900'>
          AI Artist Suggestions
        </h2>
        <p className='mt-2 max-w-2xl mx-auto text-lg text-gray-600'>
          Paste a job description below and our AI will find the perfect
          candidates for you.
        </p>
      </div>
      <Card className='max-w-4xl mx-auto'>
        <div className='space-y-4'>
          <label
            htmlFor='job-description'
            className='block text-sm font-medium text-gray-700'>
            Job Description
          </label>
          <textarea
            id='job-description'
            rows={8}
            className='block w-full rounded-lg border-gray-300 shadow-sm transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 sm:text-sm px-3 py-2.5'
            placeholder="e.g., Seeking a talented illustrator for a children's book project. Must be proficient in Procreate and have a whimsical art style..."
            value={jobDescription}
            onChange={e => setJobDescription(e.target.value)}
            disabled={isLoading}
          />
          {error && <p className='text-sm text-red-600'>{error}</p>}
          <div className='text-right'>
            <button
              onClick={handleFetchSuggestions}
              disabled={isLoading}
              className='inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400'>
              {isLoading ? (
                <>
                  <svg
                    className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'>
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                  </svg>
                  Generating...
                </>
              ) : (
                'Get Suggestions'
              )}
            </button>
          </div>
        </div>
      </Card>

      {suggestions.length > 0 && (
        <div className='mt-12'>
          <h3 className='text-2xl font-bold text-gray-900 text-center mb-6'>
            Top Matches For You
          </h3>
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {suggestions.map(artist => (
              <SuggestedArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
