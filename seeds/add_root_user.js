
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('users').del(),

    // Inserts seed entries
    knex('users').insert({
      id: 1,
      name: 'Root Example',
      email: 'root@example.com',
      password: '$2a$10$gSt00FbJBfFA5MEGdcIU1eeE2ShzNiOcJ0iughG3.jGZcfBMK952u',
      preferred_working_hour: 8,
      role: 'ADMIN_USER',
      gender: 'male',
      picture: 'https://lh4.ggpht.com/_kg7Qbu5kDpbjbJ2R3SvjAHKr5V0AKSsVR7nEaQznrDwFWDAD1QSrFDdcYLeqXLKLw=w300'
    }),
  );
};
