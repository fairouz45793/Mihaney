# Corporate Workflow & File-Sharing Hub

A single-page dashboard for file sharing, task assignment, and Manager-to-Employee negotiation with strict role hierarchy.

## Quick Start

Open `index.html` in a web browser. No build step or server required.

## Organizational Structure & Employee Limits

**Service Allocation**: Each employee belongs to only ONE service. No overlap.

**Member Counts per Service**:
- Service 1: 7 members (1 Chef + 6 Employees)
- Service 2: 5 members (1 Chef + 4 Employees)
- Service 3: 6 members (1 Chef + 5 Employees)
- Service 4: 4 members (1 Chef + 3 Employees)
- Service 5: 3 members (1 Chef + 2 Employees)

**Roles**: 1 Admin, 1 Manager, 5 Service Chefs (one per service), 20 Employees

## Hierarchy & Authority

- **Admin**: Oversees everyone. Only role that can Delete. Full visibility via Parameters.
- **Manager**: Sets company goals. Adds tasks, assigns to Chefs/employees, pokes anyone. Sees all Services.
- **Service Chef**: Responsible for one of 5 Services. Can only poke within their department. Sees their Service Menu only.
- **Employee**: Receives tasks, Accepts or Declines (with written justification), uploads files. Simplified view.

## Role Views

### Employee View
- Simplified interface: only assigned tasks and file upload area
- No Admin Parameters, no Manager statistics, no Chef menus
- Notification bell for pokes

### Service Chef View
- "Service Menu" for their department only
- Poke button for their team
- Cannot see Admin Parameters or other departments
- Chat for justification logs

### Manager View
- All Services and all statistics
- Add Task and Poke buttons
- Cannot see Admin Delete functions
- Chat for negotiation and justification logs

### Admin View
- Parameters (gear icon) - add/delete employees and files
- Delete any task
- Full visibility across all services

## Functional Logic

- **Poke & Alert**: Manager/Chef pokes employee → Employee gets notification → Accept (hides from others) or Decline (must type justification)
- **File Submission**: Employee checks Done → Uploads file → Clicks OK → Manager/Chef stats update
- **Messaging**: Chat sidebar for task negotiation and justification logs

## Design

- **Menu Button**: Reveals navigation options based on user's rank
- **Colors**: Green (completion), Red (stuck/declined), Blue (active work)
- **User Role Switcher**: At top for testing - UI hides/shows based on role

## Tech Stack

- HTML5
- Tailwind CSS (CDN)
- Vanilla JavaScript
