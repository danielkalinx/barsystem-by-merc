# Bar Management System - Development Plan

**Project**: K.Ö.H.V. Mercuria Bar Management System
**Stack**: PayloadCMS 3.0, Next.js 15, MongoDB
**Approach**: Incremental development with testing at each phase

---

## Overview

This plan breaks down development into 12 phases with 60 actionable tasks. Each phase includes dedicated testing tasks to ensure functionality works before moving forward. This allows for adjustments and validation at every step.

---

## Phase 1: Foundation & Setup
*Configure environment and database*

### Tasks
1. ✅ Configure MongoDB connection and verify `DATABASE_URI` env variable
2. ✅ Set up `PAYLOAD_SECRET` and verify basic Payload initialization
3. ✅ Create initial Users collection for authentication
4. 🧪 **TEST**: Verify Payload admin panel loads and first admin user can be created

**Success Criteria**: Admin panel accessible at `/admin`, can create first user

---

## Phase 2: Core Collections
*Build data models incrementally*

### Tasks
5. ✅ Create Members collection with fields: `name`, `email`, `rank`, `rankColors`, `tabBalance`
6. 🧪 **TEST**: Add sample members via admin panel (mix of Bursche/Fuchs ranks)
7. ✅ Create Drinks collection with fields: `name`, `price`, `category`, `available` status
8. 🧪 **TEST**: Add sample drinks and verify price/category filtering works
9. ✅ Create Sessions collection with `bartenders` array, `status`, revenue tracking
10. ✅ Create Orders collection with session/member/bartender refs, `items` array, `total`
11. ✅ Create Payments collection with member ref, `amount`, `type`, timestamp, admin notes
12. ✅ Run `pnpm generate:types` and verify TypeScript types are created

**Success Criteria**: All collections visible in admin panel, types generated at `src/payload-types.ts`

---

## Phase 3: Session Business Logic
*Implement core session constraints*

### Tasks
13. ✅ Add hook to Sessions: Enforce only ONE active session globally (`beforeChange`)
14. ✅ Add validation: Bartenders must be selected BEFORE session activation
15. 🧪 **TEST**: Try creating multiple active sessions (should fail), verify bartender requirement
16. ✅ Add session close logic: Calculate revenue, update status to 'closed'
17. 🧪 **TEST**: Open session, close session, verify revenue calculation and status change

**Success Criteria**: Only one active session possible, bartenders required, revenue calculated correctly

---

## Phase 4: Authentication & Role System
*Implement access control*

### Tasks
18. ✅ Configure Payload access control: Admin, Bartender (session-based), Member roles
19. ✅ Add access control to Orders: Only bartenders in active session can create
20. 🧪 **TEST**: Login as different roles, verify permissions (admin, bartender, member)

**Success Criteria**: Role-based access working, bartenders can only create orders during their session

---

## Phase 5: Ordering System
*Build order placement workflow*

### Tasks
21. ✅ Add Orders hook: Store drink price at order time (historical pricing)
22. ✅ Add Orders hook: Update member `tabBalance` on order creation (`afterChange`)
23. ✅ Add Orders hook: Update session revenue on order creation
24. ✅ Add validation: Orders only allowed during active session
25. 🧪 **TEST**: Place orders via admin, verify `tabBalance` updates, revenue tracking, historical pricing

**Success Criteria**: Orders update balances correctly, prices stored historically, session revenue tracked

---

## Phase 6: Frontend - Price List Page
*Route: `/prices`*

### Tasks
26. ✅ Create `/prices` page: Fetch and display drinks with ShadCN components
27. ✅ Add cart functionality: Add drinks to cart, show total
28. ✅ Add member selection: Dropdown to select who to charge
29. ✅ Implement order submission: Call Payload API to create order
30. ✅ Add role-based UI: Show cart only to bartenders during active session
31. 🧪 **TEST**: Place order from frontend, verify it appears in admin, balance updates

**Success Criteria**: Bartenders can place orders, members see view-only price list

---

## Phase 7: Frontend - Session Page
*Route: `/session`*

### Tasks
32. ✅ Create `/session` page: Display active session info (bartenders, revenue, orders)
33. ✅ Add session archive: List historical sessions with stats
34. ✅ Implement polling/refresh: Update session data every 5-10s or manual refresh
35. 🧪 **TEST**: Multi-device scenario - open session on device A, verify visible on device B

**Success Criteria**: Sessions sync across devices, historical data accessible

---

## Phase 8: Frontend - Members Page
*Route: `/members`*

### Tasks
36. ✅ Create `/members` page: List all members with rank colors, tab balances
37. ✅ Display rank colors as visual flag/badge (Bursche/Fuchs)
38. ✅ Add member detail view: Show payment history, order history
39. 🧪 **TEST**: Verify all member data displays correctly, colors match rank

**Success Criteria**: Member list shows correct data, rank colors display properly

---

## Phase 9: Payment Management
*Build payment tracking*

### Tasks
40. ✅ Create payment form: Record payment (full/partial), update `tabBalance`
41. ✅ Add penalty tracking: Allow admin to add penalties with notes
42. ✅ Add Payments hook: Update member `tabBalance` on payment (`afterChange`)
43. 🧪 **TEST**: Record payment, add penalty, verify balance calculations and history log

**Success Criteria**: Payments reduce balance, penalties increase balance, history maintained

---

## Phase 10: Advanced Features
*Bartender requests & refinements*

### Tasks
44. ✅ Implement bartender request system: Non-bartenders can request access mid-session
45. ✅ Add admin approval flow: Approve/deny bartender requests in real-time
46. 🧪 **TEST**: Request bartender access, approve, verify ordering capabilities granted

**Success Criteria**: Members can request bartender role, admin can approve/deny

---

## Phase 11: Testing & Quality Assurance
*Comprehensive testing*

### Tasks
47. ✅ Write integration tests: Test session constraints, order logic, payment updates
48. ✅ Write E2E tests: Test complete user workflows (login, order, payment)
49. ✅ Run `pnpm test` and fix any failures
50. 🧪 **TEST**: Manual testing - test all workflows on multiple devices simultaneously

**Success Criteria**: All automated tests pass, multi-device workflows validated

---

## Phase 12: Production Preparation
*Deploy to production*

### Tasks
51. ✅ Run `pnpm build` and verify production build succeeds
52. ✅ Configure production environment variables
53. ✅ Set up MongoDB production database and migrate schema
54. ✅ Deploy and verify all features work in production environment

**Success Criteria**: Application running in production, all features functional

---

## Key Testing Checkpoints

### After Phase 2: Data Model Validation
- All collections work via admin panel
- Sample data can be created for each collection
- TypeScript types generated correctly

### After Phase 5: Backend Logic Validation
- Complete order flow works (backend only)
- Tab balances update correctly
- Session constraints enforced

### After Phase 8: Frontend Integration Validation
- Multi-device session synchronization works
- All pages render correctly
- Role-based UI displays properly

### After Phase 9: Payment System Validation
- Payment calculations accurate
- Balance updates work correctly
- History maintained properly

### Phase 11: Full Regression Testing
- Integration tests pass
- E2E tests pass
- Manual multi-device testing successful

---

## Development Commands Reference

### Core Development
```bash
pnpm dev                 # Start dev server
pnpm devsafe             # Start dev (clean cache)
pnpm build               # Build for production
pnpm start               # Start production server
pnpm lint                # Lint code
```

### Testing
```bash
pnpm test                # Run all tests
pnpm run test:int        # Run integration tests (Vitest)
pnpm run test:e2e        # Run E2E tests (Playwright)
```

### Payload
```bash
pnpm generate:types      # Generate TypeScript types
pnpm generate:importmap  # Generate import map
pnpm payload [command]   # Payload CLI
```

---

## Technical Stack

- **Backend**: PayloadCMS 3.0 (Headless CMS + API)
- **Frontend**: Next.js 15 App Router
- **Database**: MongoDB (Mongoose adapter)
- **UI Components**: ShadCN/UI + Tailwind CSS
- **Testing**: Vitest (integration) + Playwright (E2E)
- **TypeScript**: Strict mode enabled

---

## Critical Business Rules

### Session Management
- **Only ONE active session globally** (enforced at database level)
- Bartenders selected BEFORE activation (minimum 1)
- Orders ONLY during active session
- Multi-device sync via polling (5-10s) or manual refresh

### Member Ranks & Colors
- **Bursche**: `#A57D42, #E10909, #FFFFFF` (brown/gold, red, white)
- **Fuchs**: `#E10909, #FFFFFF, #E10909` (red, white, red)

### Authentication & Roles
- **Admin**: Full access (manage members/sessions/payments)
- **Bartender**: Session-based (place orders during their session)
- **Member**: View-only (own tab, prices, session info)

### Data Integrity
- Never delete orders, payments, or sessions
- Store drink price at order time (historical pricing)
- Maintain complete audit trail

---

## Next Steps

1. **Start with Phase 1**: Set up environment variables and verify MongoDB connection
2. **Create Users collection**: Enable admin panel authentication
3. **Proceed incrementally**: Complete each phase before moving to next
4. **Test at checkpoints**: Run tests after each phase completion
5. **Adjust as needed**: Modify plan based on findings during development

**See PRD.md for complete feature specifications and business logic.**
