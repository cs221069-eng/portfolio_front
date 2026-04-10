export const navItems = [
  { label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
  { label: 'Hero', icon: 'person', path: '/hero' },
  { label: 'About', icon: 'badge', path: '/about' },
  { label: 'Skills', icon: 'bolt', path: '/skills' },
  { label: 'Projects', icon: 'account_tree', path: '/projects' },
  { label: 'Education', icon: 'school', path: '/education' },
  { label: 'Contact', icon: 'alternate_email', path: '/contact' },
  { label: 'Messages', icon: 'forum', path: '/messages' },
  { label: 'Resume', icon: 'description', path: '/resume' },
  { label: 'Settings', icon: 'settings', path: '/settings' },
]

export const dashboardStats = [
  { label: 'Total Skills', value: '9', meta: 'Verified', icon: 'bolt', tone: 'cyan' },
  { label: 'Total Projects', value: '12', meta: 'Published', icon: 'account_tree', tone: 'blue' },
  { label: 'Total Messages', value: '24', meta: 'New', icon: 'forum', tone: 'violet' },
  { label: 'Views', value: '1.2k', meta: '+12%', icon: 'visibility', tone: 'green' },
]

export const messageFeed = [
  { initials: 'JD', name: 'Jane Doe', time: '2 hours ago', text: 'Interested in collaborating on the upcoming NFT marketplace project.' },
  { initials: 'MT', name: 'Mark Thompson', time: 'Yesterday', text: 'Feedback on the initial wireframes for the health app looks promising.' },
  { initials: 'SA', name: 'Sarah Ahmed', time: '3 days ago', text: 'Can we book a discovery call for the portfolio redesign discussion?' },
]

export const growthBars = [58, 76, 39, 92, 48, 84, 57]

export const verifiedSkills = [
  { name: 'JavaScript', level: 'Expert', code: 'JS', tone: 'cyan' },
  { name: 'TypeScript', level: 'Advanced', code: 'TS', tone: 'blue' },
  { name: 'React Native', level: 'Expert', code: 'RE', tone: 'orange' },
]

export const heroForm = {
  status: 'Currently Working',
  company: 'Quantum Flow',
  name: 'Alexander Sterling',
  role: 'Senior Full-Stack Architect & Creative Developer',
  description:
    'I specialize in building high-performance web applications with a focus on seamless user experience and modern architecture. Currently pushing the boundaries of WebGL and React.',
}

export const skillsCatalog = [
  { name: 'JavaScript', badge: 'Expert', usage: 'Core frontend logic, dashboards, API integration', level: 96 },
  { name: 'React', badge: 'Expert', usage: 'Admin panels, design systems, production SPAs', level: 94 },
  { name: 'Node.js', badge: 'Advanced', usage: 'REST APIs, auth flows, deployment automation', level: 88 },
  { name: 'Tailwind / CSS', badge: 'Expert', usage: 'Responsive UI systems and visual polish', level: 92 },
  { name: 'MongoDB', badge: 'Advanced', usage: 'Schema design and dashboard reporting', level: 82 },
  { name: 'Figma', badge: 'Advanced', usage: 'Admin UX planning and handoff workflows', level: 85 },
]

export const projects = [
  {
    name: 'FYP-Management',
    status: 'Active',
    tag: 'Case Study',
    description:
      'A comprehensive management system for Final Year Projects, featuring mentor allocation, timeline tracking, and milestone reminders.',
  },
  {
    name: 'Nexus Engine',
    status: 'Archived',
    tag: 'Internal Tool',
    description: 'An internal ops layer for routing client requests, approvals, and automated updates.',
  },
  {
    name: 'Kinetic UI Kit',
    status: 'Published',
    tag: 'Design System',
    description: 'A modular UI kit with glassmorphism cards, data widgets, and high-contrast controls.',
  },
]

export const educationItems = [
  { title: 'BS Software Engineering', place: 'University Program', period: '2019 - 2023', detail: 'Focused on web engineering, data structures, and product design systems.' },
  { title: 'Frontend Specialization', place: 'Professional Track', period: '2023 - 2024', detail: 'Advanced React patterns, routing, state, and accessible component design.' },
  { title: 'Continuous Learning', place: 'Independent Labs', period: 'Ongoing', detail: 'UI architecture, system design, AI-assisted workflows, and performance tuning.' },
]

export const contactMethods = [
  { label: 'Email', value: 'admin@portfolio.dev', icon: 'alternate_email' },
  { label: 'Phone', value: '+92 300 0000000', icon: 'call' },
  { label: 'Location', value: 'Karachi, Pakistan', icon: 'location_on' },
  { label: 'LinkedIn', value: 'linkedin.com/in/moiz', icon: 'public' },
]

export const messages = [
  { sender: 'Jane Doe', subject: 'Partnership inquiry', preview: 'We want to collaborate on a fintech dashboard case study.', status: 'Unread' },
  { sender: 'Mark Thompson', subject: 'Portfolio feedback', preview: 'The visual direction is strong. Can you share your pricing tiers?', status: 'Follow-up' },
  { sender: 'Sarah Ahmed', subject: 'Hiring discussion', preview: 'We are considering you for a senior frontend contract role.', status: 'Priority' },
  { sender: 'Ali Khan', subject: 'Resume request', preview: 'Please send your latest CV and selected project highlights.', status: 'Resolved' },
]

export const securitySettings = [
  { title: 'Two-Factor Authentication', description: 'Secondary sign-in verification for privileged admin access.', value: 'Enabled' },
  { title: 'Session Timeout', description: 'Auto-closes inactive admin sessions across all devices.', value: '15 Minutes' },
  { title: 'Backup Policy', description: 'Nightly export of hero, project, and inquiry data.', value: 'Scheduled' },
]
