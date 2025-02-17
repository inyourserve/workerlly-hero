'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Eye, Pencil, Trash2, ThumbsUp, ThumbsDown } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function ReviewManagementPage() {
  const [reviews, setReviews] = useState([
    { id: 1, user: 'John Doe', worker: 'Jane Smith', rating: 4, comment: 'Great service, very professional!', status: 'Approved', date: '2023-06-15' },
    { id: 2, user: 'Alice Johnson', worker: 'Bob Williams', rating: 2, comment: 'Service was delayed and not up to the mark.', status: 'Pending', date: '2023-06-14' },
    { id: 3, user: 'Emma Brown', worker: 'Charlie Davis', rating: 5, comment: 'Excellent work! Highly recommended.', status: 'Approved', date: '2023-06-13' },
  ])

  const [editingReview, setEditingReview] = useState<null | { id: number, status: string, comment: string }>(null)

  const handleEditReview = () => {
    if (editingReview) {
      setReviews(reviews.map(review => 
        review.id === editingReview.id ? { ...review, ...editingReview } : review
      ))
      setEditingReview(null)
    }
  }

  const handleDeleteReview = (id: number) => {
    setReviews(reviews.filter(review => review.id !== id))
  }

  const handleApproveReview = (id: number) => {
    setReviews(reviews.map(review => 
      review.id === id ? { ...review, status: 'Approved' } : review
    ))
  }

  const handleRejectReview = (id: number) => {
    setReviews(reviews.map(review => 
      review.id === id ? { ...review, status: 'Rejected' } : review
    ))
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Review Management</h1>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Reviews</TabsTrigger>
          <TabsTrigger value="pending">Pending Reviews</TabsTrigger>
          <TabsTrigger value="approved">Approved Reviews</TabsTrigger>
          <TabsTrigger value="rejected">Rejected Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <Input placeholder="Search reviews..." className="flex-grow" />
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Worker</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell>{review.user}</TableCell>
                      <TableCell>{review.worker}</TableCell>
                      <TableCell>{review.rating} / 5</TableCell>
                      <TableCell>{review.comment.length > 50 ? `${review.comment.substring(0, 50)}...` : review.comment}</TableCell>
                      <TableCell>
                        <Badge variant={review.status === 'Approved' ? "success" : review.status === 'Pending' ? "warning" : "destructive"}>
                          {review.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{review.date}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Eye className="mr-2 h-4 w-4" /> View
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Review Details</DialogTitle>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label className="text-right">User</Label>
                                  <div className="col-span-3">{review.user}</div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label className="text-right">Worker</Label>
                                  <div className="col-span-3">{review.worker}</div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label className="text-right">Rating</Label>
                                  <div className="col-span-3">{review.rating} / 5</div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label className="text-right">Comment</Label>
                                  <div className="col-span-3">{review.comment}</div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label className="text-right">Status</Label>
                                  <div className="col-span-3">
                                    <Badge variant={review.status === 'Approved' ? "success" : review.status === 'Pending' ? "warning" : "destructive"}>
                                      {review.status}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label className="text-right">Date</Label>
                                  <div className="col-span-3">{review.date}</div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Pencil className="mr-2 h-4 w-4" /> Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Review</DialogTitle>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="edit-status" className="text-right">
                                    Status
                                  </Label>
                                  <Select onValueChange={(value: string) => setEditingReview(prev => prev ? { ...prev, status: value } : null)}>
                                    <SelectTrigger className="col-span-3">
                                      <SelectValue placeholder={editingReview?.status} />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Approved">Approved</SelectItem>
                                      <SelectItem value="Pending">Pending</SelectItem>
                                      <SelectItem value="Rejected">Rejected</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="edit-comment" className="text-right">
                                    Comment
                                  </Label>
                                  <Textarea
                                    id="edit-comment"
                                    value={editingReview?.comment || ''}
                                    onChange={(e) => setEditingReview(prev => prev ? { ...prev, comment: e.target.value } : null)}
                                    className="col-span-3"
                                  />
                                </div>
                              </div>
                              <Button onClick={handleEditReview}>Save Changes</Button>
                            </DialogContent>
                          </Dialog>
                          {review.status === 'Pending' && (
                            <>
                              <Button variant="default" size="sm" onClick={() => handleApproveReview(review.id)}>
                                <ThumbsUp className="mr-2 h-4 w-4" /> Approve
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => handleRejectReview(review.id)}>
                                <ThumbsDown className="mr-2 h-4 w-4" /> Reject
                              </Button>
                            </>
                          )}
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteReview(review.id)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add content for pending reviews */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved">
          <Card>
            <CardHeader>
              <CardTitle>Approved Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add content for approved reviews */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected">
          <Card>
            <CardHeader>
              <CardTitle>Rejected Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add content for rejected reviews */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

