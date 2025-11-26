import React, { useEffect, useState } from 'react'
import { Card } from '../../components/Card'
import { Artist, Page } from '../../types'
import { SearchIcon } from '../../components/icons/IconComponents'
import { Pagination } from '../../components/Pagination'
import { useNavigate } from 'react-router-dom'
import { browseArtists } from '../../services/recruiterArtistsService'

// Remote data
const ITEMS_PER_PAGE = 6

const ArtistCard: React.FC<{ artist: Artist; onViewProfile: () => void }> = ({
  artist,
  onViewProfile,
}) => (
  <Card className='flex flex-col text-center items-center hover:-translate-y-1 transition-transform'>
    <img
      className='w-24 h-24 rounded-full mb-4 object-cover ring-2 ring-offset-2 ring-gray-100'
      src={artist.avatarUrl}
      alt={artist.name}
    />
    <h3 className='text-lg font-bold text-gray-900'>{artist.name}</h3>
    <p className='text-sm text-gray-500 mt-1 flex-grow'>{artist.bio}</p>
    <div className='mt-4 flex flex-wrap gap-2 justify-center'>
      {artist.skills.map(skill => (
        <span
          key={skill}
          className='px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md'>
          {skill}
        </span>
      ))}
    </div>
    <button
      onClick={onViewProfile}
      className='mt-6 w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors'>
      View Profile
    </button>
  </Card>
)

export const BrowseArtistsPage= () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [artists, setArtists] = useState<Artist[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [searchSkills, setSearchSkills] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleViewProfile = (artist: Artist) => {
    navigate('/artist-profile', { state: { artist } })
  }

  useEffect(() => {
    const fetchArtists = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await browseArtists({ page: currentPage, size: ITEMS_PER_PAGE, skills: searchSkills || undefined })
        setArtists(res.items)
        setTotalItems(res.totalElements)
      } catch (e) {
        console.error('Failed to fetch artists', e)
        setError('Failed to load artists')
        setArtists([])
        setTotalItems(0)
      } finally {
        setLoading(false)
      }
    }
    fetchArtists()
  }, [currentPage, searchSkills])

  return (
    <div>
      <div className='flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6'>
        <h2 className='text-3xl font-bold text-gray-900'>Browse Artists</h2>
        <div className='flex gap-2 items-center'>
          <div className='relative w-full md:max-w-xs'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <SearchIcon className='h-5 w-5 text-gray-400' />
            </div>
            <input
             type='text'
              className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary'
              placeholder='Search by skill...'
              value={searchSkills}
              onChange={e => setSearchSkills(e.target.value)}
            />
          </div>
          <button className='px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 whitespace-nowrap'>
            Filters
          </button>
        </div>
      </div>
      {error && (
        <div className='text-red-600 text-sm mb-4'>{error}</div>
      )}
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {artists.map(artist => (
          <ArtistCard
            key={artist.id}
            artist={artist}
            onViewProfile={() => handleViewProfile(artist)}
          />
        ))}
        {loading && (
          <div className='col-span-full text-center text-gray-500'>Loading...</div>
        )}
        {!loading && artists.length === 0 && (
          <div className='col-span-full text-center text-gray-500'>No artists found</div>
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={page => setCurrentPage(page)}
        className='mt-8'
      />
    </div>
  )
}
