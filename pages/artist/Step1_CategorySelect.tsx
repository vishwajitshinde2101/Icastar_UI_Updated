import React, { useState, useEffect } from 'react'
import { ArtistCategory } from '@/types'
import Icon, { IconName } from '@/components/Icon'
import { onboardingService } from '@/services/onboardingService'
import { toast } from 'react-toastify'

interface CategorySelectProps {
  onNext: () => void
  updateFormData: (data: { artistTypeId: string; category: ArtistCategory }) => void
}

interface Category {
  id: string
  name: ArtistCategory
  icon: IconName
  description: string
}

// Fallback categories in case API fails
const fallbackCategories: Category[] = [
  {
    id: '5',
    name: ArtistCategory.Actor,
    icon: 'User',
    description: 'Acting, modeling, and performance roles.',
  },
  {
    id: '2',
    name: ArtistCategory.Dancer,
    icon: 'PersonStanding',
    description: 'For dancers and choreographers.',
  },
  {
    id: '3',
    name: ArtistCategory.Director,
    icon: 'Clapperboard',
    description: 'Film, TV, and stage directors.',
  },
  {
    id: '4',
    name: ArtistCategory.Singer,
    icon: 'Mic',
    description: 'Vocal artists and singers.',
  },
  {
    id: '1',
    name: ArtistCategory.Musician,
    icon: 'Music',
    description: 'Instrumentalists and musicians.',
  },
]

const CategoryCard: React.FC<{
  category: Category
  isSelected: boolean
  onSelect: () => void
}> = ({ category, isSelected, onSelect }) => (
  <div
    role='button'
    aria-pressed={isSelected}
    tabIndex={0}
    className={`relative group p-4 border-2 rounded-2xl text-center cursor-pointer transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
      isSelected
        ? 'border-primary bg-primary/10 shadow-lg scale-105'
        : 'border-gray-200 bg-white hover:border-primary hover:shadow-md'
    }`}
    onClick={onSelect}
    onKeyDown={e => e.key === 'Enter' && onSelect()}>
    <Icon
      name={category.icon}
      size={40}
      className='mx-auto text-primary mb-3'
    />
    <h3 className='font-bold text-sm text-gray-800 leading-tight'>
      {category.name}
    </h3>
    <div className='absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2'>
      <p className='text-white text-xs font-medium'>{category.description}</p>
    </div>
  </div>
)

const Step1_CategorySelect: React.FC<CategorySelectProps> = ({
  onNext,
  updateFormData,
}) => {
  const [categories, setCategories] = useState<Category[]>(fallbackCategories)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await onboardingService.getCategories()
        const mappedCategories = data.map(cat => ({
          id: cat.id,
          name: (cat.name as ArtistCategory) ?? ArtistCategory.Actor,
          icon: mapCategoryToIcon((cat.name as ArtistCategory) ?? ArtistCategory.Actor),
          description: cat.description,
        }))
        setCategories(mappedCategories.length ? mappedCategories : fallbackCategories)
      } catch (error) {
        console.error('Failed to load categories, using fallback', error)
        // toast.error('Failed to load categories. Using default options.');
        setCategories(fallbackCategories)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const mapCategoryToIcon = (category: ArtistCategory): IconName => {
    const iconMap: Partial<Record<ArtistCategory, IconName>> = {
      [ArtistCategory.Actor]: 'User',
      [ArtistCategory.Dancer]: 'PersonStanding',
      [ArtistCategory.Director]: 'Clapperboard',
      [ArtistCategory.Singer]: 'Mic',
      [ArtistCategory.Musician]: 'Music',
    }
    return iconMap[category] || 'User'
  }

  const handleCategorySelect = (categoryId: string, categoryName: ArtistCategory) => {
    setSelectedCategory(categoryId)
    updateFormData({ artistTypeId: categoryId, category: categoryName })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCategory) {
      toast.error('Please select a category to continue')
      return
    }
    onNext()
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500' />
      </div>
    )
  }

  return (
    <div className='bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-5xl mx-auto'>
      <form onSubmit={handleSubmit} className='space-y-8'>
        <div className='space-y-2'>
          <h2 className='text-2xl sm:text-3xl font-bold text-center mb-2'>
            Choose your artist category
          </h2>
          <p className='text-gray-500 text-center mb-8'>
            Select the category that best represents you.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {categories.map(category => (
            <CategoryCard
              key={category.id}
              category={category}
              isSelected={selectedCategory === category.id}
              onSelect={() => handleCategorySelect(category.id, category.name)}
            />
          ))}
        </div>

        <div className='flex justify-end space-x-4 pt-4'>
          <button
            type='submit'
            disabled={!selectedCategory}
            className='bg-primary text-white font-bold py-3 px-12 rounded-lg shadow-md hover:bg-primary/80 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none'>
            Continue
          </button>
        </div>
      </form>
    </div>
  )
}

export default Step1_CategorySelect
