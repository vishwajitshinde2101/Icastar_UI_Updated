import React from 'react'
import Icon from '@/components/Icon'

const bookmarkedJobs = [
  {
    logo: 'https://picsum.photos/seed/company1/48/48',
    title: 'Lead Actor',
    company: 'Bollywood Dreams',
    location: 'Mumbai',
  },
  {
    logo: 'https://picsum.photos/seed/company2/48/48',
    title: 'Mural Artist',
    company: 'Art Scape',
    location: 'Goa',
  },
  {
    logo: 'https://picsum.photos/seed/company3/48/48',
    title: 'Stand-up Comedian',
    company: 'Comedy Central',
    location: 'Remote',
  },
  {
    logo: 'https://picsum.photos/seed/company4/48/48',
    title: 'Ballet Dancer',
    company: 'Royal Academy',
    location: 'Delhi',
  },
  {
    logo: 'https://picsum.photos/seed/company5/48/48',
    title: 'Content Writer',
    company: 'Wordsmith Inc.',
    location: 'Bangalore',
  },
]

const BookmarkCard: React.FC<(typeof bookmarkedJobs)[0]> = ({
  logo,
  title,
  company,
  location,
}) => (
  <div className='bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300'>
    <div className='flex items-start justify-between'>
      <img
        src={logo}
        alt={`${company} logo`}
        className='w-12 h-12 rounded-xl'
      />
      <button className='text-gray-400 hover:text-amber-600 transition-colors'>
        <Icon name='Trash2' size={20} />
      </button>
    </div>
    <div className='mt-4'>
      <h3 className='text-xl font-bold'>{title}</h3>
      <p className='text-gray-500 font-medium'>{company}</p>
      <div className='flex items-center text-amber-600 text-sm gap-2 mt-2'>
        <Icon name='MapPin' size={16} />
        <span>{location}</span>
      </div>
    </div>
    <button className='w-full mt-6 bg-amber-50 text-amber-800 font-semibold py-3 px-6 rounded-xl hover:bg-amber-100 transition-all'>
      View Job
    </button>
  </div>
)

const Bookmarks: React.FC = () => {
  return (
    <div className='space-y-6'>
      <h1 className='text-4xl font-bold'>Saved Jobs</h1>
      <p className='text-gray-600'>
        Revisit your favorite opportunities and never miss a deadline.
      </p>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {bookmarkedJobs.map((job, index) => (
          <BookmarkCard key={index} {...job} />
        ))}
      </div>
      {bookmarkedJobs.length === 0 && (
        <div className='text-center py-20 bg-white rounded-2xl shadow-lg'>
          <div className='bg-amber-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto'>
            <Icon name='Bookmark' size={48} className='text-amber-400' />
          </div>
          <h2 className='mt-6 text-2xl font-bold text-gray-800'>
            No Bookmarks Yet
          </h2>
          <p className='mt-2 text-gray-500 max-w-md mx-auto'>
            Start exploring jobs and save the ones you love! Your saved opportunities will appear here.
          </p>
        </div>
      )}
    </div>
  )
}

export default Bookmarks
