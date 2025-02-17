'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { createOrUpdateRate, fetchRates } from '@/api/rateApi'
import { City, Category } from '@/types/rate'

interface CategoryRate {
  category_id: string;
  category_name: string;
  rate_per_hour: number;
  min_hourly_rate: number;
  max_hourly_rate: number;
  has_existing_rate: boolean;
}

export default function AddRatesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [cities, setCities] = useState<City[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCity, setSelectedCity] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingRates, setIsFetchingRates] = useState(false)
  const [categoryRates, setCategoryRates] = useState<CategoryRate[]>([])

  useEffect(() => {
    loadInitialData()
  }, [])

  // Initialize category rates when categories change
  useEffect(() => {
    if (categories.length > 0) {
      const initialRates = categories.map(category => ({
        category_id: category.id,
        category_name: category.name,
        rate_per_hour: 0,
        min_hourly_rate: 0,
        max_hourly_rate: 0,
        has_existing_rate: false
      }))
      setCategoryRates(initialRates)
    }
  }, [categories])

  // Fetch existing rates when city is selected
  useEffect(() => {
    if (selectedCity) {
      fetchExistingRates()
    }
  }, [selectedCity])

  const loadInitialData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/admin/rates?page=1&per_page=1')
      const data = await response.json()
      setCities(data.cities || [])
      setCategories(data.categories || [])
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load initial data"
      })
    }
  }

  const fetchExistingRates = async () => {
    setIsFetchingRates(true)
    try {
      const response = await fetchRates({
        city_id: selectedCity,
        page: 1,
        per_page: 100 // Assuming we won't have more than 100 categories
      })

      // Create a map of existing rates by category_id
      const existingRatesMap = new Map(
        response.rates.map(rate => [rate.category_id, rate])
      )

      // Update category rates with existing values
      setCategoryRates(prevRates => 
        prevRates.map(rate => {
          const existingRate = existingRatesMap.get(rate.category_id)
          if (existingRate) {
            return {
              ...rate,
              rate_per_hour: existingRate.rate_per_hour,
              min_hourly_rate: existingRate.min_hourly_rate,
              max_hourly_rate: existingRate.max_hourly_rate,
              has_existing_rate: true
            }
          }
          return {
            ...rate,
            rate_per_hour: 0,
            min_hourly_rate: 0,
            max_hourly_rate: 0,
            has_existing_rate: false
          }
        })
      )
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch existing rates"
      })
    } finally {
      setIsFetchingRates(false)
    }
  }

  const handleRateChange = (categoryId: string, field: keyof CategoryRate, value: number) => {
    setCategoryRates(prevRates => 
      prevRates.map(rate => 
        rate.category_id === categoryId 
          ? { ...rate, [field]: value }
          : rate
      )
    )
  }

  const validateRates = (rates: CategoryRate[]): boolean => {
    for (const rate of rates) {
      if (rate.min_hourly_rate > rate.max_hourly_rate) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: `${rate.category_name}: Minimum rate cannot be greater than maximum rate`
        })
        return false
      }
      if (rate.rate_per_hour < rate.min_hourly_rate || rate.rate_per_hour > rate.max_hourly_rate) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: `${rate.category_name}: Rate per hour must be between minimum and maximum rates`
        })
        return false
      }
    }
    return true
  }

  const handleSubmit = async () => {
    if (!selectedCity) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a city"
      })
      return
    }

    if (!validateRates(categoryRates)) {
      return
    }

    setIsLoading(true)
    try {
      // Create/update rates for each category
      for (const rate of categoryRates) {
        if (rate.rate_per_hour > 0) { // Only save rates that have been set
          await createOrUpdateRate({
            city_id: selectedCity,
            category_id: rate.category_id,
            rate_per_hour: rate.rate_per_hour,
            min_hourly_rate: rate.min_hourly_rate,
            max_hourly_rate: rate.max_hourly_rate
          })
        }
      }

      toast({
        title: "Success",
        description: "Rates have been saved successfully"
      })
      router.push('/dashboard/rates')
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save rates"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Add New Rates</CardTitle>
          <CardDescription>
            Set rates for all categories in a selected city. Existing rates will be shown if available.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="mb-6">
            <Select
              value={selectedCity}
              onValueChange={setSelectedCity}
            >
              <SelectTrigger className="w-full md:w-[300px]">
                <SelectValue placeholder="Select a city" />
              </SelectTrigger>
              <SelectContent>
                {cities.map(city => (
                  <SelectItem key={city.id} value={city.id}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCity && (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Rate/Hour (₹)</TableHead>
                      <TableHead>Min Rate (₹)</TableHead>
                      <TableHead>Max Rate (₹)</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isFetchingRates ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-10">
                          Loading existing rates...
                        </TableCell>
                      </TableRow>
                    ) : (
                      categoryRates.map((rate) => (
                        <TableRow key={rate.category_id}>
                          <TableCell>{rate.category_name}</TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={rate.rate_per_hour}
                              onChange={(e) => handleRateChange(rate.category_id, 'rate_per_hour', parseFloat(e.target.value))}
                              className="w-24"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={rate.min_hourly_rate}
                              onChange={(e) => handleRateChange(rate.category_id, 'min_hourly_rate', parseFloat(e.target.value))}
                              className="w-24"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={rate.max_hourly_rate}
                              onChange={(e) => handleRateChange(rate.category_id, 'max_hourly_rate', parseFloat(e.target.value))}
                              className="w-24"
                            />
                          </TableCell>
                          <TableCell>
                            <span className={`text-sm ${rate.has_existing_rate ? 'text-blue-600' : 'text-gray-500'}`}>
                              {rate.has_existing_rate ? 'Existing Rate' : 'New Rate'}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 flex justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={() => router.push('/dashboard/rates')}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save All Rates"}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}