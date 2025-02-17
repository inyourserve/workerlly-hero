import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { City } from '@/types/city'
import { Category, Rate } from '@/types/rate'
import { X } from 'lucide-react'
import * as rateApi from '@/api/rateApi'

interface AddRateDialogProps {
  isOpen: boolean
  onClose: () => void
  onAddRate: (rate: Omit<Rate, '_id'>) => void
  cities: City[]
  categories: Category[]
  selectedCity: string
}

export function AddRateDialog({ 
  isOpen, 
  onClose, 
  onAddRate, 
  cities, 
  categories,
  selectedCity 
}: AddRateDialogProps) {
  const [newRate, setNewRate] = useState<Omit<Rate, '_id'>>({
    city_id: selectedCity,
    category_id: '',
    rate_per_hour: 0,
    min_hourly_rate: 0,
    max_hourly_rate: 0,
  })
  const [isLoading, setIsLoading] = useState(false)

  // Update newRate when selectedCity changes
  useEffect(() => {
    setNewRate(prev => ({
      ...prev,
      city_id: selectedCity
    }))
  }, [selectedCity])

  const fetchExistingRate = async (categoryId: string) => {
    if (!categoryId) return
    
    setIsLoading(true)
    try {
      const rates = await rateApi.fetchRates(selectedCity)
      const existingRate = rates.find(rate => rate.category_id === categoryId)
      
      if (existingRate) {
        setNewRate({
          city_id: selectedCity,
          category_id: existingRate.category_id,
          rate_per_hour: existingRate.rate_per_hour,
          min_hourly_rate: existingRate.min_hourly_rate,
          max_hourly_rate: existingRate.max_hourly_rate,
        })
      } else {
        // Reset rate values if no existing rate found
        setNewRate(prev => ({
          ...prev,
          rate_per_hour: 0,
          min_hourly_rate: 0,
          max_hourly_rate: 0,
        }))
      }
    } catch (error) {
      console.error('Error fetching existing rate:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCategoryChange = (value: string) => {
    setNewRate(prev => ({ ...prev, category_id: value }))
    fetchExistingRate(value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddRate(newRate)
  }

  // Reset form when dialog is opened
  useEffect(() => {
    if (isOpen) {
      setNewRate({
        city_id: selectedCity,
        category_id: '',
        rate_per_hour: 0,
        min_hourly_rate: 0,
        max_hourly_rate: 0,
      })
    }
  }, [isOpen, selectedCity])

  const selectedCityName = cities.find(city => city._id === selectedCity)?.name

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Add New Rate for {selectedCityName}
          </DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={newRate.category_id}
              onValueChange={handleCategoryChange}
              disabled={isLoading}
            >
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rate_per_hour">Base Rate (₹/hr)</Label>
            <Input
              id="rate_per_hour"
              type="number"
              value={newRate.rate_per_hour}
              onChange={(e) => setNewRate({ ...newRate, rate_per_hour: parseFloat(e.target.value) })}
              min="0"
              step="0.01"
              required
              disabled={isLoading}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="min_hourly_rate">Minimum Hourly Rate (₹/hr)</Label>
            <Input
              id="min_hourly_rate"
              type="number"
              value={newRate.min_hourly_rate}
              onChange={(e) => setNewRate({ ...newRate, min_hourly_rate: parseFloat(e.target.value) })}
              min="0"
              step="0.01"
              required
              disabled={isLoading}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max_hourly_rate">Maximum Hourly Rate (₹/hr)</Label>
            <Input
              id="max_hourly_rate"
              type="number"
              value={newRate.max_hourly_rate}
              onChange={(e) => setNewRate({ ...newRate, max_hourly_rate: parseFloat(e.target.value) })}
              min="0"
              step="0.01"
              required
              disabled={isLoading}
              className="w-full"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#14171F] hover:bg-[#14171F]/90 text-white"
            disabled={isLoading || !newRate.category_id}
          >
            Add Rate
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}