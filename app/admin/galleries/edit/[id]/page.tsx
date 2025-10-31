import GalleryForm from '@/components/gallery-form'

export default function EditGalleryPage({ params }: { params: { id: string } }) {
  return <GalleryForm galleryId={params.id} />
}
