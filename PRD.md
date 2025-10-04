# Bar System PRD - K.Ö.H.V. Mercuria

## Project Overview

A web application for managing drink tabs at K.Ö.H.V. Mercuria, a Vienna-based student fraternity. The system tracks member orders during bar sessions, manages tabs, and facilitates semester-based payment collection.

## Core Entities

### Members Collection
- **First Name** (required)
- **Last Name** (required)
- **Couleurname** - fraternity nickname (required)
- **Profile Picture** (optional)
- **Rank** - Either "Bursche" or "Fuchs" (required)
- **Rank Colors** - Three hex color values forming a flag:
  - **Bursche**: #A57D42, #E10909, #FFFFFF
  - **Fuchs**: #E10909, #FFFFFF, #E10909
- **Tab Balance** - Current debt amount
- **Payment History** - Full log of all payments and penalties

### Drinks Collection
- **Name** (required)
- **Price** (required)
- **Category** (optional - e.g., Beer, Spirits, Soft Drinks)
- **Available** - Boolean to enable/disable drinks

### Sessions Collection
- **Session Number/Name** (auto-generated or manual)
- **Status** - "Active" or "Closed"
- **Created By** - Reference to the user/admin who opened the session (required)
- **Start Time** (timestamp)
- **End Time** (timestamp, null if active)
- **Bartenders** - Array of member references (defined BEFORE session opens)
  - Member reference
  - Estimated start time
  - Estimated end time
  - Status - "Active", "Pending" (requested during session), "Approved"
- **Orders** - All orders placed during this session (relationship or embedded)
- **Total Revenue** - Calculated from orders
- **Statistics** - Total drinks sold, most popular drinks, etc.

**Constraints**:
- Only ONE session can be active at a time (globally, device-independent)
- Bartenders must be defined before session activation
- Session is shared across ALL devices - new devices join the existing active session

### Orders Collection
- **Session** - Reference to session (required)
- **Member** - Who is being charged (required)
- **Bartender** - Who placed the order (required)
- **Items** - Array of drink items
  - Drink reference
  - Quantity
  - Price at time of order (historical pricing)
- **Total Amount** (calculated)
- **Timestamp** (auto-generated)
- **Status** - "Pending", "Completed", "Cancelled"

### Payments Collection (History/Log)
- **Member** - Reference (required)
- **Amount** - Can be positive (payment) or negative (penalty)
- **Type** - "Payment", "Penalty", "Adjustment"
- **Date** (timestamp)
- **Notes** - Admin notes about the transaction
- **Admin** - Who processed it (user reference)

## User Roles & Authentication

### Authentication
- **All pages require login** - No public access
- Use PayloadCMS built-in authentication

### Roles
1. **Admin**
   - Full access to Payload backend
   - Can register and manage members
   - Can open/close sessions
   - Can manage payments and penalties
   - Can view all historical data

2. **Bartender** (session-based role)
   - Selected from Members collection when creating a session (BEFORE activation)
   - Can place orders during their assigned session from any device
   - Multiple bartenders can work simultaneously from different devices
   - Can view current session information
   - Non-bartenders can request to be added during an active session
   - Limited to active session only

3. **Member** (default)
   - Can view their own tab balance
   - Can view price list
   - Can view current session info
   - Cannot place orders (must go through bartender)

## Main Pages (Frontend - ShadCN Components)

### 1. Price List Page (`/prices`)
- Display all available drinks with prices
- Categorized view (optional grouping)
- **Ordering Flow** (ONLY available during active session, bartenders only):
  - Add drinks to cart
  - Select member who will be charged
  - Review cart and total
  - Confirm order → Creates order record, updates member tab
- **When no session is active**: View-only mode, no cart/ordering functionality

### 2. Session Information Page (`/session`)
- **Current Session Details**:
  - Session start time
  - Active bartenders with estimated work times
  - Orders placed during session (real-time or refreshable)
  - Session statistics (total revenue, drinks sold count)
  - Most popular drinks during session
- **Historical Sessions** (archive view):
  - List all past sessions
  - Filter/search by date, bartenders
  - View-only mode for closed sessions

### 3. Members Page (`/members`)
- **Member List** (admin view):
  - Display all members with profile pictures
  - Show couleurname, rank, and rank colors (as visual flag/badge)
  - Show current tab balance
  - Click to view detailed member page

- **Member Detail Page** (`/members/[id]`):
  - Profile information
  - Current tab balance (highlighted if overdue)
  - Order history
  - Payment history with full log
  - Admin actions:
    - Record payment (full or partial)
    - Add penalty
    - Edit member details

## Key Workflows

### Opening a Session (Admin)
1. Check no session is currently active
2. Create new session
3. **Select bartenders from members list** (minimum 1 must be done before activation)
4. Set estimated work times for each bartender
5. Activate session
6. Session is now available on ALL devices

### Joining an Active Session (Any Device)
1. User logs in on a new device
2. System detects active session exists
3. **If user is a bartender**: Automatically join session with ordering capabilities
4. **If user is NOT a bartender**:
   - View session in read-only mode
   - Option to "Request Bartender Access"
   - Admin can approve/deny request in real-time
5. All devices share the same session state (orders, cart, etc.)

### Placing an Order (Bartender during active session)
1. Navigate to Price List page
2. Add drinks to cart
3. Select member to charge
4. Review total
5. Confirm → Order created, member tab updated

### Managing Payments (Admin)
- **After Semester (every few months)**:
  1. Review member tab balances
  2. Members do bank transfers
  3. Admin records payments (full or partial)
  4. Add penalties for unpaid/late tabs
  5. System maintains complete payment history log

### Closing a Session (Admin)
1. End current session (set end time)
2. Review session statistics
3. Session moves to historical archive
4. New session can now be created

## Technical Requirements

### Frontend
- **Framework**: Next.js 15 with App Router
- **UI Components**: ShadCN/UI
- **Styling**: Tailwind CSS (ShadCN default)

### Backend
- **CMS**: PayloadCMS 3.0
- **Database**: MongoDB
- **Collections**: Members, Drinks, Sessions, Orders, Payments

### Data Integrity
- **Always maintain history/logs** - Never delete orders, payments, or sessions
- **Historical pricing** - Store drink price at time of order
- **Audit trail** - Track who made changes (admin actions)

### Session Constraints
- Only one active session at a time (enforce at database level)
- Bartenders must be selected BEFORE session activation
- **Orders can ONLY be placed during an active session** - No ordering outside of sessions
- Price list is view-only when no session is active

### Multi-Device Session Sharing
- **Session is device-independent** - Same session accessible from all devices
- When a device logs in during an active session, it joins that session (never creates a new one)
- Multiple bartenders can work simultaneously from different devices
- **Order and session data should sync via short polling or manual refresh**
  - For MVP: Use polling every 5–10 seconds or "Refresh" button to fetch latest session/orders
  - This avoids the complexity of WebSockets while keeping sessions relatively up-to-date
- Non-bartender users can request bartender access during active session
- Admins can approve bartender requests in real-time

## Admin Panel (Payload Backend)

Admins can manage:
- Members (CRUD operations)
- Drinks (CRUD operations)
- Sessions (Create, Close, View historical)
- Orders (View only, created via frontend)
- Payments (Create payment/penalty records)
- View all statistics and reports

## Future Considerations
- Export reports (CSV/PDF) for accounting
- Member self-service payment portal
- SMS/Email notifications for tab reminders
- Mobile-responsive design for bartender tablet use
