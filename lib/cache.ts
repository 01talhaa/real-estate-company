/**
 * Simple in-memory cache for API responses
 * This improves performance by reducing database queries for frequently accessed data
 */

interface CacheEntry<T> {
  data: T
  timestamp: number
  expiresAt: number
}

class ResponseCache {
  private cache: Map<string, CacheEntry<any>> = new Map()
  private defaultTTL = 60 * 1000 // 1 minute default TTL

  /**
   * Get cached data if available and not expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) {
      return null
    }

    // Check if cache is expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return null
    }

    return entry.data as T
  }

  /**
   * Set cache data with optional TTL (time to live in milliseconds)
   */
  set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl,
    }
    
    this.cache.set(key, entry)
  }

  /**
   * Delete specific cache entry
   */
  delete(key: string): void {
    this.cache.delete(key)
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Clear expired entries
   */
  clearExpired(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys()),
    }
  }
}

// Export singleton instance
export const apiCache = new ResponseCache()

// Clear expired entries every 5 minutes
if (typeof window === 'undefined') {
  setInterval(() => {
    apiCache.clearExpired()
  }, 5 * 60 * 1000)
}

/**
 * Helper function to cache API responses
 */
export async function withCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl?: number
): Promise<T> {
  // Try to get from cache first
  const cached = apiCache.get<T>(key)
  if (cached !== null) {
    return cached
  }

  // Fetch fresh data
  const data = await fetchFn()
  
  // Store in cache
  apiCache.set(key, data, ttl)
  
  return data
}

/**
 * Cache TTL presets (in milliseconds)
 */
export const CacheTTL = {
  SHORT: 30 * 1000,      // 30 seconds - for frequently changing data
  MEDIUM: 5 * 60 * 1000,  // 5 minutes - for moderately changing data
  LONG: 30 * 60 * 1000,   // 30 minutes - for rarely changing data
  HOUR: 60 * 60 * 1000,   // 1 hour - for static data
}
