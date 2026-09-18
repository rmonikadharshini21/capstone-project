1. Title
Smart Waste Management System
2. Domain
Environmental Management / Smart City
3. Who is the user? (2–3 user types, with roles)
Citizen – Registers, requests waste pickup, tracks collection status, and earns reward points.
Waste Collector – Views assigned collection requests, updates collection status, and manages daily tasks.
Admin – Manages users, waste categories, schedules, rewards, and monitors the entire system.
4. What problem are we solving?
Many residential areas still depend on manual waste collection, making it difficult for citizens to request pickups or know the collection status. This leads to delayed collections, overflowing bins, and poor communication between citizens and waste collection staff. For example, a resident may have recyclable waste but has no easy way to request a pickup or track when it will be collected.
5. Proposed Solution
The Smart Waste Management System is a web application that allows citizens to register, request waste collection, track request status, and earn reward points for proper waste disposal. Waste collectors can manage assigned requests and update collection status. The admin can manage users, schedules, waste categories, and monitor overall system activities through a dashboard.
6. Core Entities / Database Tables
Users
Waste Requests
Waste Categories
Collection Schedules
Rewards
Feedback
Notifications
7. User Roles & Permissions
Admin
Manage users
Manage waste categories
Assign collection schedules
View reports and feedback
Manage rewards
Citizen
Register/Login
Request waste collection
Track request status
View rewards
Submit feedback
Waste Collector
View assigned requests
Update collection status
Manage daily collection schedule
8. Success Criteria
A citizen should be able to submit a waste collection request in under 2 minutes.
Waste collectors should be able to update collection status easily.
Admin should be able to monitor all waste collection activities through the dashboard.
9. Out of Scope
Online payment integration
GPS live vehicle tracking
IoT smart bin sensors
AI-based image recognition of waste
Mobile application (web application only)
10. Chosen Track
Python – FastAPI