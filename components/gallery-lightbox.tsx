"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import Image from "next/image"
import {
  X, ZoomIn, ZoomOut, RotateCcw, ChevronLeft, ChevronRight, Maximize2,
} from "lucide-react"

// ─── Types ───────────────────────────────────────────────────────────────────

interface GalleryLightboxProps {
  images: string[]
  startIndex?: number
  projectName: string
  onClose: () => void
}

// ─── Lightbox Modal ───────────────────────────────────────────────────────────

export function GalleryLightbox({
  images,
  startIndex = 0,
  projectName,
  onClose,
}: GalleryLightboxProps) {
  const [current, setCurrent] = useState(startIndex)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [slideDir, setSlideDir] = useState<"left" | "right" | null>(null)

  const dragStart = useRef<{ x: number; y: number } | null>(null)
  const panStart = useRef({ x: 0, y: 0 })
  const overlayRef = useRef<HTMLDivElement>(null)

  // ── Reset zoom/pan when image changes ──
  const resetView = useCallback(() => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }, [])

  // ── Navigate ─────────────────────────────────────────────────────────────
  const navigate = useCallback(
    (direction: "prev" | "next") => {
      if (isAnimating) return
      setSlideDir(direction === "next" ? "left" : "right")
      setIsAnimating(true)
      resetView()
      setTimeout(() => {
        setCurrent((c) =>
          direction === "next"
            ? (c + 1) % images.length
            : (c - 1 + images.length) % images.length
        )
        setSlideDir(null)
        setIsAnimating(false)
      }, 220)
    },
    [images.length, isAnimating, resetView]
  )

  // ── Keyboard ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight") navigate("next")
      if (e.key === "ArrowLeft") navigate("prev")
      if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(z + 0.25, 4))
      if (e.key === "-") setZoom((z) => Math.max(z - 0.25, 0.5))
      if (e.key === "0") resetView()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [navigate, onClose, resetView])

  // ── Lock body scroll ──────────────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [])

  // ── Mouse drag for pan ────────────────────────────────────────────────────
  const onMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return
    e.preventDefault()
    setIsDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY }
    panStart.current = { ...pan }
  }

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragStart.current) return
    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y
    setPan({ x: panStart.current.x + dx, y: panStart.current.y + dy })
  }

  const onMouseUp = () => {
    setIsDragging(false)
    dragStart.current = null
  }

  // ── Touch drag for pan ────────────────────────────────────────────────────
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return
    const touch = e.touches[0]
    dragStart.current = { x: touch.clientX, y: touch.clientY }
    panStart.current = { ...pan }
    setIsDragging(true)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !dragStart.current || e.touches.length !== 1) return
    const touch = e.touches[0]
    const dx = touch.clientX - dragStart.current.x
    const dy = touch.clientY - dragStart.current.y
    setPan({ x: panStart.current.x + dx, y: panStart.current.y + dy })
  }

  const onTouchEnd = () => {
    setIsDragging(false)
    dragStart.current = null
  }

  // ── Wheel zoom ─────────────────────────────────────────────────────────────
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.15 : 0.15
    setZoom((z) => Math.min(Math.max(z + delta, 0.5), 4))
  }

  // ── Click backdrop to close ────────────────────────────────────────────────
  const onOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose()
  }

  const slideStyle: React.CSSProperties = {
    transform: `
      translateX(${slideDir === "left" ? "-6%" : slideDir === "right" ? "6%" : "0"})
      scale(${isAnimating ? 0.96 : 1})
    `,
    opacity: isAnimating ? 0 : 1,
    transition: "transform 0.22s cubic-bezier(0.4,0,0.2,1), opacity 0.22s ease",
  }

  return (
    <div
      ref={overlayRef}
      onClick={onOverlayClick}
      style={{ zIndex: 9999 }}
      className="fixed inset-0 flex flex-col items-center justify-center"
    >
      {/* Blurred backdrop */}
      <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" />

      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full flex items-center justify-between px-4 sm:px-8 py-4">
        <div>
          <p className="text-white/40 text-xs uppercase tracking-widest font-semibold">
            Photo Gallery
          </p>
          <p className="text-white/80 text-sm font-bold truncate max-w-[200px] sm:max-w-none">
            {projectName}
          </p>
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom((z) => Math.max(z - 0.25, 0.5))}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-white/60 text-xs font-mono w-10 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(z + 0.25, 4))}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={resetView}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Reset view"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Counter */}
          <div className="hidden sm:flex items-center gap-1 bg-white/10 rounded-full px-3 py-1 ml-2">
            <Maximize2 className="w-3 h-3 text-white/50" />
            <span className="text-white/70 text-xs font-bold">
              {current + 1} / {images.length}
            </span>
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-red-500/80 text-white transition-colors ml-2"
            aria-label="Close gallery"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ── Main image area ──────────────────────────────────────────────── */}
      <div className="relative z-10 flex-1 w-full flex items-center justify-center overflow-hidden px-14 sm:px-20">
        {/* Prev */}
        <button
          onClick={() => navigate("prev")}
          className="absolute left-2 sm:left-4 z-20 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/10 border border-white/10 hover:bg-white/25 text-white transition-all shadow-2xl backdrop-blur-sm"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Image wrapper */}
        <div
          className="w-full h-full flex items-center justify-center overflow-hidden"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onWheel={onWheel}
          style={{
            ...slideStyle,
            cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default",
          }}
        >
          <div
            style={{
              transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
              transition: isDragging ? "none" : "transform 0.2s cubic-bezier(0.4,0,0.2,1)",
              transformOrigin: "center center",
              maxHeight: "100%",
              maxWidth: "100%",
              position: "relative",
            }}
          >
            <Image
              src={images[current]}
              alt={`${projectName} – ${current + 1}`}
              width={1600}
              height={1000}
              className="max-h-[68vh] w-auto object-contain rounded-lg shadow-2xl select-none"
              draggable={false}
              priority
              style={{ display: "block" }}
            />
          </div>
        </div>

        {/* Next */}
        <button
          onClick={() => navigate("next")}
          className="absolute right-2 sm:right-4 z-20 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/10 border border-white/10 hover:bg-white/25 text-white transition-all shadow-2xl backdrop-blur-sm"
          aria-label="Next image"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* ── Thumbnail strip ──────────────────────────────────────────────── */}
      <div className="relative z-10 w-full px-4 sm:px-8 pb-5 pt-3">
        <div className="flex items-center justify-center gap-2 overflow-x-auto scrollbar-none pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => {
                resetView()
                setCurrent(i)
              }}
              className={`shrink-0 relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden transition-all duration-200 ${
                i === current
                  ? "ring-2 ring-white scale-110 opacity-100"
                  : "opacity-40 hover:opacity-70 scale-100"
              }`}
              aria-label={`Go to image ${i + 1}`}
            >
              <Image
                src={img}
                alt={`Thumbnail ${i + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
        {/* Mobile counter */}
        <p className="sm:hidden text-center text-white/40 text-xs mt-2 font-mono">
          {current + 1} / {images.length}
        </p>
      </div>

      {/* ── Hint ─────────────────────────────────────────────────────────── */}
      <p className="absolute bottom-1 left-1/2 -translate-x-1/2 text-white/20 text-[10px] font-medium select-none pointer-events-none">
        Scroll to zoom · Drag to pan · ← → to navigate · Esc to close
      </p>
    </div>
  )
}

// ─── Gallery Grid (triggers lightbox) ────────────────────────────────────────

interface GalleryGridProps {
  images: string[]
  projectName: string
}

export function GalleryGrid({ images, projectName }: GalleryGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (!images || images.length === 0) return null

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Large first image */}
        <button
          onClick={() => setLightboxIndex(0)}
          className="col-span-2 row-span-2 relative rounded-2xl overflow-hidden aspect-square group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#064E3B]"
          aria-label={`View ${projectName} gallery image 1`}
        >
          <Image
            src={images[0]}
            alt={`${projectName} - 1`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(min-width: 768px) 50vw, 100vw"
            priority
          />
          {/* Overlay hint */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/20 backdrop-blur-sm rounded-full p-3 border border-white/30">
              <ZoomIn className="w-6 h-6 text-white" />
            </div>
          </div>
        </button>

        {images.slice(1, 5).map((img, i) => {
          const isLast = i === 3 && images.length > 5
          return (
            <button
              key={i}
              onClick={() => setLightboxIndex(i + 1)}
              className="relative rounded-2xl overflow-hidden aspect-square group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#064E3B]"
              aria-label={`View ${projectName} gallery image ${i + 2}`}
            >
              <Image
                src={img}
                alt={`${projectName} - ${i + 2}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(min-width: 768px) 25vw, 50vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                {isLast ? (
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                    <span className="text-white font-black text-2xl">+{images.length - 5}</span>
                    <span className="text-white/70 text-xs font-semibold mt-1">more photos</span>
                  </div>
                ) : (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/20 backdrop-blur-sm rounded-full p-2.5 border border-white/30">
                    <ZoomIn className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* "View all" button if more than 5 */}
      {images.length > 5 && (
        <button
          onClick={() => setLightboxIndex(0)}
          className="mt-4 w-full py-3 rounded-xl border-2 border-dashed border-gray-200 text-gray-500 text-sm font-semibold hover:border-[#064E3B] hover:text-[#064E3B] transition-colors flex items-center justify-center gap-2"
        >
          <Maximize2 className="w-4 h-4" />
          View all {images.length} photos
        </button>
      )}

      {/* Lightbox portal */}
      {lightboxIndex !== null && (
        <GalleryLightbox
          images={images}
          startIndex={lightboxIndex}
          projectName={projectName}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  )
}
