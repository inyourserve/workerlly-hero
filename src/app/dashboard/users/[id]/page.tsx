// app/dashboard/users/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getUserProfile } from '@/api/userApi'
import { UserProfile } from '@/types/user'
import { 
  MapPin, 
  Star, 
  Clock, 
  Briefcase, 
  IndianRupee, 
  UserSquare2,
  ArrowLeft,
  User
} from 'lucide-react'

type PageParams = {
  [key: string]: string
  id: string
}

export default function UserProfilePage() {
  const params = useParams<PageParams>()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProfile = async () => {
      if (!params?.id) {
        setError('User ID is required')
        setIsLoading(false)
        return
      }

      try {
        const data = await getUserProfile(params.id)
        setProfile(data)
      } catch (error) {
        setError('Failed to load user profile')
        console.error('Error loading profile:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [params?.id])

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-500">
              {error || 'Failed to load user profile'}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Users
      </Button>

      {/* Basic Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <CardTitle>Basic Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium min-w-24">Name:</span>
                  <span>{profile.personal_info.name || 'Not provided'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium min-w-24">Mobile:</span>
                  <span>{profile.mobile}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium min-w-24">Gender:</span>
                  <span>{profile.personal_info.gender || 'Not provided'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium min-w-24">Religion:</span>
                  <span>{profile.personal_info.religion || 'Not provided'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium min-w-24">Diet:</span>
                  <span>{profile.personal_info.diet || 'Not provided'}</span>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <span className="font-medium min-w-24">Status:</span>
                <Badge
                  variant={profile.is_user_blocked ? "destructive" : profile.status ? "success" : "warning"}
                  className="capitalize"
                >
                  {profile.is_user_blocked ? 'Blocked' : profile.status ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div>
                <span className="font-medium">Roles:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {profile.roles.map((role) => (
                    <Badge key={role} variant="secondary" className="capitalize">
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seeker Stats Card */}
      {profile.seeker_stats && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              <CardTitle>Seeker Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                {/* Current Status */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Current Status</h3>
                  <div className="space-y-2">
                    <Badge 
                      variant={profile.seeker_stats.user_status.current_status === 'occupied' ? 'destructive' : 'success'}
                      className="capitalize"
                    >
                      {profile.seeker_stats.user_status.current_status}
                    </Badge>
                    <p className="text-sm text-gray-500">{profile.seeker_stats.user_status.reason}</p>
                  </div>
                </div>

                {/* Category Info */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Job Details</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>Working in {profile.seeker_stats.city_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-gray-500" />
                      <div>
                        <div>{profile.seeker_stats.category.category_name}</div>
                        <div className="text-sm text-gray-500">
                          {profile.seeker_stats.category.sub_categories.map(sub => sub.sub_category_name).join(', ')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>{profile.seeker_stats.experience} years experience</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Stats */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Performance Stats</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500">Total Jobs</div>
                      <div className="text-2xl font-semibold">{profile.seeker_stats.total_jobs_done}</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500">Hours Worked</div>
                      <div className="text-2xl font-semibold">{profile.seeker_stats.total_hours_worked}</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500">Total Earned</div>
                      <div className="text-2xl font-semibold">₹{profile.seeker_stats.total_earned}</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500">Rating</div>
                      <div className="text-2xl font-semibold flex items-center gap-1">
                        {profile.seeker_stats.avg_rating.toFixed(1)}
                        <Star className="h-4 w-4 text-yellow-400" />
                      </div>
                      <div className="text-sm text-gray-500">
                        ({profile.seeker_stats.total_reviews} reviews)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Provider Stats Card */}
      {profile.provider_stats && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <UserSquare2 className="h-5 w-5" />
              <CardTitle>Provider Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Location</h3>
                <div className="flex items-center gap-2 mb-6">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>Operating in {profile.provider_stats.city_name}</span>
                </div>

                <h3 className="text-lg font-semibold mb-2">Jobs Overview</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-gray-500" />
                    <span>{profile.provider_stats.total_jobs_posted} jobs posted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserSquare2 className="h-4 w-4 text-gray-500" />
                    <span>{profile.provider_stats.total_jobs_completed} jobs completed</span>
                  </div>
                  <div className="flex items-center gap-2 text-red-500">
                    <Clock className="h-4 w-4" />
                    <span>{profile.provider_stats.total_jobs_cancelled} jobs cancelled</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Performance Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500">Total Spent</div>
                    <div className="text-2xl font-semibold">₹{profile.provider_stats.total_spent}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500">Rating</div>
                    <div className="text-2xl font-semibold flex items-center gap-1">
                      {profile.provider_stats.avg_rating.toFixed(1)}
                      <Star className="h-4 w-4 text-yellow-400" />
                    </div>
                    <div className="text-sm text-gray-500">
                      ({profile.provider_stats.total_reviews} reviews)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}