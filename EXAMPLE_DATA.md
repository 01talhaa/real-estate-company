# Example Data Structure

This document shows the exact JSON structure for projects and events that your admin panel will manage.

## Projects (data/projects.json)

```json
[
  {
    "id": "sabit-khilgaon-block-a",
    "slug": "sabit-khilgaon-block-a",
    "name": {
      "en": "Sabit Khilgaon Residency — Block A",
      "bn": "সাবিত খিলগাঁও রেসিডেন্সি — ব্লক এ"
    },
    "location": {
      "en": "Khilgaon, Dhaka",
      "bn": "খিলগাঁও, ঢাকা"
    },
    "address": {
      "en": "Khilgaon Thana Residential Area, Khilgaon, Dhaka-1219",
      "bn": "খিলগাঁও থানা আবাসিক এলাকা, খিলগাঁও, ঢাকা-১২১৯"
    },
    "coordinates": {
      "lat": 23.7361,
      "lng": 90.428
    },
    "status": "handover",
    "description": {
      "en": "A 6-storey residential building comprising 12 modern flats with quality finishes.",
      "bn": "৬ তলা আবাসিক ভবনে ১২টি আধুনিক ফ্ল্যাট যা মানসম্পন্ন সমাপনী সহ।"
    },
    "longDescription": {
      "en": "Sabit Khilgaon Residency Block A is our flagship completed project with 12 thoughtfully designed flats spread across 6 storeys. Every shareholder received full legal documentation and handed keys on time.",
      "bn": "সাবিত খিলগাঁও রেসিডেন্সি ব্লক এ আমাদের প্রথম সম্পন্ন প্রকল্প যেখানে ১২টি ফ্ল্যাট রয়েছে।"
    },
    "image": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200",
    "gallery": [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=900",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=900"
    ],
    "completionDate": "2023-06-15",
    "progressPercent": 100,
    "flats": 12,
    "floors": 6,
    "specifications": {
      "totalAreaSqft": 850,
      "bedrooms": 3,
      "bathrooms": 2,
      "parkingSpaces": 6,
      "yearBuilt": 2023
    },
    "amenities": {
      "interior": [
        {
          "en": "Ceramic Tile Flooring",
          "bn": "সিরামিক টাইল মেঝে"
        },
        {
          "en": "Built-in Wardrobes",
          "bn": "বিল্ট-ইন আলমারি"
        },
        {
          "en": "Quality Sanitary Fittings",
          "bn": "মানসম্পন্ন স্যানিটারি ফিটিং"
        }
      ],
      "exterior": [
        {
          "en": "Rooftop Access",
          "bn": "ছাদে প্রবেশাধিকার"
        },
        {
          "en": "External Tile Cladding",
          "bn": "বাহ্যিক টাইল আবরণ"
        }
      ],
      "building": [
        {
          "en": "24/7 Security",
          "bn": "২৪/৭ নিরাপত্তা"
        },
        {
          "en": "Main Gate with Guard",
          "bn": "প্রধান গেট ও গার্ড"
        }
      ]
    },
    "financials": {
      "sharePrice": 2500000,
      "pricePerSqft": 2941,
      "currency": "BDT",
      "expectedROI": 15
    },
    "nearbyPlaces": [
      {
        "category": "hospital",
        "name": {
          "en": "Khilgaon General Hospital",
          "bn": "খিলগাঁও জেনারেল হাসপাতাল"
        },
        "distance": "0.5 km"
      },
      {
        "category": "school",
        "name": {
          "en": "Khilgaon Government School",
          "bn": "খিলগাঁও সরকারি স্কুল"
        },
        "distance": "0.3 km"
      },
      {
        "category": "mall",
        "name": {
          "en": "Bashundhara City Shopping Mall",
          "bn": "বসুন্ধরা সিটি শপিং মল"
        },
        "distance": "2 km"
      }
    ],
    "createdAt": "2024-05-13T10:30:00Z",
    "updatedAt": "2024-05-13T10:30:00Z"
  },
  {
    "id": "sabit-khilgaon-block-b",
    "slug": "sabit-khilgaon-block-b",
    "name": {
      "en": "Sabit Khilgaon Residency — Block B",
      "bn": "সাবিত খিলগাঁও রেসিডেন্সি — ব্লক বি"
    },
    "location": {
      "en": "Khilgaon, Dhaka",
      "bn": "খিলগাঁও, ঢাকা"
    },
    "address": {
      "en": "Khilgaon Thana Residential Area, Khilgaon, Dhaka-1219",
      "bn": "খিলগাঁও থানা আবাসিক এলাকা, খিলগাঁও, ঢাকা-১২১৯"
    },
    "coordinates": {
      "lat": 23.7365,
      "lng": 90.4285
    },
    "status": "ongoing",
    "description": {
      "en": "An upcoming 8-storey residential building with 16 modern flats currently under construction.",
      "bn": "একটি নতুন ৮ তলা আবাসিক ভবন যা বর্তমানে নির্মাণাধীন ১৬টি আধুনিক ফ্ল্যাট নিয়ে।"
    },
    "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200",
    "gallery": [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200"
    ],
    "completionDate": "2025-12-31",
    "progressPercent": 65,
    "flats": 16,
    "floors": 8,
    "specifications": {
      "totalAreaSqft": 950,
      "bedrooms": 3,
      "bathrooms": 2,
      "parkingSpaces": 8,
      "yearBuilt": 2025
    },
    "amenities": {
      "interior": [
        {
          "en": "Premium Ceramic Tiles",
          "bn": "প্রিমিয়াম সিরামিক টাইল"
        },
        {
          "en": "Modular Kitchen",
          "bn": "মডুলার রান্নাঘর"
        }
      ],
      "exterior": [
        {
          "en": "Green Space & Garden",
          "bn": "সবুজ স্থান ও বাগান"
        }
      ],
      "building": [
        {
          "en": "Fire Safety System",
          "bn": "অগ্নি নিরাপত্তা ব্যবস্থা"
        }
      ]
    },
    "financials": {
      "sharePrice": 2800000,
      "pricePerSqft": 2947,
      "currency": "BDT",
      "expectedROI": 18
    },
    "nearbyPlaces": [
      {
        "category": "transport",
        "name": {
          "en": "Khilgaon Bus Terminal",
          "bn": "খিলগাঁও বাস টার্মিনাল"
        },
        "distance": "1 km"
      }
    ],
    "createdAt": "2024-05-13T11:00:00Z",
    "updatedAt": "2024-05-13T11:00:00Z"
  }
]
```

## Events (data/events.json)

```json
[
  {
    "id": "project-launch-block-b-2025",
    "title": {
      "en": "Project Launch: Sabit Khilgaon Block B",
      "bn": "প্রকল্প উদ্বোধন: সাবিত খিলগাঁও ব্লক বি"
    },
    "date": "2025-05-15T10:00:00Z",
    "location": {
      "en": "Khilgaon Community Hall, Dhaka",
      "bn": "খিলগাঁও কমিউনিটি হল, ঢাকা"
    },
    "description": {
      "en": "Join us for the official handover ceremony of Sabit Khilgaon Block B. Flat owners will receive their keys, documents, and a guided tour of their new homes.",
      "bn": "সাবিত খিলগাঁও ব্লক বি-এর আনুষ্ঠানিক হস্তান্তর অনুষ্ঠানে যোগ দিন। ফ্ল্যাট মালিকরা তাদের চাবি, কাগজপত্র পাবেন।"
    },
    "type": "launch",
    "registrationLink": "https://wa.me/8801401658685",
    "isUpcoming": true,
    "createdAt": "2024-05-13T12:00:00Z",
    "updatedAt": "2024-05-13T12:00:00Z"
  },
  {
    "id": "investor-meet-q2-2025",
    "title": {
      "en": "Investor Meet — Q2 2025",
      "bn": "বিনিয়োগকারী সভা — দ্বিতীয় প্রান্তিক ২০২৫"
    },
    "date": "2025-06-10T14:00:00Z",
    "location": {
      "en": "Sabit Office, Khilgaon, Dhaka",
      "bn": "সাবিত অফিস, খিলগাঁও, ঢাকা"
    },
    "description": {
      "en": "An exclusive session for current shareholders and prospective investors. Project updates, financial reports, and Q&A with the Board of Directors will be presented.",
      "bn": "বর্তমান শেয়ারহোল্ডার এবং সম্ভাব্য বিনিয়োগকারীদের জন্য একটি বিশেষ অধিবেশন।"
    },
    "type": "investor-meet",
    "registrationLink": "https://wa.me/8801401658685",
    "isUpcoming": true,
    "createdAt": "2024-05-13T12:15:00Z",
    "updatedAt": "2024-05-13T12:15:00Z"
  },
  {
    "id": "community-appreciation-event",
    "title": {
      "en": "Community Appreciation Event",
      "bn": "সম্প্রদায় প্রশংসা অনুষ্ঠান"
    },
    "date": "2025-04-20T16:00:00Z",
    "location": {
      "en": "Khilgaon Community Center",
      "bn": "খিলগাঁও কমিউনিটি সেন্টার"
    },
    "description": {
      "en": "Thank you gathering for our community. Refreshments, networking, and entertainment for all residents and stakeholders.",
      "bn": "আমাদের সম্প্রদায়ের জন্য একটি ধন্যবাদ অনুষ্ঠান। সব বাসিন্দা এবং স্টেকহোল্ডারদের জন্য পানীয় ও বিনোদন।"
    },
    "type": "community",
    "registrationLink": "",
    "isUpcoming": true,
    "createdAt": "2024-05-13T12:30:00Z",
    "updatedAt": "2024-05-13T12:30:00Z"
  },
  {
    "id": "block-a-handover-anniversary",
    "title": {
      "en": "Block A Handover Anniversary Celebration",
      "bn": "ব্লক এ হস্তান্তর বার্ষিকী উদযাপন"
    },
    "date": "2023-06-15T18:00:00Z",
    "location": {
      "en": "Sabit Khilgaon Community Hall",
      "bn": "সাবিত খিলগাঁও কমিউনিটি হল"
    },
    "description": {
      "en": "Celebrating one year of successful handover of Block A with a special appreciation event for all residents.",
      "bn": "ব্লক এ এর সফল হস্তান্তরের এক বছর উদযাপন করছি সব বাসিন্দাদের জন্য বিশেষ অনুষ্ঠান সহ।"
    },
    "type": "announcement",
    "registrationLink": "",
    "isUpcoming": false,
    "createdAt": "2024-05-13T12:45:00Z",
    "updatedAt": "2024-05-13T12:45:00Z"
  }
]
```

## Field Descriptions

### Project Fields

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier (lowercase with hyphens) |
| slug | string | URL-friendly version of id |
| name | BilingualText | Project name in English & Bangla |
| location | BilingualText | Project location (city/area) |
| address | BilingualText | Full postal address |
| coordinates | Object | GPS coordinates (lat, lng) |
| status | enum | "handover", "ongoing", or "upcoming" |
| description | BilingualText | Short description |
| longDescription | BilingualText | Detailed description (optional) |
| image | URL | Featured image URL from Cloudinary |
| gallery | URL[] | Array of gallery image URLs |
| completionDate | ISO String | Completion date (optional) |
| progressPercent | number | 0-100 completion percentage |
| flats | number | Number of residential units |
| floors | number | Number of floors |
| specifications | Object | Building specifications |
| amenities | Object | Interior/exterior/building amenities |
| financials | Object | Pricing and ROI information |
| nearbyPlaces | Object[] | Points of interest nearby |
| createdAt | ISO String | Creation timestamp (auto) |
| updatedAt | ISO String | Last update timestamp (auto) |

### Event Fields

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier (lowercase with hyphens) |
| title | BilingualText | Event title in English & Bangla |
| date | ISO String | Event date and time |
| location | BilingualText | Event location |
| description | BilingualText | Event details |
| type | enum | "launch", "investor-meet", "community", "announcement" |
| registrationLink | URL | Registration/booking link (optional) |
| isUpcoming | boolean | true for upcoming, false for past |
| createdAt | ISO String | Creation timestamp (auto) |
| updatedAt | ISO String | Last update timestamp (auto) |

## Using Example Data

### For Testing
1. Copy the example JSON above
2. Paste into GitHub's web editor for `data/projects.json` and `data/events.json`
3. Commit changes
4. Admin panel will load this data

### Creating Your Data
1. Use the admin panel to create projects and events
2. They'll be stored in `data/projects.json` and `data/events.json`
3. View raw JSON in GitHub to verify structure

### Bilingual Input Format
```
All text fields follow this format:
{
  "en": "English text here",
  "bn": "বাংলা টেক্সট এখানে"
}
```

---

**Note:** All URLs (image URLs) must be valid and publicly accessible. Use Cloudinary or similar service for images.
