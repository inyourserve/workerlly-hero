// app/dashboard/jobs/[id]/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Clock, MapPin, Star, CheckCircle, Calendar, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { fetchJobDetails } from "@/api/jobApi"
import { useToast } from "@/components/ui/use-toast"
import { Job } from "@/types/jobs"
import { formatDate } from "@/lib/utils"

const STATUS_COLORS: { [key: string]: string } = {
  pending: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  "in_progress": "bg-blue-100 text-blue-800",
}

export default function JobDetailsPage() {
  const params = useParams()
  const jobId = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params?.id[0] : null
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [jobDetails, setJobDetails] = useState<Job | null>(null)

  useEffect(() => {
    if (jobId) {
      loadJobDetails()
    }
  }, [jobId])

  const loadJobDetails = async () => {
    if (!jobId) return

    try {
      setIsLoading(true)
      const response = await fetchJobDetails(jobId)
      setJobDetails(response.data)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load job details"
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Loading...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!jobDetails) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Job not found</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{jobDetails.title}</h1>
            <p className="text-muted-foreground mt-1">Task ID: {jobDetails.task_id}</p>
          </div>
        </div>
        <Badge variant="outline" className={STATUS_COLORS[jobDetails.status]}>
          {jobDetails.status.replace('_', ' ').toUpperCase()}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Job Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{jobDetails.description}</p>
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category</span>
                <span>{jobDetails.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hourly Rate</span>
                <span>₹{jobDetails.hourly_rate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated Time</span>
                <span>{jobDetails.estimated_time} minute(s)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Card */}
        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-2">
              <MapPin className="w-5 h-5 mt-1 text-muted-foreground shrink-0" />
              <div>
                <p>{jobDetails.address_snapshot.address_line1}</p>
                {jobDetails.address_snapshot.address_line2 && (
                  <p className="text-muted-foreground">
                    {jobDetails.address_snapshot.address_line2}
                  </p>
                )}
                {jobDetails.address_snapshot.landmark && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Landmark: {jobDetails.address_snapshot.landmark}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timing Card */}
        <Card>
          <CardHeader>
            <CardTitle>Timing Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Created:</span>
                <span>{formatDate(jobDetails.created_at)}</span>
              </div>
              {jobDetails.job_booking_time && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Booked:</span>
                  <span>{formatDate(jobDetails.job_booking_time)}</span>
                </div>
              )}
              {jobDetails.reached_at && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Reached:</span>
                  <span>{formatDate(jobDetails.reached_at)}</span>
                </div>
              )}
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">Work Duration</h3>
              <p>{jobDetails.total_hours_worked}</p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Card */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Status</span>
                <Badge 
                  variant="outline" 
                  className={jobDetails.payment_status.paid ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                >
                  {jobDetails.payment_status.paid ? "PAID" : "PENDING"}
                </Badge>
              </div>
              {jobDetails.payment_status.paid && (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Method</span>
                    <span className="uppercase">{jobDetails.payment_status.payment_method}</span>
                  </div>
                  {jobDetails.payment_status.paid_at && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Paid At</span>
                      <span>{formatDate(jobDetails.payment_status.paid_at)}</span>
                    </div>
                  )}
                </>
              )}
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Billable Hours</span>
                <span>{jobDetails.billable_hours} hour(s)</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total Amount</span>
                <span>₹{jobDetails.total_amount}</span>
              </div>
            </div>
          </CardContent>
        </Card>

       {/* Provider and Seeker Details Section */}
<div className="grid gap-6 md:grid-cols-2">
  {/* Provider Details */}
  <Card>
    <CardHeader>
      <CardTitle>Provider Details</CardTitle>
    </CardHeader>
    <CardContent>
      {jobDetails.provider_details ? (
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={jobDetails.provider_details.profile.profile_image} />
            <AvatarFallback>{jobDetails.provider_details.profile.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{jobDetails.provider_details.profile.name}</h3>
            <p className="text-sm text-muted-foreground">{jobDetails.provider_details.mobile}</p>
            <div className="flex items-center gap-2 mt-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{jobDetails.provider_details.stats.avg_rating || 0}</span>
              <span className="text-muted-foreground">
                ({jobDetails.provider_details.stats.total_jobs_completed || 0} jobs)
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-8">
          No provider assigned yet
        </div>
      )}
    </CardContent>
  </Card>


       {/* Seeker Details */}
  <Card>
    <CardHeader>
      <CardTitle>Seeker Details</CardTitle>
    </CardHeader>
    <CardContent>
      {jobDetails.seeker_details ? (
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={jobDetails.seeker_details.profile.profile_image} />
            <AvatarFallback>{jobDetails.seeker_details.profile.name[0]}</AvatarFallback>

          </Avatar>
          <div>
            <h3 className="font-semibold">{jobDetails.seeker_details.profile.name}</h3>
            <p className="text-sm text-muted-foreground">{jobDetails.seeker_details.mobile}</p>

            <div className="flex items-center gap-2 mt-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{jobDetails.seeker_details.stats.avg_rating || 0}</span>
              <span className="text-muted-foreground">
                ({jobDetails.seeker_details.stats.total_jobs_done || 0} jobs)
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-8">
          No seeker details available
        </div>
      )}
    </CardContent>
  </Card>
</div>
        
      </div>
    </div>
  )
}
