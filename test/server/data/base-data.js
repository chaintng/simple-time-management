module.exports = {
  users: [
    {
      name: 'Bob',
      email: 'bob@example.com',
      password: '$2a$10$29aoi9ZA78RMYDxbVXABQOmqVVlkAfPzxuJ9ktmYuiU5rliWWYxEm',
      preferred_working_hour: 8
    },
    {
      name: 'Alice',
      email: 'alice@example.com'
    },
  ],
  jobs: [
    {
      title: 'Scaffolding Project',
      note: 'Using React',
      user_id: 1,
      date: new Date('2017-12-20'),
      hour: 7
    },
    {
      title: 'Login Component',
      note: 'Without CSS Styling',
      user_id: 1,
      date: new Date('2017-12-21'),
      hour: 4
    },
    {
      title: 'Login Component',
      note: 'Styling & Responsive',
      user_id: 1,
      date: new Date('2017-12-23'),
      hour: 4
    },
    {
      title: 'Dashboard',
      note: 'Dashboard for daily activity',
      user_id: 2,
      date: new Date('2017-12-23'),
      hour: 4
    }
  ]
};