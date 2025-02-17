'use client'

import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Provider, City } from '@/types/provider'
import { fetchProviders } from '@/api/providerApi'

const ITEMS_PER_PAGE = 10

const STATUS_COLORS: { [key: string]: string } = {
  active: 'bg-green-100 text-green-800',
  blocked: 'bg-red-100 text-red-800'
}

export default function ProviderPage() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [cityFilter, setCityFilter] = useState<string>("all")
  const { toast } = useToast()

  useEffect(() => {
    loadProviders()
  }, [currentPage, statusFilter, cityFilter])

  const loadProviders = async () => {
    try {
      setIsLoading(true)
      const response = await fetchProviders({
        status: statusFilter,
        city_id: cityFilter,
        page: currentPage,
        limit: ITEMS_PER_PAGE
      })
      
      setProviders(response.data)
      setCities(response.cities)
      setTotalPages(response.pagination.total_pages)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load providers"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatMobile = (mobile: string) => {
    return mobile.slice(-10).replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Provider Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="false">Active</SelectItem>
                <SelectItem value="true">Blocked</SelectItem>
              </SelectContent>
            </Select>
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {cities.map(city => (
                  <SelectItem key={city.id} value={city.id}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Total Jobs</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : providers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      No providers found
                    </TableCell>
                  </TableRow>
                ) : (
                  providers.map((provider) => (
                    <TableRow key={provider.id}>
                      <TableCell className="font-medium">{provider.name}</TableCell>
                      <TableCell>{formatMobile(provider.mobile)}</TableCell>
                      <TableCell>{provider.city}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {provider.rating.toFixed(1)}
                          <Star className="h-4 w-4 text-yellow-400 ml-1" />
                        </div>
                      </TableCell>
                      <TableCell>{provider.total_jobs}</TableCell>
                      <TableCell>{formatCurrency(provider.total_spent)}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={STATUS_COLORS[provider.is_blocked ? 'blocked' : 'active']}
                        >
                          {provider.is_blocked ? 'BLOCKED' : 'ACTIVE'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}