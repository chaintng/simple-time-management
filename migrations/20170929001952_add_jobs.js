
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('jobs', function(table) {
      table.increments();
      table.string('title');
      table.string('note');
      table.integer('user_id').unsigned();
      table.dateTime('date');
      table.double('hour');
      table.timestamps();
      table.foreign('user_id').references('users.id')
    })
  ]);
};

exports.down = function(knex, Promise) {

};
