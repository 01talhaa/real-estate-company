"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2, Eye } from "lucide-react"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ServiceDocument } from "@/lib/models/Service"

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceDocument[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services')
      const data = await response.json()
      if (data.success) {
        setServices(data.data)
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      const response = await fetch(`/api/services/${deleteId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setServices(services.filter(s => s.id !== deleteId))
        setDeleteId(null)
      }
    } catch (error) {
      console.error('Error deleting service:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#064E3B] text-3xl font-bold text-black">Services Management</h1>
          <p className="text-black mt-2">Manage all your services</p>
        </div>
        <Button asChild className="bg-green-dark hover:  shadow-md">
          <Link href="/admin/services/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Service
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="text-black text-center py-12">Loading services...</div>
      ) : services.length === 0 ? (
        <Card className="border-green-muted bg-white shadow-lg shadow-green-muted/30">
          <CardContent className="py-12">
            <p className="text-black text-center">No services found. Create your first service!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.id} className="border-green-muted bg-white shadow-lg shadow-green-muted/30 hover:shadow-xl hover: transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-black text-lg line-clamp-1">{service.title}</CardTitle>
                {service.tagline && (
                  <p className="text-green-dark text-xs mt-1">{service.tagline}</p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {service.image && (
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <p className="text-black text-sm line-clamp-2">{service.description}</p>
                {service.pricing && (
                  <div className="text-green-dark font-semibold text-sm">{service.pricing}</div>
                )}
                <div className="flex gap-2">
                  <Button asChild size="sm" variant="outline" className="flex-1 bg-white border-green-muted hover:bg-green-muted text-green-dark">
                    <Link href={`/services/${service.id}`} target="_blank">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Link>
                  </Button>
                  <Button asChild size="sm" className="flex-1   ">
                    <Link href={`/admin/services/${service.id}`}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Link>
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => setDeleteId(service.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-white border-green-muted">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-black">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-black">
              This action cannot be undone. This will permanently delete the service.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-green-muted hover:bg-green-muted">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
