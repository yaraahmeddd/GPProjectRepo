# Security Dashboard API Documentation

## Overview

The Security Dashboard API provides real-time booking information for security personnel at the club. This API allows security staff to view, filter, and search all active and scheduled bookings with member/guest details and ID verification documentation.

## Endpoints

### GET `/api/bookings/security/bookings`

Retrieve all bookings for the security dashboard with comprehensive details.

**URL:** `http://localhost:3000/api/bookings/security/bookings`

**Method:** `GET`

**Query Parameters:**
- `field_id` (string, optional): Filter by field UUID
- `sport_id` (number, optional): Filter by sport ID
- `status` (string, optional): Filter by booking status
  - Values: `pending_payment`, `confirmed`, `completed`, `cancelled`
- `start_date` (string, optional): Filter by start date in format `YYYY-MM-DD`
- `end_date` (string, optional): Filter by end date in format `YYYY-MM-DD`

**Example Requests:**

```bash
# Get all bookings
curl http://localhost:3000/api/bookings/security/bookings

# Get confirmed bookings for a specific field
curl "http://localhost:3000/api/bookings/security/bookings?field_id=uuid-here&status=confirmed"

# Get bookings for a date range
curl "http://localhost:3000/api/bookings/security/bookings?start_date=2026-04-26&end_date=2026-04-27"

# Get bookings for a specific sport
curl "http://localhost:3000/api/bookings/security/bookings?sport_id=1"
```

**Response Format:**

The API returns data in the same format as the `/api/bookings/admin/invitations` endpoint:

```json
{
  "success": true,
  "data": [
    {
      "booking_id": "uuid",
      "share_token": "64-char-token",
      "share_url": "http://localhost:3000/bookings/join/64-char-token",
      "booker": {
        "name": "أحمد محمد علي",
        "type": "member",
        "phone": "01012345678",
        "email": null
      },
      "booking_date": "2026-04-26T14:00:00.000Z",
      "booking_time": {
        "start": "14:00",
        "end": "15:30",
        "duration_minutes": 90
      },
      "sport": {
        "name_ar": "كرة القدم",
        "name_en": "Football"
      },
      "field": {
        "name_ar": "ملعب كرة القدم 1",
        "name_en": "Football Field 1"
      },
      "participants": [
        {
          "id": "uuid",
          "full_name": "أحمد محمد علي",
          "phone_number": "01012345678",
          "email": null,
          "national_id": "123456789",
          "national_id_front": "http://localhost:3000/Backend/uploads/national-ids/participants/id_front-xxx.jpg",
          "national_id_back": "http://localhost:3000/Backend/uploads/national-ids/participants/id_back-xxx.jpg",
          "is_creator": true,
          "registered_at": "2026-04-26T10:30:00.000Z"
        },
        {
          "id": "uuid",
          "full_name": "محمود سامي",
          "phone_number": "01198765432",
          "email": "guest@example.com",
          "national_id": null,
          "national_id_front": null,
          "national_id_back": null,
          "is_creator": false,
          "registered_at": "2026-04-26T11:00:00.000Z"
        }
      ],
      "stats": {
        "expected_participants": 4,
        "registered_count": 2,
        "remaining_slots": 2,
        "is_full": false
      },
      "status": "confirmed",
      "payment_status": "completed",
      "created_at": "2026-04-26T10:30:00.000Z"
    }
  ],
  "count": 1
}
```

### Response Fields Documentation:

Each booking object includes:

| Field | Type | Description |
|-------|------|-------------|
| `booking_id` | string | Unique booking identifier (UUID) |
| `share_token` | string | 64-character token for sharing booking via public link |
| `share_url` | string | Full URL to share booking with guests |
| `booker.name` | string | Full name of booking creator |
| `booker.type` | string | Type: `"member"` or `"team_member"` |
| `booker.phone` | string or null | Phone number of booking creator |
| `booker.email` | string or null | Email of booking creator |
| `booking_time.start` | string | Start time in HH:MM format (24-hour) |
| `booking_time.end` | string | End time in HH:MM format (24-hour) |
| `booking_time.duration_minutes` | number | Duration in minutes |
| `sport.name_ar` | string | Arabic name of sport |
| `sport.name_en` | string | English name of sport |
| `field.name_ar` | string | Arabic name of field |
| `field.name_en` | string | English name of field |
| `participants[].id` | string | Participant ID (UUID) |
| `participants[].full_name` | string | Participant full name |
| `participants[].phone_number` | string or null | Phone number |
| `participants[].email` | string or null | Email address |
| `participants[].national_id` | string or null | National ID number |
| `participants[].national_id_front` | string or null | URL to front side of ID photo |
| `participants[].national_id_back` | string or null | URL to back side of ID photo |
| `participants[].is_creator` | boolean | True if this is the booking creator |
| `stats.expected_participants` | number | Total expected participants |
| `stats.registered_count` | number | Number of registered participants |
| `stats.remaining_slots` | number | Available slots remaining |
| `stats.is_full` | boolean | Whether booking is at full capacity |
| `status` | string | Booking status (`pending_payment`, `confirmed`, `completed`, `cancelled`) |
| `payment_status` | string | Payment status (`completed` or `pending`) |
| `created_at` | string | ISO timestamp when booking was created |

## Frontend Integration

### Using the React Hook

The frontend provides a custom React hook for easy integration:

```typescript
import { useSecurityDashboardBookings, type DisplayBooking } from '../hooks/useSecurityDashboardBookings';

function MyComponent() {
  const { 
    displayBookings,  // Array of DisplayBooking objects (formatted for display)
    loading,          // boolean indicating if data is being fetched
    error,            // string or null if there's an error
    refetch           // function to manually refetch data
  } = useSecurityDashboardBookings({
    fieldId: 'optional-field-uuid',
    sportId: 1,
    status: 'confirmed',
    startDate: '2026-04-26',
    endDate: '2026-04-27'
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {displayBookings.map(booking => (
        <div key={booking.id}>
          <h3>{booking.personName}</h3>
          <p>Time: {booking.startTime} - {booking.endTime}</p>
          <p>Location: {booking.fieldName}</p>
          <p>Guests: {booking.guests.length}</p>
          {booking.frontIdUrl && (
            <img src={booking.frontIdUrl} alt="ID Front" />
          )}
        </div>
      ))}
    </div>
  );
}
```

## Data Flow

### Backend Architecture

1. **Database Layer** (`entities/`)
   - `Booking` entity: Core booking information
   - `BookingParticipant` entity: Participant details including ID photo paths

2. **Service Layer** (`services/BookingService.ts`)
   - `getSecurityDashboardBookings()` method
   - Joins bookings with participants, fields, and sports data
   - Transforms database format to admin invitations API format
   - Calculates participation statistics (expected, registered, remaining, is_full)
   - Normalizes image URLs from local paths to full HTTP URLs

3. **Controller Layer** (`controllers/BookingController.ts`)
   - `getSecurityDashboardBookings()` endpoint handler
   - Validates query parameters
   - Constructs base URL for image normalization
   - Returns JSON response with `success` flag

4. **Router** (`routes/BookingRoutes.ts`)
   - Maps `/api/bookings/security/bookings` GET request to controller

### Frontend Architecture

1. **Hook** (`hooks/useSecurityDashboardBookings.ts`)
   - Defines `SecurityBooking` interface (API response format)
   - Defines `DisplayBooking` interface (component-ready format)
   - Fetches from `/api/bookings/security/bookings` endpoint
   - Transforms API response to display format via `transformBookingForDisplay()`
   - Manages loading, error, and success states
   - Provides refetch functionality
   - Returns both raw `bookings` and formatted `displayBookings`

2. **Component** (`SecurityDashboardPage.tsx`)
   - Uses `displayBookings` from hook (already transformed)
   - Falls back to mock data during loading/errors
   - Displays bookings with filtering and searching
   - Shows booking details in modal with participant list
   - Displays ID photos in fullscreen lightbox
   - Provides download functionality for ID photos

### Data Transformation Layer

The hook includes a `transformBookingForDisplay()` function that converts from API format to component format:
- API format has nested objects (booker, booking_time, sport, field, participants, stats)
- Display format flattens relevant fields (personName, startTime, fieldName, guests, etc.)
- Image URLs are already normalized to HTTP at API level
- Guest list is extracted from participants (excluding is_creator=true)

## Features

### Booking Display
- Real-time booking list sorted by start time
- Current and upcoming bookings (highlighted separately)
- Past completed bookings
- All day schedule grid view

### Filtering & Search
- Filter by sport type
- Search by member name or phone number
- Filter by booking ID
- Active filter indicators with clear button

### Member Details
- Full booking information popup
- Guest list with contact details
- ID verification photos (front and back)
- Membership tier information
- Booking status

### ID Photo Viewer
- Full-screen lightbox view
- Download functionality
- Photo metadata display
- Secure access warning

## Image URL Handling

The API automatically constructs full URLs for ID photos:

**Storage:** Photos are stored in the local filesystem at:
```
Backend/uploads/national-ids/participants/id_front-{timestamp}.jpg
Backend/uploads/national-ids/participants/id_back-{timestamp}.jpg
```

**Database:** Only the relative path is stored:
```
uploads/national-ids/participants/id_front-{timestamp}.jpg
```

**API Response:** The hook returns full URLs:
```
http://localhost:3000/uploads/national-ids/participants/id_front-{timestamp}.jpg
```

This is handled automatically by the `normalizeImageUrl()` function in the service layer.

## Error Handling

### API Error Responses

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

**Common Error Scenarios:**
- Invalid query parameter format
- Database connection failure
- File system errors accessing photos
- Timeout fetching large result sets

### Frontend Error Handling

The hook provides error information:
```typescript
const { error } = useSecurityDashboardBookings();

if (error) {
  console.error('API Error:', error);
  // Display error UI to user
}
```

The SecurityDashboardPage displays:
- Loading spinner during fetch
- Error message with retry button
- Empty state when no bookings match filters
- Graceful degradation to mock data during errors

## Testing

### Manual Testing Steps

1. **Start Backend Server:**
   ```bash
   cd Backend
   npm start
   ```

2. **Start Frontend:**
   ```bash
   npm run dev
   ```

3. **Test API Directly:**
   ```bash
   # Using curl or Postman
   curl http://localhost:3000/api/bookings/security/bookings
   ```

4. **Test Frontend Component:**
   - Navigate to Security Dashboard page
   - Verify bookings load
   - Try filters and search
   - Click booking to view details
   - Click ID photos to view in lightbox

### Mock Data Fallback

During development/testing, if the API is unavailable, the page automatically falls back to generated mock data with realistic examples:
- Multiple bookings at different times
- Various member types
- Guest participants
- ID photo URLs (uses placeholder service)

## Performance Considerations

- Bookings sorted by start time on backend (more efficient)
- Participants eagerly loaded (reduces N+1 queries)
- Image URLs normalized once per API call
- Results cached in React state
- Search/filter debounced to 300ms on frontend

## Security Notes

- ID photos are served over HTTP (consider HTTPS in production)
- Endpoint should require authentication middleware in production
- Consider rate limiting for API access
- Image download functionality can be audited/logged
- All data is read-only from security dashboard (no write operations)

## Future Enhancements

- [ ] Real-time updates via WebSocket
- [ ] Export bookings to CSV/PDF
- [ ] Advanced search (date range, multiple sports, etc.)
- [ ] Booking check-in/check-out functionality
- [ ] Integration with access control systems
- [ ] Audit logging for security access
- [ ] Mobile-responsive optimization
