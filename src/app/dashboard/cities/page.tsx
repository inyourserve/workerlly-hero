'use client'

import { useState, useEffect, useCallback } from 'react'
import { PlusCircle, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { Pagination } from '@/components/ui/pagination'
import type { City, State } from '@/types/city'
import * as cityApi from '@/api/cityApi'

const ITEMS_PER_PAGE = 10

export default function CityManagementPage() {
  const [cities, setCities] = useState<City[]>([])
  const [states, setStates] = useState<State[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newCityName, setNewCityName] = useState('')
  const [selectedStateId, setSelectedStateId] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCities, setTotalCities] = useState(0)
  const [filterStateId, setFilterStateId] = useState<string>('')
  const { toast } = useToast()

  const loadCities = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await cityApi.fetchCities(
        currentPage,
        ITEMS_PER_PAGE,
        filterStateId === 'all' ? undefined : filterStateId,
        undefined,
        searchTerm || undefined
      )
      setCities(response.data)
      setTotalPages(response.total_pages)
      setTotalCities(response.total)
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load cities',
      })
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, filterStateId, searchTerm])

  useEffect(() => {
    const loadData = async () => {
      try {
        const statesData = await cityApi.fetchStates()
        setStates(statesData)
        loadCities()
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load initial data',
        })
      }
    }

    loadData()
  }, [loadCities, toast])

  const handleStatusChange = async (cityId: string, newStatus: boolean) => {
    try {
      await cityApi.updateCity(cityId, { is_served: newStatus })
      setCities(cities.map((city) => 
        city._id === cityId ? { ...city, is_served: newStatus } : city
      ))
      toast({
        title: 'Success',
        description: `City status updated successfully`,
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update city status',
      })
    }
  }

  const handleAddCity = async () => {
    if (!newCityName || !selectedStateId) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter a city name and select a state',
      })
      return
    }

    try {
      await cityApi.createCity({
        name: newCityName,
        is_served: false,
        state_id: selectedStateId,
      })
      toast({
        title: 'Success',
        description: 'New city added successfully',
      })
      setNewCityName('')
      setSelectedStateId('')
      setCurrentPage(1)
      loadCities()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add new city',
      })
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
    // Debounce the loadCities call if needed
    loadCities()
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleStateFilter = (stateId: string) => {
    setFilterStateId(stateId);
    setCurrentPage(1);
    // Only pass state_id to API if it's not "all"
    // loadCities(1, ITEMS_PER_PAGE, stateId === 'all' ? undefined : stateId);
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>City Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-4">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search cities..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-8"
                />
              </div>
              <Select 
  value={filterStateId} 
  onValueChange={handleStateFilter}
>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Filter by State" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">All States</SelectItem>
    {states.map((state) => (
      <SelectItem key={state.id} value={state.id}>
        {state.name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
            </div>
            <p className="text-sm text-muted-foreground">
              Total Cities: {totalCities}
            </p>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>City Name</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : cities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No cities found
                  </TableCell>
                </TableRow>
              ) : (
                cities.map((city) => (
                  <TableRow key={city._id}>
                    <TableCell>{city.name}</TableCell>
                    <TableCell>{city.state_name || 'N/A'}</TableCell>
                    <TableCell>{city.is_served ? 'Enabled' : 'Disabled'}</TableCell>
                    <TableCell>
                      <Switch
                        checked={city.is_served}
                        onCheckedChange={(checked) =>
                          handleStatusChange(city._id, checked)
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <div className="mt-4 flex items-center justify-between">
            <Pagination>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="mx-2">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add New City</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Select value={selectedStateId} onValueChange={setSelectedStateId}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state.id} value={state.id}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Enter city name"
              value={newCityName}
              onChange={(e) => setNewCityName(e.target.value)}
            />
            <Button onClick={handleAddCity}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add City
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
