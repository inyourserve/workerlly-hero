'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { X } from 'lucide-react'
import { Rate } from '@/types/rate'

interface EditRateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onEditRate: (rateId: string, updatedRate: Partial<Rate>) => Promise<void>;
  rate: Rate;
  categoryName: string | undefined;
  cityName: string | undefined;
}

export function EditRateDialog({ 
  isOpen, 
  onClose, 
  onEditRate, 
  rate,
  categoryName,
  cityName
}: EditRateDialogProps) {
  const [editedRate, setEditedRate] = useState({
    rate_per_hour: rate.rate_per_hour,
    min_hourly_rate: rate.min_hourly_rate,
    max_hourly_rate: rate.max_hourly_rate,
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setEditedRate({
      rate_per_hour: rate.rate_per_hour,
      min_hourly_rate: rate.min_hourly_rate,
      max_hourly_rate: rate.max_hourly_rate,
    })
  }, [rate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Ensure all required fields are included and properly formatted
    const updatedRateData = {
      city_id: rate.city_id,
      category_id: rate.category_id,
      rate_per_hour: Number(editedRate.rate_per_hour),
      min_hourly_rate: Number(editedRate.min_hourly_rate),
      max_hourly_rate: Number(editedRate.max_hourly_rate),
    }

    try {
      await onEditRate(rate._id, updatedRateData)
      toast({
        title: "Success",
        description: "Rate has been successfully updated.",
      })
      onClose()
    } catch (error) {
      console.error('Error updating rate:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update rate. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Edit Rate for {categoryName} in {cityName}
          </DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="rate_per_hour">Base Rate (₹/hr)</Label>
            <Input
              id="rate_per_hour"
              type="number"
              value={editedRate.rate_per_hour}
              onChange={(e) => setEditedRate({ ...editedRate, rate_per_hour: parseFloat(e.target.value) })}
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
              value={editedRate.min_hourly_rate}
              onChange={(e) => setEditedRate({ ...editedRate, min_hourly_rate: parseFloat(e.target.value) })}
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
              value={editedRate.max_hourly_rate}
              onChange={(e) => setEditedRate({ ...editedRate, max_hourly_rate: parseFloat(e.target.value) })}
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
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update Rate'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}