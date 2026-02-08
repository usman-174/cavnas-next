CAB2Wealth — Technical Scope & Architecture Document
Phase: Landing Page Finalization + Reservation Dashboard (Pre-API Phase)
Prepared By
Usman — Full Stack Engineer
Date
Feb 2026
________________________________________
1. Objective
This phase delivers the finalized marketing landing page and a functional onboarding dashboard focused on:
•	User signup & authentication
•	Reservation list tracking
•	Tier assignment
•	Admin visibility
•	UI-only financial dashboard experience
⚠️ This phase does NOT include banking integrations (Stripe Treasury / Unit.co).
Platform operates purely as:
•	Client onboarding
•	Tier tracking
•	Reservation positioning
•	Internal management
All financial transfers occur externally.
________________________________________
2. Functional Scope
2.1 Landing Page Updates
Content/UI Changes
•	Header text modification
•	Paragraph rewrites
•	Remove inaccurate metrics
•	Replace Assets Managed → Assets Allocated
•	Add full legal disclaimer block
•	Replace feature cards text
•	Update pricing section
•	Update “How it Works”
•	Replace features section with:
Reservation Capacity Visualization
Dynamic component displaying:
•	Current signups
•	Tier capacity
•	Reservation progress
Example:
Tier 1 Capacity
743 / 1000 Reserved
This requires backend data connection.
________________________________________
2.2 User System
Authentication
•	Email/password signup
•	Login/logout
•	Session persistence
Stored User Data
•	Reservation number
•	Tier selected
•	Signup timestamp
•	Status
No identity verification required in this phase.
________________________________________
2.3 Reservation Engine
On signup:
1️⃣ User selects tier
2️⃣ Record saved to database
3️⃣ Reservation number assigned automatically
reservation_number =
count(users where tier=X) + 1
Displayed in dashboard.
________________________________________
2.4 Client Dashboard
UI/UX Financial Simulation Only
Features
•	Default balance symbol
$♾
•	Display reservation number
•	Informational text about bonus positioning
•	Remove Recent Movements section
No financial calculations performed.
________________________________________
2.5 Admin Dashboard
Restricted access panel allowing:
Visibility
•	Total signups
•	Tier counts
•	User list
•	Reservation order
•	Email records
Management
•	Modify tier
•	Change status
•	Manual edits
Essential for operational tracking.
________________________________________
3. Recommended Technology Stack
Frontend
•	Next.js (Existing)
•	React Server Components
•	TailwindCSS
•	ShadCN/UI
Backend (Inside Next.js)
•	Next.js Route Handlers
•	Server Actions
Database
PostgreSQL
Reasoning:
•	Structured relational data
•	Strong consistency
•	Scales properly
•	Ideal for tier tracking
ORM
Prisma
Benefits:
•	Type safety
•	Migration control
•	Fast development
•	Excellent Next.js integration
Authentication
NextAuth (Auth.js)
Supports:
•	Email login
•	Session management
•	Secure cookies
________________________________________
4. Infrastructure
Hosting
Vercel (Recommended)
Database Hosting Options
•	Supabase
•	Neon
•	Railway
(All production ready)
________________________________________
5. Data Model (Simplified)
User
Field	Type
id	uuid
email	string
password_hash	string
tier	int
reservation_number	int
status	enum
created_at	timestamp
________________________________________
Tier
Field	Type
id	int
capacity	int
current_count	int
________________________________________
6. Security Considerations
•	Rate limiting on signup
•	Bot protection (Captcha optional)
•	Password hashing (bcrypt)
•	Secure headers
•	Admin route protection
________________________________________
7. Future Integration Ready Design
Architecture intentionally supports:
•	Stripe Treasury
•	Unit.co
•	KYC verification
•	Payment billing
•	Asset ledger
•	Wallet balances
•	Contract signing
No refactor required later.
________________________________________
8. Implementation Roadmap
Phase Steps
Step 1
Landing page textual/UI changes
Step 2
Database setup
Step 3
Authentication implementation
Step 4
Reservation system logic
Step 5
Client dashboard updates
Step 6
Admin panel
Step 7
Testing & deployment
________________________________________
9. Estimated Complexity
Low–Medium Engineering Effort
This phase is primarily:
•	UI work
•	Auth setup
•	Data tracking
No financial infrastructure yet.
________________________________________
10. Summary
This implementation creates a scalable foundation allowing CAB2Wealth to:
•	Onboard users
•	Track tier capacity
•	Display reservation positioning
•	Manage participants internally
while preparing the platform for later financial API integrations without architectural rewrites.
________________________________________
End of Document

