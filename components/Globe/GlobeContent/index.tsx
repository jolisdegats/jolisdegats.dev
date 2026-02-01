'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import earthTextureFile from '@/assets/earth-blue-marble.jpg'

export interface VisitedCountry {
  name: string
  lat: number
  lon: number
}

export const visitedCountries: VisitedCountry[] = [
  // Europe
  { name: 'France', lat: 46.2276, lon: 2.2137 },
  { name: 'Spain', lat: 28.2916, lon: -16.6291 },
  { name: 'Barcelona', lat: 41.3851, lon: 2.1734 },
  { name: 'Italy', lat: 41.8719, lon: 12.5674 },
  { name: 'Belgium', lat: 50.5039, lon: 4.4699 },
  { name: 'Denmark', lat: 56.2639, lon: 9.5018 },
  { name: 'London', lat: 51.5074, lon: -0.1278 },
  { name: 'Greece', lat: 39.0742, lon: 21.8243 },
  { name: 'Montenegro', lat: 42.7087, lon: 19.3744 },

  // North America
  { name: 'San Francisco', lat: 37.7749, lon: -122.4194 },
  { name: 'Quebec', lat: 46.8139, lon: -71.208 },
  { name: 'Calgary', lat: 51.0447, lon: -114.0719 },
  { name: 'Mexico', lat: 23.6345, lon: -102.5528 },
  { name: 'Dominican Republic', lat: 18.7357, lon: -70.1627 },

  // South America
  { name: 'Colombia', lat: 4.5709, lon: -74.2973 },

  // Asia/Middle East
  { name: 'Turkey', lat: 38.9637, lon: 35.2433 },
  { name: 'Bali', lat: -8.3405, lon: 115.092 },
  { name: 'Thailand', lat: 15.8700, lon: 100.9925 },
  { name: 'Singapore', lat: 1.3521, lon: 103.8198 },

  // Africa
  { name: 'Morocco', lat: 31.7917, lon: -7.0926 },
  { name: 'Tunisia', lat: 33.8869, lon: 9.5375 }
]

const Globe = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const earthRef = useRef<THREE.Mesh | null>(null)
  const markersRef = useRef<THREE.Group | null>(null)
  const animationIdRef = useRef<number | null>(null)
  const isDraggingRef = useRef(false)
  const previousMousePositionRef = useRef({ x: 0, y: 0 })
  const autoRotateRef = useRef(true)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 3
    cameraRef.current = camera

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 3, 5)
    scene.add(directionalLight)

    // Create Earth
    const geometry = new THREE.SphereGeometry(1, 64, 64)

    // Load earth texture from CDN
    const textureLoader = new THREE.TextureLoader()
    const earthTexture = textureLoader.load(
      earthTextureFile.src
    )

    const material = new THREE.MeshPhongMaterial({
      map: earthTexture,
      bumpScale: 0.05,
      specular: new THREE.Color(0x333333),
      shininess: 5
    })

    const earth = new THREE.Mesh(geometry, material)
    scene.add(earth)
    earthRef.current = earth

       // Set initial rotation to center on France
       const initialRotation = {x : 0.5, y: 4.65}
       earth.rotation.x = initialRotation.x
       earth.rotation.y = initialRotation.y
 

    // Create atmosphere glow
    const atmosphereGeometry = new THREE.SphereGeometry(1.05, 64, 64)
    const atmosphereMaterial = new THREE.MeshPhongMaterial({
      color: 0x4a90d9,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide
    })
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial)
    scene.add(atmosphere)

    // Create markers group and add to earth so they rotate with it
    const markersGroup = new THREE.Group()
    markersRef.current = markersGroup
    earth.add(markersGroup) // Add to earth, not scene!

    // Add markers for visited countries
    visitedCountries.forEach((country) => {
      // Create flat disc marker
      const discGeometry = new THREE.CircleGeometry(0.015, 32)
      const discMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x00ffff,
        side: THREE.DoubleSide
      })
      const marker = new THREE.Mesh(discGeometry, discMaterial)

      // Convert lat/lon to 3D position (on earth surface, radius = 1.0)
      const phi = (90 - country.lat) * (Math.PI / 180)
      const theta = (country.lon + 180) * (Math.PI / 180)

      const position = {
        x: -Math.sin(phi) * Math.cos(theta),
        y: Math.cos(phi),
        z: Math.sin(phi) * Math.sin(theta)
      }

      // Calculate normal vector (outward from center)
      const normal = new THREE.Vector3(position.x, position.y, position.z).normalize()

      // Position disc on surface
      marker.position.set(
        position.x * 1.01,
        position.y * 1.01,
        position.z * 1.01
      )
      // Orient disc to face outward (tangent to sphere)
      marker.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal)

      // Add to markers group (which is child of earth)
      markersGroup.add(marker)
    })

    // Mouse event handlers for drag rotation
    const handleMouseDown = (event: MouseEvent) => {
      isDraggingRef.current = true
      autoRotateRef.current = false
      previousMousePositionRef.current = {
        x: event.clientX,
        y: event.clientY
      }
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDraggingRef.current || !earthRef.current) return

      const deltaMove = {
        x: event.clientX - previousMousePositionRef.current.x,
        y: event.clientY - previousMousePositionRef.current.y
      }

      const rotateSpeed = 0.005
      earthRef.current.rotation.y += deltaMove.x * rotateSpeed
      earthRef.current.rotation.x += deltaMove.y * rotateSpeed

      previousMousePositionRef.current = {
        x: event.clientX,
        y: event.clientY
      }
    }

    const handleMouseUp = () => {
      isDraggingRef.current = false
      // Resume auto-rotation after a delay
      setTimeout(() => {
        autoRotateRef.current = true
      }, 3000)
    }

    // Touch event handlers for mobile
    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 1) {
        isDraggingRef.current = true
        autoRotateRef.current = false
        previousMousePositionRef.current = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY
        }
      }
    }

    const handleTouchMove = (event: TouchEvent) => {
      if (!isDraggingRef.current || !earthRef.current || event.touches.length !== 1)
        return

      const deltaMove = {
        x: event.touches[0].clientX - previousMousePositionRef.current.x,
        y: event.touches[0].clientY - previousMousePositionRef.current.y
      }

      const rotateSpeed = 0.005
      earthRef.current.rotation.y += deltaMove.x * rotateSpeed
      earthRef.current.rotation.x += deltaMove.y * rotateSpeed

      previousMousePositionRef.current = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
      }
    }

    const handleTouchEnd = () => {
      isDraggingRef.current = false
      setTimeout(() => {
        autoRotateRef.current = true
      }, 3000)
    }

    // Add event listeners
    const container = containerRef.current
    container.addEventListener('mousedown', handleMouseDown)
    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseup', handleMouseUp)
    container.addEventListener('mouseleave', handleMouseUp)
    container.addEventListener('touchstart', handleTouchStart)
    container.addEventListener('touchmove', handleTouchMove)
    container.addEventListener('touchend', handleTouchEnd)

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate)

      if (earthRef.current && autoRotateRef.current) {
        earthRef.current.rotation.y += 0.001
      }

      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return

      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight

      cameraRef.current.aspect = width / height
      cameraRef.current.updateProjectionMatrix()

      rendererRef.current.setSize(width, height)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      container.removeEventListener('mousedown', handleMouseDown)
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseup', handleMouseUp)
      container.removeEventListener('mouseleave', handleMouseUp)
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)

      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement)
        rendererRef.current.dispose()
      }
    }
  }, [visitedCountries])

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[400px]"
      style={{ width: '100%', height: '100%' }}
    />
  )
}

export default Globe